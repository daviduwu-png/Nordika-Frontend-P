import React from "react";
import { MapPin } from "lucide-react";

interface AddressesTabProps {
    addresses: any[];
    onAddNew: () => void;
    onEdit: (address: any) => void;
    onDelete: (id: number) => void;
}

export default function AddressesTab({
    addresses,
    onAddNew,
    onEdit,
    onDelete,
}: AddressesTabProps) {
    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold">Mis Direcciones</h2>
                <button
                    onClick={onAddNew}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                >
                    + Añadir Dirección
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.length === 0 ? (
                    <p className="text-gray-500 col-span-2">No tienes direcciones guardadas.</p>
                ) : (
                    addresses.map((addr: any, idx: number) => (
                        <div
                            key={addr.id || idx}
                            className={`border ${
                                addr.is_default ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
                            } rounded-lg p-4 relative`}
                        >
                            {addr.is_default && (
                                <span className="absolute top-2 right-2 text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
                                    Principal
                                </span>
                            )}
                            <p className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                <MapPin size={16} className="text-gray-500" /> {addr.alias || "Dirección"}
                            </p>
                            <p className="text-sm text-gray-600">
                                {addr.street} #{addr.exterior_number}{" "}
                                {addr.interior_number ? `Int. ${addr.interior_number}` : ""}
                            </p>
                            <p className="text-sm text-gray-600">Col. {addr.neighborhood}</p>
                            <p className="text-sm text-gray-600 mb-1">
                                {addr.city}, {addr.state} {addr.postal_code}
                            </p>
                            {addr.phone && (
                                <p className="text-sm text-gray-500 mb-1">📞 {addr.phone}</p>
                            )}
                            {addr.reference && (
                                <p className="text-xs text-gray-500 italic mb-2">Ref: {addr.reference}</p>
                            )}
                            <p className="text-sm text-gray-600 mb-4">{addr.country}</p>
                            <div className="flex gap-3 text-sm">
                                <button
                                    onClick={() => onEdit(addr)}
                                    className="text-indigo-600 hover:underline font-medium"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete(addr.id)}
                                    className="text-red-500 hover:underline font-medium"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
