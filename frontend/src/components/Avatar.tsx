type AvatarProp = {
  username: string
}
function Avatar({ username }: AvatarProp){
  let getInitial = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=0D8ABC&color=fff&rounded=true&size=64`;

  return( 
    <img
      src={getInitial}
      alt={`${username} avatar`}
      className="w-9 h-9 rounded-full  "
    />
  )
} 

export{
  Avatar,
  type AvatarProp
}

