import Header from "../components/Header";
import ListingButton from "../components/ListingButton";
import ProductCard from "../components/ProductCard";

export default function ListingPage(){
  return(
    <>
      <section className="py-24 px-4">
        <Header />

        <ListingButton />

        <div className="grid grid-cols-6 mt-2">
          <ProductCard page="listing"/>
          <ProductCard page="listing"/>
          <ProductCard page="listing"/>
          <ProductCard page="listing"/>
          <ProductCard page="listing"/>
          <ProductCard page="listing"/>
        </div>

      </section>
    </>
  )
}