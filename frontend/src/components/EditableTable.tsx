import { useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";

//
// Column<T>: Beschreibt eine Tabellenspalte für beliebige Datentypen
// T = generischer Typ (z. B. Product oder Warehouse)
//
export type Column<T> = {
    key: keyof T; // Schlüssel im Datentyp (z. B. "name", "quantity")
    label: string; // Spaltenüberschrift
    editable?: boolean; // Darf diese Spalte bearbeitet werden?
    inputType?: "text" | "number" | "select"; // Eingabetyp im Bearbeitungsmodus
    selectOptions?: { value: string; label: string }[]; // Dropdown-Optionen für select

    // Optionales Custom-Rendering
    render?: (value: T[keyof T], row: T, isEditing: boolean) => React.ReactNode;
};

//
// Props<T> beschreibt die Eigenschaften, die die Tabelle erwartet
// Alles ist generisch, damit die Tabelle mit jedem Datentyp funktioniert
//
type Props<T> = {
    columns: Column<T>[];                   // Spaltenbeschreibung
    data: T[];                              // Tabellenzeilen
    setData: (rows: T[]) => void;           // Funktion zum Setzen der Daten
    onSave: (row: T) => Promise<T>;         // Speichern eines Datensatzes
    onDelete: (id: string) => Promise<void>; // Löschen eines Datensatzes
    editingId: string | null;               // Aktuelle editierte Zeile
    setEditingId: (id: string | null) => void; // Setter für editingId
};

//
// EditableTable<T>: Wiederverwendbare generische Tabelle
// T muss immer eine id:string haben
//
export default function EditableTable<T extends { id: string }>({
                                                                    columns,
                                                                    data,
                                                                    setData,
                                                                    onSave,
                                                                    onDelete,
                                                                    editingId,
                                                                    setEditingId
                                                                }: Props<T>) {

    // Speichert die Werte, die gerade editiert werden
    const [editValues, setEditValues] = useState<Partial<T>>({});

    //
    // Bearbeitung beginnen
    //
    const startEdit = (row: T) => {
        if (editingId) return; // Nur eine Zeile gleichzeitig bearbeiten
        setEditingId(row.id);
        setEditValues(row); // Anfangswerte füllen
    };

    //
    // Bearbeitung abbrechen
    //
    const cancelEdit = () => {
        if (!editingId) return;

        // Wenn die Zeile neu ist → wieder entfernen
        if (editingId.startsWith("new-")) {
            setData(prev => prev.filter(r => r.id !== editingId));
        }

        setEditingId(null);
        setEditValues({});
    };

    //
    // Änderungen speichern
    //
    const saveRow = async () => {
        if (!editingId) return;

        // Originalzeile finden
        const row = data.find(d => d.id === editingId);
        if (!row) return;

        // Merge mit editValues → an onSave übergeben
        const updated = await onSave({ ...row, ...editValues } as T);

        // Lokale Daten aktualisieren
        setData(prev =>
            prev.map(p => (p.id === editingId ? updated : p))
        );

        setEditingId(null);
        setEditValues({});
    };

    //
    // Zeile löschen
    //
    const deleteRow = async (id: string) => {
        if (editingId) return; // Während Editieren nicht löschen

        if (!confirm("Wirklich löschen?")) return;

        await onDelete(id);

        // Lokal aus der Tabelle entfernen
        setData(prev => prev.filter(p => p.id !== id));
    };

    //
    // TABELLE RENDERN
    //
    return (
        <table className="w-full bg-white shadow rounded-xl overflow-hidden">
            <thead className="bg-gray-100 border-b">
            <tr>
                {/* Kopfzeilen rendern */}
                {columns.map(col => (
                    <th key={String(col.key)} className="p-3 text-left">
                        {col.label}
                    </th>
                ))}
                <th></th>
                <th></th>
            </tr>
            </thead>

            <tbody>
            {data.map(row => {
                const isEditing = editingId === row.id;

                return (
                    <tr key={row.id} className="border-b hover:bg-gray-50">

                        {/* Spalten rendern */}
                        {columns.map(col => {
                            const baseValue = (row as any)[col.key]; // Wert aus Zeile
                            const value = isEditing
                                ? (editValues as any)[col.key] // Bearbeiteter Wert
                                : baseValue;

                            //
                            // BEARBEITUNGSMODUS
                            //
                            if (isEditing && col.editable) {

                                // Dropdown
                                if (col.inputType === "select" && col.selectOptions) {
                                    return (
                                        <td key={String(col.key)} className="p-3">
                                            <select
                                                value={value}
                                                className="border rounded p-1 w-full"
                                                onChange={e =>
                                                    setEditValues(prev => ({
                                                        ...prev,
                                                        [col.key]: e.target.value
                                                    }))
                                                }
                                            >
                                                {col.selectOptions.map(o => (
                                                    <option key={o.value} value={o.value}>
                                                        {o.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    );
                                }

                                // Text- oder Nummernfeld
                                return (
                                    <td key={String(col.key)} className="p-3">
                                        <input
                                            className="border rounded p-1 w-full"
                                            value={value}
                                            type={col.inputType === "number" ? "number" : "text"}
                                            onChange={e =>
                                                setEditValues(prev => ({
                                                    ...prev,
                                                    [col.key]:
                                                        col.inputType === "number"
                                                            ? Number(e.target.value)
                                                            : e.target.value
                                                }))
                                            }
                                        />
                                    </td>
                                );
                            }

                            //
                            // Custom Renderer
                            //
                            if (col.render) {
                                return (
                                    <td key={String(col.key)} className="p-3">
                                        {col.render(baseValue, row, isEditing)}
                                    </td>
                                );
                            }

                            //
                            // Normaler Text
                            //
                            return (
                                <td key={String(col.key)} className="p-3">
                                    {baseValue}
                                </td>
                            );
                        })}

                        {/* ACTION BUTTONS */}
                        <td className="p-3 text-center">
                            {isEditing ? (
                                <button
                                    className="text-green-600 hover:text-green-800"
                                    onClick={saveRow}
                                >
                                    <Save size={16} />
                                </button>
                            ) : (
                                <button
                                    disabled={!!editingId}
                                    className={`text-yellow-600 hover:text-yellow-800 ${
                                        editingId ? "opacity-30 cursor-not-allowed" : ""
                                    }`}
                                    onClick={() => startEdit(row)}
                                >
                                    <Pencil size={16} />
                                </button>
                            )}
                        </td>

                        <td className="p-3 text-center">
                            {isEditing ? (
                                <button
                                    className="text-gray-600 hover:text-gray-800"
                                    onClick={cancelEdit}
                                >
                                    <X size={16} />
                                </button>
                            ) : (
                                <button
                                    disabled={!!editingId}
                                    className={`text-red-600 hover:text-red-800 ${
                                        editingId ? "opacity-30 cursor-not-allowed" : ""
                                    }`}
                                    onClick={() => deleteRow(row.id)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </td>

                    </tr>
                );
            })}
            </tbody>
        </table>
    );
}
