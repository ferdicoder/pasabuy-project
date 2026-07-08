import { useCallback } from 'react'

export default function usePatch<T>(url: string){
  const patchItem = useCallback(async (id: string, payload: T)=>{
    try{
      const urlAPI = url.concat('/', id); 

      const res = await fetch(urlAPI, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if(!res.ok) throw new Error('Patch failed'); 
      
      const data = await res.json()
      console.log('success', data)
    }catch(error){
      console.log(error)
    }

  }, [url]); 

  return { patchItem }
}