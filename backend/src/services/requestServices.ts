import { sql } from "../config/query";
import type {  ReqList, UpdateReqList } from "../interface/reqList.interface";

async function createReqList(requestData: ReqList) {
  const query = `
    INSERT INTO requests(
      buyer_id, 
      title, 
      description, 
      estimated_price, 
      origin,
      delivery_location
    ) 
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `
  const val = [
    requestData.buyer_id,
    requestData.title,
    requestData.description,
    requestData.estimated_price,
    requestData.origin,
    requestData.delivery_location,
  ];

  const newRequest = await sql(query, val);
  if(newRequest.rowCount === 0) throw Error('creation failed'); 
  
  return newRequest.rows[0]; 
}

async function readOneReqList(reqId: string){
  const query = `
    SELECT * 
    FROM requests 
    WHERE request_id = $1; 
  `
  const val = [reqId]; 
  
  const reqList = await sql(query, val); 
  if(reqList.rowCount === 0) throw new Error('not found'); 
  
  return reqList.rows[0]; 
}


// to be chaged for pagination, filtering, and sorting
async function readReqList(){
  const query = `
    SELECT 
      r.request_id,
      r.buyer_id, 
      r.title, 
      r.description, 
      r.estimated_price AS "estimatedPrice", 
      r.origin,
      r.delivery_location, 
      r.imageurl AS "imageUrl",
      r.status,
      r.created_at AS "createdAt",
      u.username AS buyerUsername
    FROM requests r 
    JOIN users u ON r.buyer_id = u.user_id
  `
  
  const reqList = await sql(query); 
  if(reqList.rowCount === 0) throw new Error('not found'); 
  
  return reqList.rows; 
}

async function updateReqList(reqId: string, requestData: UpdateReqList) {
  await readOneReqList(reqId);

  // use coalesce fn to prevent nullish value
  const query = `
    UPDATE requests
    SET
      buyer_id = COALESCE($2, buyer_id),
      title = COALESCE($3, title),
      description = COALESCE($4, description),
      estimated_price = COALESCE($5, estimated_price),
      origin = COALESCE($6, origin),
      delivery_location = COALESCE($7, delivery_location)
    WHERE request_id = $1
    RETURNING *
  `;
  const val = [
    reqId,
    requestData.buyer_id,
    requestData.title,
    requestData.description,
    requestData.estimated_price,
    requestData.origin,
    requestData.delivery_location,
  ];

  const updatedReq = await sql(query, val);
  if(updatedReq.rowCount === 0) throw new Error('update failed');

  return updatedReq.rows[0];
}

async function deleteReqList(reqId: string){
  await readOneReqList(reqId);
  
  const query = `
    DELETE FROM requests
    WHERE request_id = $1
    RETURNING *
  `;
  const val = [reqId];

  const deletedReq = await sql(query, val);
  if(deletedReq.rowCount === 0) throw new Error('delete failed');

  return deletedReq.rows[0];
}

export{
  createReqList,
  readReqList,
  updateReqList,
  deleteReqList,
  readOneReqList
}