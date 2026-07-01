import { useCallback } from 'react'

export default function usePost<T>(url: string){
  const postRequest = useCallback(async (payload:  T) =>{
    try{
      const res = await fetch(url, {
        method: 'POST',
        headers:{ 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if(!res.ok) throw new Error('request post failed'); 

      const data = await res.json();
      console.log('success', data)
    }catch(error){
      console.log(error); 
    }
  }, [url])
  
  return { postRequest }; 
}