import { Route, Routes } from 'react-router-dom';
import RequestPage from './pages/RequestPage';
import TripPage from './pages/TripPage';



function App() {
  return (
    <Routes>
      <Route path="/" element={ <RequestPage/> } />
      <Route path="/trips" element={ <TripPage /> } /> 
    </Routes>
  )
}

export default App;