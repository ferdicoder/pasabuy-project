import type ButtonProp from "../interface/ButtonProp"

// fill design for buy
export default function ProductButton({name}: ButtonProp){  
  
  return(
    <button className={`border cursor-pointer rounded-sm hover`}>
      {name}
    </button>
  )
}