import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export type Product = {
    id: string;
    name: string;
    quantity: number;
};

export default function WarehouseProductsPage() {
    const { warehouseId } = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`/api/product/warehouse/${warehouseId}`)
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [warehouseId]);

    if (loading) return <p className="p-4">Lade Produkte…</p>;

    return (
        <div className="flex justify-center w-full mt-10">
            <div className="w-full max-w-4xl">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Produkte in Lagerhaus {warehouseId}
                </h1>

                <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="text-left p-4 font-semibold">Produktname</th>
                        <th className="text-left p-4 font-semibold">Menge</th>
                        <th className="text-left p-4 font-semibold">Details</th>
                    </tr>
                    </thead>

                    <tbody>
                    {products.map((p) => (
                        <tr
                            key={p.id}
                            className="border-b hover:bg-gray-50 transition"
                        >
                            {/* Produktname */}
                            <td className="p-4">
                                {p.name}
                            </td>

                            {/* Menge */}
                            <td className="p-4">
                                {p.quantity}
                            </td>

                            {/* Link zur Detail-Seite */}
                            <td className="p-4">
                                <Link
                                    to={`/productdetails/${p.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Öffnen →
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
}
