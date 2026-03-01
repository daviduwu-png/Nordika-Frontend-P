import React, { useEffect, useState } from "react";
import { Package, MapPin, CreditCard, LogOut, Truck, CheckCircle } from "lucide-react";
import { profileService } from "../services/profileService";
import { orderService } from "../services/orderService";
import { logout } from "../store/userStore";
import AddressModal from "./AddressModal";
import OrderDetailModal from "./OrderDetailModal";
import { sileo } from "sileo";
import "sileo/styles.css";

export default function CuentaView() {
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'pedidos' | 'direcciones'>('pedidos');
    const [loading, setLoading] = useState(true);

    // Modal state - Direcciones
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);

    // Modal state - Detalles de orden
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const [profileData, ordersData, addressesData] = await Promise.all([
                    profileService.getProfile(),
                    orderService.getOrders(),
                    profileService.getAddresses()
                ]);
                setProfile(profileData);
                setOrders(ordersData);
                setAddresses(addressesData);
            } catch (error) {
                console.error("Error al cargar la cuenta:", error);
                // Si hay error de autenticación, podría redirigir al login
                // logout(); 
            } finally {
                setLoading(false);
            }
        };
        fetchDatos();
    }, []);

    const handleLogout = () => {
        logout();
    };

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
                // Editar
                await profileService.updateAddress(selectedAddress.id, formData);
                sileo.success({ title: 'Dirección actualizada correctamente' });
            } else {
                // Crear
                await profileService.addAddress(formData);
                sileo.success({ title: 'Dirección añadida correctamente' });
            }
            
            const newAddresses = await profileService.getAddresses();
            setAddresses(newAddresses);
            handleCloseModal();
        } catch (error) {
            console.error(error);
            sileo.error({ title: 'Ocurrió un error al guardar la dirección' });
            throw error; 
        }
    };

    const handleDeleteAddress = async (id: number) => {
        const toastId = sileo.action({
            title: '¿Eliminar dirección?',
            description: 'Esta acción no se puede deshacer.',
            styles: {
                description: "text-gray-300 text-sm",
            },
            button: {
                title: 'Eliminar',
                onClick: async () => {
                    sileo.dismiss(toastId);
                    try {
                        await profileService.deleteAddress(id);
                        setAddresses(prev => prev.filter(addr => addr.id !== id));
                        sileo.success({ title: 'Dirección eliminada correctamente' });
                    } catch (error) {
                        console.error(error);
                        sileo.error({ title: 'No se pudo eliminar la dirección' });
                    }
                }
            }
        });
    };

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

    return (
        <div className="flex flex-col md:flex-row gap-8 relative">

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

            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50">
                        <p className="font-bold text-gray-900">{profile.first_name || profile.user?.first_name || 'Nombre no definido'} {profile.last_name || profile.user?.last_name || ''}</p>
                        <p className="text-xs text-gray-500">{profile.user?.email || profile.email}</p>
                        {profile.phone && <p className="text-xs text-gray-400 mt-1">{profile.phone}</p>}
                    </div>
                    <nav className="flex flex-col p-2">
                        <button
                            onClick={() => setActiveTab('pedidos')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'pedidos' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Package size={20} /> Mis Pedidos
                        </button>
                        <button
                            onClick={() => setActiveTab('direcciones')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${activeTab === 'direcciones' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <MapPin size={20} /> Direcciones
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

            <main className="flex-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {activeTab === 'pedidos' ? (
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
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="font-bold text-gray-900">#ORD-{String(order.id).padStart(3, '0')}</span>
                                                    {order.status === 'delivered' || order.status === 'Entregado' ? (
                                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                            <CheckCircle size={12} /> Entregado
                                                        </span>
                                                    ) : order.status === 'paid' || order.status === 'Pagado' ? (
                                                        <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                            <CreditCard size={12} /> Pagado
                                                        </span>
                                                    ) : order.status === 'shipped' ? (
                                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                            <Truck size={12} /> Enviado
                                                        </span>
                                                    ) : (
                                                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                            <Truck size={12} /> {order.status || 'Pendiente'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })} &bull; {order.items ? order.items.length : 0} artículos
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">${parseFloat(order.total_amount || '0').toFixed(2)} MXN</p>
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}
                                                    className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1 justify-end"
                                                >
                                                    Ver detalles
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
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
                                        <div key={addr.id || idx} className={`border ${addr.is_default ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'} rounded-lg p-4 relative`}>
                                            {addr.is_default && (
                                                <span className="absolute top-2 right-2 text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">Principal</span>
                                            )}
                                            <p className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                                                <MapPin size={16} className="text-gray-500" /> {addr.alias || 'Dirección'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {addr.street} #{addr.exterior_number} {addr.interior_number ? `Int. ${addr.interior_number}` : ''}
                                            </p>
                                            <p className="text-sm text-gray-600">Col. {addr.neighborhood}</p>
                                            <p className="text-sm text-gray-600 mb-1">{addr.city}, {addr.state} {addr.postal_code}</p>
                                            {addr.phone && (
                                                <p className="text-sm text-gray-500 mb-1">📞 {addr.phone}</p>
                                            )}
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
                </div>
            </main>
        </div>
    );
}
