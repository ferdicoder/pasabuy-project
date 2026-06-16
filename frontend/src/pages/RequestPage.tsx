import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import type ProductCardProp from "../interface/ProductCardProp";

const testData: ProductCardProp = {
  title: "starbery",
  estimatedPrice: 100,
  origin: 'Baguio',
  description: 'mga nasa baguio dyan baka namanaaaaaaaaaaaaaaaaaaaaaaan',
  createdAt: '2h',
  buyerUsername: 'Mang Gustine'
}


export default function RequestPage(){
  return (
    <section className="py-24">
      <Header username="Current User"/>

      <div className="grid grid-cols-1 2xl:grid-cols-6 md:grid-cols-3 xl:grid-cols-4 sm:grid-cols-2 gap-4 px-16">
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
        <ProductCard { ...testData}/>
      </div>
    </section>
  )
}