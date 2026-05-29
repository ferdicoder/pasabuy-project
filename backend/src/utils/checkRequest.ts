import { type Response } from 'express'; 

type Payload = Record<string, unknown>

export default function checkRequest(
  payload: unknown,
  res: Response,
  requiredFields: string[] = []
){ 
  if(!payload || typeof payload !== 'object') {
    res.status(400).json({ "message": "Invalid" }); 
    throw new Error('Invalid Request')
  }

  const body = payload as Payload
  const missingFields = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null
  )

  if(missingFields.length > 0) {
    res.status(400).json({ "message": "Missing fields", fields: missingFields });
    throw new Error('Invalid Request')
  }
}