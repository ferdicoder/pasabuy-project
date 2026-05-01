import type InputProp from "../types/InputProp"

export default function TextInput({ type, placeholder, borderColor }: InputProp){
  return(
    <input className={`${borderColor}, border placeholder:italic`}
      type={type} 
      placeholder={placeholder} 
    />
  )
}