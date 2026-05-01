import ProductCard from "../components/ProductCard"; 
import Header from "../components/Header";

export default function ProductPage(){
  return(
    <>
      <Header />

      <section className="grid grid-cols-6 pt-32 px-8 gap-4 items-center">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </section>
    </>
  )
}