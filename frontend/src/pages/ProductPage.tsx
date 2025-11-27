import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import EditableTable, { type Column } from "../components/EditableTable";
import { Plus } from "lucide-react";

// Produkt-Datentyp
export type Product = {
    id: string;
    name: string;
    quantity: number;
    barcode: string;
    category: string;
};

// Lagerhaus-Datentyp
export type Warehouse = {
    id: string;
    name: string;
};

export default function ProductPage() {

    // Holt die warehouseId aus der URL (/warehouse/:warehouseId/products)
    const { warehouseId } = useParams();

    // Produktliste
    const [products, setProducts] = useState<Product[]>([]);

    // Info über das aktuelle Lagerhaus für die Überschrift
    const [warehouse, setWarehouse] = useState<Warehouse | null>(null);

    // Welche Zeile gerade im Editiermodus ist
    const [editingId, setEditingId] = useState<string | null>(null);

    // Ladezustand
    const [loading, setLoading] = useState(true);

    // Produkte aus API laden
    useEffect(() => {
        axios.get(`/api/product/warehouse/${warehouseId}`).then(res => {
            setProducts(res.data);
            setLoading(false);
        });
    }, [warehouseId]);

    // Lagerhausdaten (Name, etc.) laden
    useEffect(() => {
        axios.get(`/api/warehouse/${warehouseId}`).then(res => {
            setWarehouse(res.data);
        });
    }, [warehouseId]);

    // Tabellenspalten definieren
    const columns: Column<Product>[] = [
        {
            key: "name",
            label: "Produktname",
            editable: true,
            // Wenn nicht im Editmodus → Link zu Produktdetails
            render: (v, row) => (
                <Link
                    to={`/productdetails/${row.id}`}
                    className="text-blue-600 underline"
                >
                    {v}
                </Link>
            )
        },
        { key: "quantity", label: "Menge", editable: true },
        { key: "barcode", label: "Barcode", editable: true },
        { key: "category", label: "Kategorie", editable: true },
    ];

    // Speichert neue oder bestehende Produkte
    const handleSave = async (row: Product) => {

        // Neues Produkt
        if (row.id.startsWith("new-")) {
            const res = await axios.post("/api/product", {
                ...row,
                warehouseId        // Produkt wird diesem Lagerhaus zugeordnet
            });
            return res.data;
        }

        // Bestehendes Produkt aktualisieren
        const res = await axios.put(`/api/product/${row.id}`, row);
        return res.data;
    };

    // Produkt endgültig löschen
    const handleDelete = async (id: string) => {
        await axios.delete(`/api/product/${id}`);
    };

    // Neue Produktzeile einfügen
    const handleAdd = () => {
        const id = "new-" + Math.random();

        setProducts(prev => [
            {
                id,
                name: "",
                quantity: 0,
                barcode: "",
                category: ""
            },
            ...prev
        ]);

        // Neue Zeile sofort editieren
        setEditingId(id);
    };

    // Ladeanzeige
    if (loading) return <p className="p-4">Lade Produkte…</p>;

    return (
        <div className="max-w-5xl mx-auto mt-10">

            {/* Titel + "Produkt hinzufügen" Button */}
            <div className="flex justify-between mb-6">
                <h1 className="text-xl font-bold">
                    Lagerhaus: {warehouse?.name}
                </h1>

                <button
                    onClick={handleAdd}
                    // Button deaktivieren, wenn bereits ein neues Produkt erstellt wird
                    disabled={products.some(p => p.id.startsWith("new-"))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl 
        ${products.some(p => p.id.startsWith("new-"))
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                    <Plus size={18} />
                    Produkt
                </button>
            </div>

            {/* Wiederverwendbare Tabellensablone */}
            <EditableTable
                columns={columns}
                data={products}
                setData={setProducts}
                onSave={handleSave}
                onDelete={handleDelete}
                editingId={editingId}
                setEditingId={setEditingId}
            />
        </div>
    );
}
