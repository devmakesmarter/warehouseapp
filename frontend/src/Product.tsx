import type {ProductProps} from "./types.ts";

export default function Product(props: ProductProps){

    return(
        <>
            <div>
                <h1>{props.id}</h1>
                <h1>{props.name}</h1>
                <h1>{props.barcode}</h1>
                <h1>{props.description}</h1>
                <h1>{props.quantity}</h1>
                <h1>{props.category}</h1>
            </div>


        </>



    )

}