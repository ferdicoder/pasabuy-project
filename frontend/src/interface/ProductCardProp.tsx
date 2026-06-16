export default interface ProductCardProp{
  title: string;
  estimatedPrice: number;
  origin?: string;
  description?: string;
  createdAt: string;
  buyerUsername: string;
  status: string
  imageUrl?: string;
  deliveryLocation: string; 
  onTakeRequest?: () => unknown
}