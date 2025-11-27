import { useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";

export type Column<T> = {
    key: keyof T;
    label: string;
    editable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
};

type Props<T> = {
    columns: Column<T>[];
    data: T[];
    setData: React.Dispatch<React.SetStateAction<T[]>>;
    onSave: (row: T) => Promise<T>;
    onDelete: (id: string) => Promise<void>;

    editingId: string | null;
    setEditingId: (id: string | null) => void;

    newRowBlocked: boolean;
};

export default function EditableTable<T extends { id: string }>({
                                                                    columns,
                                                                    data,
                                                                    setData,
                                                                    onSave,
                                                                    onDelete,
                                                                    editingId,
                                                                    setEditingId,
                                                                    newRowBlocked,
                                                                }: Props<T>) {
    const [editValues, setEditValues] = useState<Partial<T>>({});

    const startEdit = (row: T) => {
        setEditingId(row.id);
        setEditValues(row);
    };

    const cancelEdit = () => {
        if (!editingId) return;

        // Wenn neue Zeile → löschen
        if (editingId.startsWith("new-")) {
            setData(prev => prev.filter(r => r.id !== editingId));
        }

        setEditingId(null);
        setEditValues({});
    };

    const saveRow = async () => {
        if (!editingId) return;

        const row = data.find(d => d.id === editingId);
        if (!row) return;

        const updated = await onSave({ ...row, ...editValues } as T);

        setData(prev =>
            prev.map(p => (p.id === editingId ? updated : p))
        );

        setEditingId(null);
        setEditValues({});
    };

    const deleteRow = async (id: string) => {
        if (!confirm("Wirklich löschen?")) return;

        await onDelete(id);
        setData(prev => prev.filter(p => p.id !== id));
    };

    return (
        <table className="w-full bg-white shadow rounded-xl overflow-hidden">
            <thead className="bg-gray-100 border-b">
            <tr>
                {columns.map(col => (
                    <th key={String(col.key)} className="p-3 text-left">
                        {col.label}
                    </th>
                ))}
                <th className="w-10"></th>
                <th className="w-10"></th>
            </tr>
            </thead>

            <tbody>
            {data.map(row => {
                const isEditing = editingId === row.id;
                const isNew = row.id.startsWith("new-");

                return (
                    <tr key={row.id} className="border-b hover:bg-gray-50">

                        {columns.map(col => {
                            const value = (row as any)[col.key];

                            return (
                                <td key={String(col.key)} className="p-3">

                                    {isEditing && col.editable ? (
                                        <input
                                            className="border rounded p-1 w-full"
                                            defaultValue={value}
                                            onChange={(e) =>
                                                setEditValues(prev => ({
                                                    ...prev,
                                                    [col.key]: e.target.value,
                                                }))
                                            }
                                        />
                                    ) : col.render ? (
                                        col.render(value, row)
                                    ) : (
                                        <span>{value}</span>
                                    )}

                                </td>
                            );
                        })}

                        {/* ACTIONS */}
                        <td className="p-3 text-center">
                            {isEditing ? (
                                <button
                                    className="text-green-600 hover:text-green-800 disabled:text-gray-400"
                                    onClick={saveRow}
                                    disabled={newRowBlocked && !isNew}
                                >
                                    <Save size={18} />
                                </button>
                            ) : (
                                <button
                                    className="text-yellow-600 hover:text-yellow-800 disabled:text-gray-400"
                                    onClick={() => startEdit(row)}
                                    disabled={newRowBlocked}
                                >
                                    <Pencil size={18} />
                                </button>
                            )}
                        </td>

                        <td className="p-3 text-center">
                            {isEditing ? (
                                <button
                                    className="text-gray-600 hover:text-gray-800"
                                    onClick={cancelEdit}
                                >
                                    <X size={18} />
                                </button>
                            ) : (
                                <button
                                    className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                                    onClick={() => deleteRow(row.id)}
                                    disabled={newRowBlocked}
                                >
                                    <Trash2 size={18} />
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
