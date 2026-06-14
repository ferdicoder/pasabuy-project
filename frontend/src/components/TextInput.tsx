import type InputProp from "../interface/InputProp"

export default function TextInput({ type, placeholder, borderColor }: InputProp){
  return(
    <input className={`${borderColor}, border placeholder:italic`}
      type={type} 
      placeholder={placeholder} 
    />
  )
}