import { Route, Routes } from 'react-router-dom';
import RequestPage from './pages/RequestPage';
import TripPage from './pages/TripPage';
import Header from './components/Header';


function App() {
  return (
    // <Routes>
    //   <Route path="/" element={ <RequestPage/> } />
    //   <Route path="/trips" element={ <TripPage /> } /> 
    // </Routes>
    <>
      <Header username={`PasaBUY`}/>
    </>
    
  )
}

export default App;