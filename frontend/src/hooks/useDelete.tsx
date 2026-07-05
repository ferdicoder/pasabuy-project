import { useCallback } from "react";

export default function useDelete(url: string){
  const deleteItem = useCallback(async (id: string) =>{
    try{
      const urlPATH = url.concat('/', id);
      const res = await fetch(urlPATH, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if(!res.ok) throw new Error('Deletion error'); 
      
      console.log('Deleted', res.json); 
    }catch(error){
      console.log(error)
    }
  }, [url]); 

  return { deleteItem }
}