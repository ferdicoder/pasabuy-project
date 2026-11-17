import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ActivityPage from '../pages/ActivityPage';
import RequestPage from '../pages/RequestPage';
import TripPage from '../pages/TripPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import ProtectedRoutes from '../Layouts/ProtectedRoutes';
import LandingPage from '../pages/LandingPage';

export default function AppRoutes(){
  return(
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={ <LoginPage /> } />
      <Route path='/register' element={ <RegisterPage /> } />

      <Route element={ <ProtectedRoutes /> }>
        <Route path='/home' element={ <HomePage /> }/> 
        <Route path='/activities' element={ <ActivityPage /> } />
        <Route path="/requests" element={ <RequestPage/> } />
        <Route path="/trips" element={ <TripPage /> } /> 
        <Route path="/profile" element={ <ProfilePage /> } />
      </Route>

    </Routes>
  )
}