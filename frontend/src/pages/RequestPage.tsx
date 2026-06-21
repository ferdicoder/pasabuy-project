import type { RequestResponse} from "../interface/Request.interface";
import usePull from "../hooks/usePull";
import Header from "../components/Header";
import RequestCard from "../components/RequestCard";


export default function RequestPage(){
  /*
  const [reqData, setReqData] = useState<RequestResponse[]>([]); 
  
//   useEffect(() => {

//     const loadReq = async () => {
//       try {
//         const url = 'http://localhost:5000/api/v1/request/getAll';
//         const res = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (!res.ok) throw new Error('Request Error');
        
//         const result = await res.json();
//         setReqData(result); 

//       } catch (error) {
//         console.log(`Error: ${error}`);
//       }
//     };

//     loadReq();
// }, []); 

*/
  
  const reqData = usePull<RequestResponse>('http://localhost:5000/api/v1/trips/getAll');  
  
  return (
    <section className="py-24">
      <Header username="Current User"/>

      <div className="grid grid-cols-1 2xl:grid-cols-6 md:grid-cols-3 xl:grid-cols-4 sm:grid-cols-2 gap-4 px-16">
        {
          reqData.map(req =>(
            <RequestCard key={req.request_id} { ...req }/>
          ))
        }
      </div>
    </section>
  )
}