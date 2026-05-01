
export default function ListingButton(){
  return(
    <div className="border w-fit rounded-md flex flex-col items-center p-2 cursor-pointer h-fit ">

      <button className="cursor-pointer">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="24" cy="24" r="22" />
        <line x1="24" y1="16" x2="24" y2="32" />
        <line x1="16" y1="24" x2="32" y2="24" />
      </svg>
     </button>

     <p>Add Product</p>
    </div>
    
  )
}