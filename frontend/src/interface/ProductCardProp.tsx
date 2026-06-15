export default interface ProducCardProp{
  title: string;
  estimatedPrice: number;
  origin: string;
  description?: string;
  createdAt: string;
  buyerUsername: string;
  imageUrl?: string;
  onTakeRequest?: () => void;
}