import type { Request, Response } from 'express'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 


import type { 
  Users
} from '../interface/user.internface';

import { 
  createUser, 
  readUser,
  issueToken
} from '../services/userServices';




async function registerUser(req:Request, res:Response){
  if(!validateRegisterBody(req.body)) return res.sendStatus(400); 
  
  try{
    let { username, password, email }: Users = req.body; 
    const hashedPass = await bcrypt.hash(password, 10); 
    password = hashedPass; 

    const newUser = await createUser({username, password, email});
    
    return res.status(201).json(newUser); 
  }catch(error){
    console.log(`Error MEssage: ${error}`); 
    return res.sendStatus(500)
  }
}
function validateRegisterBody(body: any): boolean{
  if(!body) return false;
  const { username, password, email} = body; 

  return typeof username === "string" && typeof password === "string" && typeof email === "string";
}


async function logInUser(req:Request, res:Response){
  if(!validateLoginBody(req.body)) return res.sendStatus(400); 
  const { email, password }: Users = req.body; 

  try{
    const user = await readUser(email); 

    const passwordOk = await bcrypt.compare(password, user.password);
    if(!passwordOk) return res.sendStatus(401);

    const { accessToken, refreshToken } = signTokens(user); 
    const hashRefresh = await bcrypt.hash(refreshToken, 10); 
    await issueToken(hashRefresh, user.user_id); // save to db
    

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.sendStatus(200);
  }catch(error){
    console.log(`Error Message: ${error}`);
    return res.sendStatus(500);
  }
}
function validateLoginBody(body: any): boolean{
  if(!body) return false;
  const { password, email} = body; 

  return typeof password === "string" && typeof email === "string";
}
function signTokens(user: any){
  const accessSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
  if(!refreshSecret || !accessSecret) throw new Error('some secret token is missing');

  const accessToken = jwt.sign(
    { userId: user.user_id, email: user.email },
    accessSecret,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { userId: user.user_id },
    refreshSecret,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken }; 
}


export{
  registerUser,
  logInUser
}