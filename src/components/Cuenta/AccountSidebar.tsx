import React from "react";
import { Package, MapPin, User, LogOut, ShieldCheck } from "lucide-react";

type Tab = "pedidos" | "direcciones" | "perfil";

interface AccountSidebarProps {
    displayName: string;
    displayLastName: string;
    email: string;
    phone?: string;
    isAdmin: boolean;
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    onLogout: () => void;
}

export default function AccountSidebar({
    displayName,
    displayLastName,
    email,
    phone,
    isAdmin,
    activeTab,
    onTabChange,
    onLogout,
}: AccountSidebarProps) {
    const navItems: { tab: Tab; icon: React.ReactNode; label: string }[] = [
        { tab: "pedidos", icon: <Package size={20} />, label: "Mis Pedidos" },
        { tab: "direcciones", icon: <MapPin size={20} />, label: "Direcciones" },
        { tab: "perfil", icon: <User size={20} />, label: "Mi Perfil" },
    ];

    return (
        <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <p className="font-bold text-gray-900">
                        {displayName} {displayLastName}
                    </p>
                    <p className="text-xs text-gray-500">{email}</p>
                    {phone && <p className="text-xs text-gray-400 mt-1">{phone}</p>}
                    {isAdmin && (
                        <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
                            <ShieldCheck size={11} /> Administrador
                        </span>
                    )}
                </div>
                <nav className="flex flex-col p-2">
                    {navItems.map(({ tab, icon, label }) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${
                                activeTab === tab
                                    ? "text-indigo-600 bg-indigo-50"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {icon} {label}
                        </button>
                    ))}
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left mt-4 border-t border-gray-100 w-full"
                    >
                        <LogOut size={20} /> Cerrar Sesión
                    </button>
                </nav>
            </div>
        </aside>
    );
}
