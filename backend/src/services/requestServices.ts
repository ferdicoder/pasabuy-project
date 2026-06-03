import { sql } from "../config/query";
import type { ReqList } from "../interface/reqList.interface";

async function createRequest(requestData: ReqList) {
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
  if(newRequest.rowCount === 0) throw Error('request listing creation failed'); 
  
  return newRequest.rows[0]; 
}

export{
  createRequest
}