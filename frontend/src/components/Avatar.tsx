const profileName = "Pasabuy User";
const profileInitialAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=0D8ABC&color=fff&rounded=true&size=64`;

export default function Avatar(){
  return( 
    <img
      src={profileInitialAvatar}
      alt={`${profileName} avatar`}
      className="w-9 h-9 rounded-full  "
    />
  )
}