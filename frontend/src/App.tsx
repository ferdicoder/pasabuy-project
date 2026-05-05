import { Route, Routes } from 'react-router-dom';
import ListingPage from "./pages/ListingPage"; 
import ProductPage from './pages/ProductPage';


function App() {
  return (
    <Routes>
     <Route path="/" element={ <ProductPage /> } />
     <Route path="/listing" element={ <ListingPage /> } /> 
    </Routes>
  )
}

export default App
