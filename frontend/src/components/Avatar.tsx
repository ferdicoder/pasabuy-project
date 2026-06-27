export default function Avatar({ username, tripStyle }: {username: string, tripStyle?: string}){
  return( 
    <img
      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0D8ABC&color=fff&rounded=true&size=64`}
      alt={`${username} avatar`}
      className={tripStyle ? `${tripStyle}` : "w-8 h-8 rounded-full"}
      
      
    />
  )
}

