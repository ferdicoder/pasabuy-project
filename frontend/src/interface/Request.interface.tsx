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

interface RequestCardProp extends RequestResponse{
  onTakeRequest?: () => unknown
}

interface RequestFormProp {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRequestPayload) => unknown;
}

type CreateRequestPayload = Pick<RequestResponse,
  'title' | 'estimated_price' | 'origin' | 'delivery_location' | 'description'
> & { imageUrl?: string, buyer_id: number} //for change dont put PK in FE};

export type{
  RequestResponse,
  RequestCardProp,
  CreateRequestPayload,
  RequestFormProp
}