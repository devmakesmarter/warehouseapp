import {useState, useEffect} from "react";
import Product from "./Product";
import type {ProductProps} from "./types.ts";
import  axios from "axios";


export default function ProductOverview(){

    const [allProducts, setAllProducts] = useState<ProductProps[]>([])

    function Request(){
        axios.get("/api/getall")
            .then((e) => {
                setAllProducts(e.data);
                console.log(e)}  )

    }

    useEffect(() =>{
        Request()
        console.log(allProducts)
    }, [])


    return(
        <>
              {allProducts.map(product => (<Product id={product.id} name={product.name} barcode={product.barcode} category={product.category} description={product.description} quantity={product.quantity} key={product.id}   /> ))}  </>


    )


}