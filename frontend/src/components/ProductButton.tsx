type ProductButtonProps = {
  name: string;
};

// fill design for buy
export default function ProductButton({ name }: ProductButtonProps) {  
  
  return(
    <button className={`border cursor-pointer rounded-sm hover`}>
      {name}
    </button>
  )
}