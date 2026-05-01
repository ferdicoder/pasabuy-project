import type ButtonProp from "../types/ButtonProp"

// fill design for buy
export default function ProductButton({name}: ButtonProp){  
  
  return(
    <button className={`border cursor-pointer rounded-sm hover`}>
      {name}
    </button>
  )
}