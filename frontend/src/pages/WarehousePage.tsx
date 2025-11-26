import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export type Warehouse = {
    id: string;
    name: string;
    address: string;
};

export default function WarehousePage() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/warehouse")
            .then(res => {
                setWarehouses(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <p className="p-4">Lade Lagerhäuser…</p>;

    return (
        <div className="flex justify-center w-full mt-10">
            <div className="w-full max-w-3xl">
                <h1 className="text-2xl font-bold mb-6 text-center">Lagerhäuser</h1>

                <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="text-left p-4 font-semibold">Name</th>
                        <th className="text-left p-4 font-semibold">Adresse</th>
                    </tr>
                    </thead>

                    <tbody>
                    {warehouses.map((wh) => (
                        <tr
                            key={wh.id}
                            className="border-b hover:bg-gray-50 transition"
                        >
                            <td className="p-4 pr-20">
                                <Link
                                    to={`/warehouse/${wh.id}/products`}
                                    className="text-blue-600 hover:underline"
                                >
                                    {wh.name}
                                </Link>
                            </td>

                            <td className="p-4 text-gray-700">
                                {wh.address}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
