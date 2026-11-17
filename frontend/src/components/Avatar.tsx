export default function Avatar({ username, tripStyle }: {username: string, tripStyle?: string}){
  return( 
    <img
      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=FF6500&color=191A17&rounded=true&size=64`}
      alt={`${username} avatar`}
      className={tripStyle ? `${tripStyle}` : "w-8 h-8 rounded-full"}
      
      
    />
  )
}
