import ProductButton from "./ProductButton"; 
import productImage from "../assets/images.jpg"; // to remove 
import type ProductCardProp from "../types/ProductCardProp";

export default function ProductCard({ page }: ProductCardProp){
    return(
      <div className="shadow-sm w-72 h-112 flex flex-col justify-between p-4 rounded-md bg-white" >
        <div className="flex  h-50">
          <img 
            className="object-fill w-full rounded-md "
            src={productImage} alt="Strawberry 16pcs" 
          />
        </div>
        
        <div>
          <h1 className="font-bold">Strawberry 16pcs </h1>
        </div>

        <div>
          <p>From: Baguio</p>
        </div>

        <div>
          avatar name 4.5
        </div>
        
        <div className="flex flex-col gap-2">
          <ProductButton name="Buy"/>
          <ProductButton name="Add to Bag"/>
        </div>

      </div>
    )
  }