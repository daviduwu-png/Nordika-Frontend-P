import React from "react";
import { Edit2, X, Save, Loader2 } from "lucide-react";

interface ProfileTabProps {
    displayName: string;
    displayLastName: string;
    email: string;
    phone: string;
    // Modo edición
    editing: boolean;
    saving: boolean;
    form: { first_name: string; last_name: string; email: string; phone: string };
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onFormChange: (field: keyof ProfileTabProps["form"], value: string) => void;
}

export default function ProfileTab({
    displayName,
    displayLastName,
    email,
    phone,
    editing,
    saving,
    form,
    onEdit,
    onCancel,
    onSave,
    onFormChange,
}: ProfileTabProps) {
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Mi Perfil</h2>
                {!editing ? (
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Edit2 size={15} /> Editar
                    </button>
                ) : (
                    <button
                        onClick={onCancel}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 px-4 py-2 rounded-lg transition-colors"
                    >
                        <X size={15} /> Cancelar
                    </button>
                )}
            </div>

            {!editing ? (
                /* Vista de solo lectura */
                <div className="space-y-4">
                    {[
                        { label: "Nombre", value: `${displayName} ${displayLastName}`.trim() },
                        { label: "Correo electrónico", value: email },
                        { label: "Teléfono", value: phone || "No registrado" },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-gray-100"
                        >
                            <span className="text-sm font-medium text-gray-500 sm:w-44">{label}</span>
                            <span className="text-sm text-gray-900">{value}</span>
                        </div>
                    ))}
                </div>
            ) : (
                /* Formulario de edición */
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={form.first_name}
                                onChange={(e) => onFormChange("first_name", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Tu nombre"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                            <input
                                type="text"
                                value={form.last_name}
                                onChange={(e) => onFormChange("last_name", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Tus apellidos"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            disabled
                            className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            El correo no se puede cambiar desde aquí.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => onFormChange("phone", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ej: 5512345678"
                        />
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={onSave}
                            disabled={saving}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {saving ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
