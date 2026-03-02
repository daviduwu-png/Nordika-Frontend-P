import React, { useEffect, useState } from "react";
import {
    Package, MapPin, CreditCard, LogOut, Truck,
    CheckCircle, User, Edit2, Save, X, AlertTriangle,
    RefreshCcw, ShieldCheck, Loader2, XCircle, Clock,
} from "lucide-react";
import { profileService } from "../services/profileService";
import { orderService } from "../services/orderService";
import { refundService } from "../services/refundService";
import { logout } from "../store/userStore";
import AddressModal from "./AddressModal";
import OrderDetailModal from "./OrderDetailModal";
import { sileo } from "sileo";
import "sileo/styles.css";

export default function CuentaView() {
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<"pedidos" | "direcciones" | "perfil">("pedidos");
    const [loading, setLoading] = useState(true);

    // Banner de pago (MP back_url)
    const [paymentBanner, setPaymentBanner] = useState<{ type: "success" | "pending" | "failed"; orderId?: string } | null>(null);

    // Estado admin
    const [isAdmin, setIsAdmin] = useState(false);
    const [refundingId, setRefundingId] = useState<number | null>(null);

    // Modal state - Direcciones
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);

    // Modal state - Detalles de orden
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    // Edición de perfil
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({ first_name: "", last_name: "", email: "", phone: "" });
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        // Leer query params de Mercado Pago back_urls
        const params = new URLSearchParams(window.location.search);
        const payment = params.get("payment");
        const orderId = params.get("order") || undefined;

        if (payment === "success") {
            setPaymentBanner({ type: "success", orderId });
            // Limpiar la URL sin recargar la página
            window.history.replaceState({}, "", "/cuenta");
        } else if (payment === "pending") {
            setPaymentBanner({ type: "pending", orderId });
            window.history.replaceState({}, "", "/cuenta");
        } else if (payment === "failed") {
            setPaymentBanner({ type: "failed", orderId });
            window.history.replaceState({}, "", "/cuenta");
        }
    }, []);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [profileData, ordersData, addressesData] = await Promise.all([
                    profileService.getProfile(),
                    orderService.getOrders(),
                    profileService.getAddresses(),
                ]);
                setProfile(profileData);
                setOrders(ordersData);
                setAddresses(addressesData);

                // Detectar si el usuario es admin (is_staff)
                if (profileData?.is_staff || profileData?.user?.is_staff) {
                    setIsAdmin(true);
                }

                // Pre-cargar formulario de perfil
                setProfileForm({
                    first_name: profileData?.first_name || profileData?.user?.first_name || "",
                    last_name: profileData?.last_name || profileData?.user?.last_name || "",
                    email: profileData?.email || profileData?.user?.email || "",
                    phone: profileData?.phone || "",
                });
            } catch (error) {
                console.error("Error al cargar la cuenta:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, []);

    const handleLogout = () => logout();

    // ── Direcciones ─────────────────────────────────────────────────────────────

    const handleOpenModal = (address?: any) => {
        setSelectedAddress(address || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAddress(null);
    };

    const handleSaveAddress = async (formData: any) => {
        try {
            if (selectedAddress) {
                await profileService.updateAddress(selectedAddress.id, formData);
                sileo.success({ title: "Dirección actualizada correctamente" });
            } else {
                await profileService.addAddress(formData);
                sileo.success({ title: "Dirección añadida correctamente" });
            }
            const newAddresses = await profileService.getAddresses();
            setAddresses(newAddresses);
            handleCloseModal();
        } catch (error) {
            console.error(error);
            sileo.error({ title: "Ocurrió un error al guardar la dirección" });
            throw error;
        }
    };

    const handleDeleteAddress = async (id: number) => {
        const toastId = sileo.action({
            title: "¿Eliminar dirección?",
            description: "Esta acción no se puede deshacer.",
            styles: { description: "text-gray-300 text-sm" },
            button: {
                title: "Eliminar",
                onClick: async () => {
                    sileo.dismiss(toastId);
                    try {
                        await profileService.deleteAddress(id);
                        setAddresses((prev) => prev.filter((addr) => addr.id !== id));
                        sileo.success({ title: "Dirección eliminada correctamente" });
                    } catch (error) {
                        console.error(error);
                        sileo.error({ title: "No se pudo eliminar la dirección" });
                    }
                },
            },
        });
    };

    // ── Perfil ───────────────────────────────────────────────────────────────────

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        try {
            const updated = await profileService.updateProfile({
                first_name: profileForm.first_name,
                last_name: profileForm.last_name,
                phone: profileForm.phone,
            });
            setProfile((prev: any) => ({ ...prev, ...updated }));
            setEditingProfile(false);
            sileo.success({ title: "Perfil actualizado correctamente" });
        } catch (error) {
            console.error(error);
            sileo.error({ title: "No se pudo actualizar el perfil" });
        } finally {
            setSavingProfile(false);
        }
    };

    // ── Reembolsos (solo admin) ───────────────────────────────────────────────────

    const handleRefund = async (order: any) => {
        const toastId = sileo.action({
            title: `¿Reembolsar orden #ORD-${String(order.id).padStart(3, "0")}?`,
            description: "Se procesará el reembolso completo y se restaurará el stock.",
            styles: { description: "text-gray-300 text-sm" },
            button: {
                title: "Confirmar reembolso",
                onClick: async () => {
                    sileo.dismiss(toastId);
                    setRefundingId(order.id);
                    try {
                        const result = await refundService.refundOrder(order.id);
                        sileo.success({
                            title: "Reembolso procesado",
                            description: `ID: ${result.refund_id}`,
                        });
                        // Actualizar estado de la orden en el listado
                        setOrders((prev) =>
                            prev.map((o) =>
                                o.id === order.id ? { ...o, status: "cancelled" } : o
                            )
                        );
                    } catch (error: any) {
                        console.error(error);
                        const msg =
                            error?.response?.data?.error || "No se pudo procesar el reembolso.";
                        sileo.error({ title: "Error en reembolso", description: msg });
                    } finally {
                        setRefundingId(null);
                    }
                },
            },
        });
    };

    // ── UI helpers ───────────────────────────────────────────────────────────────

    const getStatusBadge = (status: string) => {
        const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
            delivered: { label: "Entregado", cls: "bg-green-100 text-green-700", icon: <CheckCircle size={12} /> },
            paid: { label: "Pagado", cls: "bg-purple-100 text-purple-700", icon: <CreditCard size={12} /> },
            shipped: { label: "Enviado", cls: "bg-blue-100 text-blue-700", icon: <Truck size={12} /> },
            pending: { label: "Pendiente", cls: "bg-amber-100 text-amber-700", icon: <Clock size={12} /> },
            cancelled: { label: "Cancelado", cls: "bg-red-100 text-red-700", icon: <XCircle size={12} /> },
            failed: { label: "Fallido", cls: "bg-red-100 text-red-700", icon: <XCircle size={12} /> },
        };
        const cfg = map[status] ?? { label: status || "Pendiente", cls: "bg-amber-100 text-amber-700", icon: <Clock size={12} /> };
        return (
            <span className={`${cfg.cls} text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1`}>
                {cfg.icon} {cfg.label}
            </span>
        );
    };

    // ── Loading / Error ──────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center p-10">
                <p className="text-gray-500 mb-4">No se pudo cargar la información de la cuenta.</p>
                <button onClick={handleLogout} className="text-indigo-600 hover:underline">
                    Volver a iniciar sesión
                </button>
            </div>
        );
    }

    const displayName =
        profile.first_name || profile.user?.first_name || "Usuario";
    const displayLastName =
        profile.last_name || profile.user?.last_name || "";

    return (
        <div className="flex flex-wrap gap-8">
            <AddressModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveAddress}
                initialData={selectedAddress}
            />

            <OrderDetailModal
                order={selectedOrder}
                isOpen={isOrderModalOpen}
                onClose={() => { setIsOrderModalOpen(false); setSelectedOrder(null); }}
            />

            {/* ── Banner de resultado de pago ── */}
            {paymentBanner && (
                <div className="w-full"
                    style={{ flexBasis: "100%", order: -1 }}>
                    {paymentBanner.type === "success" && (
                        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3 shadow-sm">
                            <CheckCircle size={22} className="text-green-500 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-bold text-green-800">¡Pago recibido exitosamente!</p>
                                {paymentBanner.orderId && (
                                    <p className="text-xs text-green-600">
                                        Orden #ORD-{String(paymentBanner.orderId).padStart(3, "0")} · Recibirás un correo de confirmación pronto.
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setPaymentBanner(null)} className="text-green-400 hover:text-green-600">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    {paymentBanner.type === "pending" && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3 shadow-sm">
                            <Clock size={22} className="text-amber-500 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-bold text-amber-800">Pago en proceso</p>
                                {paymentBanner.orderId && (
                                    <p className="text-xs text-amber-600">
                                        Orden #ORD-{String(paymentBanner.orderId).padStart(3, "0")} · Tu pago está siendo procesado. Te avisaremos cuando se acredite.
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setPaymentBanner(null)} className="text-amber-400 hover:text-amber-600">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    {paymentBanner.type === "failed" && (
                        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center gap-3 shadow-sm">
                            <AlertTriangle size={22} className="text-red-500 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-bold text-red-800">El pago fue rechazado</p>
                                {paymentBanner.orderId && (
                                    <p className="text-xs text-red-600">
                                        Orden #ORD-{String(paymentBanner.orderId).padStart(3, "0")} · No se realizó ningún cargo. Puedes intentarlo de nuevo.
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setPaymentBanner(null)} className="text-red-400 hover:text-red-600">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Sidebar ── */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <p className="font-bold text-gray-900">
                            {displayName} {displayLastName}
                        </p>
                        <p className="text-xs text-gray-500">{profile.user?.email || profile.email}</p>
                        {profile.phone && <p className="text-xs text-gray-400 mt-1">{profile.phone}</p>}
                        {isAdmin && (
                            <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
                                <ShieldCheck size={11} /> Administrador
                            </span>
                        )}
                    </div>
                    <nav className="flex flex-col p-2">
                        <button
                            onClick={() => setActiveTab("pedidos")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === "pedidos" ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            <Package size={20} /> Mis Pedidos
                        </button>
                        <button
                            onClick={() => setActiveTab("direcciones")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === "direcciones" ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            <MapPin size={20} /> Direcciones
                        </button>
                        <button
                            onClick={() => setActiveTab("perfil")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === "perfil" ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:bg-gray-50"}`}
                        >
                            <User size={20} /> Mi Perfil
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left mt-4 border-t border-gray-100 w-full"
                        >
                            <LogOut size={20} /> Cerrar Sesión
                        </button>
                    </nav>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="flex-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                    {/* ──────────── TAB: PEDIDOS ──────────── */}
                    {activeTab === "pedidos" && (
                        <>
                            <h2 className="text-xl font-bold mb-6">Historial de Pedidos</h2>
                            <div className="space-y-4">
                                {orders.length === 0 ? (
                                    <p className="text-gray-500">Aún no tienes pedidos registrados.</p>
                                ) : (
                                    orders.map((order: any, idx) => (
                                        <div
                                            key={order.id || idx}
                                            className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-200 transition-colors"
                                        >
                                            <div>
                                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                    <span className="font-bold text-gray-900">
                                                        #ORD-{String(order.id).padStart(3, "0")}
                                                    </span>
                                                    {getStatusBadge(order.status)}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString("es-MX", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}{" "}
                                                    · {order.items ? order.items.length : 0} artículos
                                                </p>
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-2">
                                                <p className="font-bold text-gray-900">
                                                    ${parseFloat(order.total_amount || "0").toFixed(2)} MXN
                                                </p>
                                                <div className="flex gap-2 items-center flex-wrap justify-end">
                                                    <button
                                                        onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                                                        className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
                                                    >
                                                        Ver detalles
                                                    </button>
                                                    {/* Botón de reembolso solo visible para admins con órdenes pagadas */}
                                                    {isAdmin && order.status === "paid" && (
                                                        <button
                                                            onClick={() => handleRefund(order)}
                                                            disabled={refundingId === order.id}
                                                            className="text-xs flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 border border-red-200"
                                                        >
                                                            {refundingId === order.id ? (
                                                                <Loader2 size={11} className="animate-spin" />
                                                            ) : (
                                                                <RefreshCcw size={11} />
                                                            )}
                                                            Reembolsar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {/* ──────────── TAB: DIRECCIONES ──────────── */}
                    {activeTab === "direcciones" && (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <h2 className="text-xl font-bold">Mis Direcciones</h2>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                                >
                                    + Añadir Dirección
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {addresses.length === 0 ? (
                                    <p className="text-gray-500 col-span-2">No tienes direcciones guardadas.</p>
                                ) : (
                                    addresses.map((addr: any, idx) => (
                                        <div
                                            key={addr.id || idx}
                                            className={`border ${addr.is_default ? "border-indigo-500 bg-indigo-50" : "border-gray-200"} rounded-lg p-4 relative`}
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
                                            {addr.phone && <p className="text-sm text-gray-500 mb-1">📞 {addr.phone}</p>}
                                            {addr.reference && (
                                                <p className="text-xs text-gray-500 italic mb-2">Ref: {addr.reference}</p>
                                            )}
                                            <p className="text-sm text-gray-600 mb-4">{addr.country}</p>
                                            <div className="flex gap-3 text-sm">
                                                <button
                                                    onClick={() => handleOpenModal(addr)}
                                                    className="text-indigo-600 hover:underline font-medium"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
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
                    )}

                    {/* ──────────── TAB: PERFIL ──────────── */}
                    {activeTab === "perfil" && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Mi Perfil</h2>
                                {!editingProfile ? (
                                    <button
                                        onClick={() => setEditingProfile(true)}
                                        className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={15} /> Editar
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setEditingProfile(false)}
                                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <X size={15} /> Cancelar
                                    </button>
                                )}
                            </div>

                            {!editingProfile ? (
                                /* Vista de solo lectura */
                                <div className="space-y-4">
                                    {[
                                        { label: "Nombre", value: `${displayName} ${displayLastName}`.trim() },
                                        { label: "Correo electrónico", value: profile.user?.email || profile.email },
                                        { label: "Teléfono", value: profile.phone || "No registrado" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 py-3 border-b border-gray-100">
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
                                                value={profileForm.first_name}
                                                onChange={(e) => setProfileForm((p) => ({ ...p, first_name: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                                            <input
                                                type="text"
                                                value={profileForm.last_name}
                                                onChange={(e) => setProfileForm((p) => ({ ...p, last_name: e.target.value }))}
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
                                            value={profileForm.email}
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
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Ej: 5512345678"
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={savingProfile}
                                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                                        >
                                            {savingProfile ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Save size={16} />
                                            )}
                                            {savingProfile ? "Guardando..." : "Guardar cambios"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
