import { useState, useEffect } from "react";

export default function usePull<T>(url: string){
  const [state, setState] = useState<T[]>([])

  useEffect(() =>{
    const getData = async () => {
      try{
        const urlAPI = url 
        const data = await fetch(urlAPI, {
          method: 'GET', 
          headers: { 'Content-Type': 'application/json' }
        })
        if(!data.ok) throw new Error('Request Failed'); 
        
        const result = await data.json();
        setState(result); 
        
      }catch(error){
        console.log(error)
      }
      
    }
    getData(); 
  }, [url]); 
  
  return state
}