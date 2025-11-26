import axios from "axios";
import {type ChangeEvent, type FormEvent, useEffect, useState} from "react";

// ELECTRONICS ("Elektronik"),
//     SPORT_EQUIPMENT ("Sportartikel"),
//     COSMETICS ("Kosmetik"),
//     CLOTHING ("Kleidung");
//     public record NewProductDTO(
//         String name,
//         String description,
//         int quantity,
//         Category category) {
// }
export type ProductCategories = "ELECTRONICS" | "SPORT_EQUIPMENT" | "COSMETICS" | "CLOTHING"

const categories = [
    { label: 'ELECTRONICS', value: 'ELECTRONICS' },
    { label: 'SPORT_EQUIPMENT', value: 'SPORT_EQUIPMENT' },
    { label: 'COSMETICS', value: 'COSMETICS' },
    { label: 'CLOTHING', value: 'CLOTHING' },
];
//export const allPossibleProductCategories: ProductCategories[] = ["ELECTRONICS" , "SPORT_EQUIPMENT" , "COSMETICS" , "CLOTHING"]

export type Todo = {
    id: string,
    description: string,
    status: ProductCategories,
}
export type ProductDTO={
    name: string,
    description: string,
    quantity: number,
    category: ProductCategories
}

export default function AddProduct() {
    const [newProduct, setNewProduct] = useState<ProductDTO>({name: "testy", description: "ist testprodukt", quantity: 0,category:"ELECTRONICS"});
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productQuantity, setProductQuantity] = useState(0);
    const [productCategory, setProductCategory] = useState<ProductCategories>("ELECTRONICS");


    function handleSubmit(event:FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setNewProduct({name: productName, description: productDescription, quantity: productQuantity,category:productCategory});
    }

    function resetForm() {
        setProductName("");
        setProductDescription("");
        setProductCategory("ELECTRONICS");
        setProductQuantity(0);
    }

    function addNewProduct(){
        axios.post("/api/product",
            newProduct)
        .then(response => {console.log(response.data);})
    }

    const handleChange = (event:ChangeEvent<HTMLSelectElement>) => {
        setProductCategory(event.target.value);
    };

    useEffect(() => {
        console.log(newProduct);
        addNewProduct();
    },[newProduct])

    return (
        <>
            <h1>Add a new Product</h1>
            <form onSubmit={handleSubmit}>
                <label>Product Name:
                <input
                    name={"Product Name"}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder={"Enter Product Name"}
                    value={productName}
                />
                </label>

                <label>Product Description:
                <input
                    name={"Product Description"}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder={"Enter Product Description"}
                    value={productDescription}
                />
                </label>

                <label>Quantity:
                <input
                    name={"Quantity"}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    placeholder={"Enter quantity"}
                    type="number"
                    value={productQuantity}
                />
                </label>

                <label>Category:
                    <select value={productCategory} onChange={handleChange}>
                        {categories.map((category) => (
                            <option value={category.value}>{category.label}</option>
                        ))}
                    </select>
                </label>
                <button type="submit">Submit</button>
                <button type="reset" onClick={resetForm}>Reset</button>
            </form>

        </>
        //<button type="button">Reset</button>
    //<select name="selectedCategory" defaultValue="ELECTRONICS">
    //<option value="ELECTRONICS">ELECTRONICS</option>
    //<option value="SPORT_EQUIPMENT">SPORT_EQUIPMENT</option>
    //<option value="COSMETICS">COSMETICS</option>
    //<option value="CLOTHING">CLOTHING</option>
    )
}