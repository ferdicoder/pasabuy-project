import { Route, Routes } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import type ProductCardProp from './interface/ProductCardProp';

const cardData: ProductCardProp = {
  title: "starbery",
  estimatedPrice: 100,
  origin: 'Baguio',
  description: 'mga nasa baguio dyan baka naman',
  createdAt: '2h',
  buyerUsername: 'Mang Gustine'
}

function App() {
  return (
    <>
      <ProductCard {...cardData }/>
    </>
  )
}

export default App


 // <Routes>
    //  <Route path="/" element={ <ProductPage /> } />
    //  <Route path="/listing" element={ <ListingPage /> } /> 
    // </Routes>