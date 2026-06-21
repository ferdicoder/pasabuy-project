interface RequestResponse{
  request_id: string; 
  title: string;
  estimatedPrice: number;
  origin?: string;
  description?: string;
  createdAt: string;
  buyerUsername: string;
  status: string
  imageUrl?: string;
  delivery_location: string; 
  
} 

interface RequestCardProp extends RequestResponse{
  onTakeRequest?: () => unknown
}

type CreateRequestPayload = Pick<RequestResponse,
  'title' | 'estimatedPrice' | 'origin' | 'delivery_location' | 'description'
> & { imageUrl?: string };

export type{
  RequestResponse,
  RequestCardProp,
  CreateRequestPayload
}