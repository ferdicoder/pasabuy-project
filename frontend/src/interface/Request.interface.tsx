interface RequestResponse{
  request_id: string; 
  title: string;
  estimated_price: number;
  origin?: string;
  description?: string;
  createdAt: Date;
  buyerUsername: string;
  status: string
  imageUrl?: string;
  delivery_location: string; 
} 

type CreateRequestPayload = Pick<RequestResponse, 'title' | 'estimated_price' | 'origin' | 'delivery_location' | 'description' | 'imageUrl' > 

export type{
  RequestResponse,
  CreateRequestPayload,
}