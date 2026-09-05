import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ActivityPage from '../pages/ActivityPage';
import RequestPage from '../pages/RequestPage';
import TripPage from '../pages/TripPage';
import LoginPage from '../pages/LoginPage';

export default function AppRoutes(){
  return(
    <Routes>
      <Route path='/login' element={ <LoginPage /> } />
      <Route path='/' element={ <HomePage /> }/> 
      <Route path='/activities' element={ <ActivityPage /> } />
      <Route path="/requests" element={ <RequestPage/> } />
      <Route path="/trips" element={ <TripPage /> } /> 
      
    </Routes>
  )
}