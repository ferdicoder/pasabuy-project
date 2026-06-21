import { Route, Routes } from 'react-router-dom';
import RequestPage from './pages/RequestPage';
import TripPage from './pages/TripPage';



function App() {
  return (
    <TripPage />
    // <RequestPage/>
  )
}

export default App;


  // <Routes>
    //  <Route path="/" element={ <RequestPage/> } />
    //  <Route path="/TripPage" element={ <TripPage /> } /> 
    // </Routes>