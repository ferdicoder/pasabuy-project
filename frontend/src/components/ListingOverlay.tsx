import TextInput from "./TextInput"



export default function ListingOverlay(){
  return(
    <>
      <div >
        <div className="">
          <p>Product Name:</p>
          <TextInput type="text" placeholder="strawberry" />
        </div>
        
        <div>
          <p>Quantity:</p>
          <TextInput type="text" placeholder="1"/>
        </div>

        <div>
          <p>Description</p>
          <TextInput type="text" placeholder="from baguio"/>
        </div>
      </div>
    </>
  )
}