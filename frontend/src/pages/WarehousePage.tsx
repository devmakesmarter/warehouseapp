import { useEffect, useState } from "react";
import axios from "axios";
import EditableTable, { type Column } from "../components/EditableTable";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

// Datentyp für ein Lagerhaus
export type Warehouse = {
    id: string;
    name: string;
    city: string;
    street: string;
    houseNumber: string;
    zipCode: string;
};

export default function WarehousePage() {

    // Liste aller Lagerhäuser
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    // ID der Zeile, die aktuell im Editiermodus ist
    const [editingId, setEditingId] = useState<string | null>(null);

    // Lade-Indikator
    const [loading, setLoading] = useState(true);

    // Lädt Lagerhäuser beim Seitenaufruf
    useEffect(() => {
        axios.get("/api/warehouse").then(res => {
            setWarehouses(res.data);
            setLoading(false);
        });
    }, []);

    // Tabellen-Spalten – hier wird definiert, welche Felder editierbar sind
    const columns: Column<Warehouse>[] = [
        {
            key: "name",
            label: "Name",
            editable: true,
            // Wenn NICHT im Editiermodus: Feld wird als Link angezeigt
            render: (value, row) => (
                <Link
                    to={`/warehouse/${row.id}/products`}
                    className="text-blue-600 underline"
                >
                    {value}
                </Link>
            )
        },
        { key: "city", label: "Stadt", editable: true },
        { key: "street", label: "Straße", editable: true },
        { key: "houseNumber", label: "Nr.", editable: true },
        { key: "zipCode", label: "PLZ", editable: true },
    ];

    // Speichern einer Zeile (neu oder existierend)
    const handleSave = async (row: Warehouse) => {
        // Neue Zeile
        if (row.id.startsWith("new-")) {
            const res = await axios.post("/api/warehouse", row);
            return res.data;
        }

        // Bestehende Zeile aktualisieren
        const res = await axios.put(`/api/warehouse/${row.id}`, row);
        return res.data;
    };

    // Zeile endgültig löschen
    const handleDelete = async (id: string) => {
        await axios.delete(`/api/warehouse/${id}`);
    };

    // Neue Zeile anlegen
    const handleAdd = () => {
        const id = "new-" + crypto.randomUUID();

        // Neue leere Zeile oben einfügen
        setWarehouses(prev => [
            {
                id,
                name: "",
                city: "",
                street: "",
                houseNumber: "",
                zipCode: ""
            },
            ...prev
        ]);

        // Neue Zeile sofort in den Editiermodus setzen
        setEditingId(id);
    };

    // Ladeindikator
    if (loading) return <p className="p-4">Lade Lagerhäuser …</p>;

    return (
        <div className="max-w-5xl mx-auto mt-10">

            {/* Titel + Hinzufügen-Button */}
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Lagerhäuser</h1>

                <button
                    onClick={handleAdd}
                    // Button wird ausgegraut, wenn bereits eine neue Zeile existiert
                    disabled={warehouses.some(w => w.id.startsWith("new-"))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl 
                        ${warehouses.some(w => w.id.startsWith("new-"))
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                    <Plus size={18} />
                    Lagerhaus
                </button>
            </div>

            {/* Wiederverwendbares Tabellen-Template */}
            <EditableTable
                columns={columns}
                data={warehouses}
                setData={setWarehouses}
                onSave={handleSave}
                onDelete={handleDelete}
                editingId={editingId}
                setEditingId={setEditingId}
            />
        </div>
    );
}
