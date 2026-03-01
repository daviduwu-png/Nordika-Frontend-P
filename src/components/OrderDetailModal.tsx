import React, { useEffect, useRef } from "react";
import {
    X,
    Package,
    MapPin,
    CreditCard,
    Truck,
    CheckCircle,
    Clock,
    ShoppingBag,
    Calendar,
    Hash,
} from "lucide-react";

interface OrderItem {
    id: number;
    product_name?: string;
    product?: { name: string; image?: string };
    quantity: number;
    unit_price?: string | number;
    price?: string | number;
    subtotal?: string | number;
    image?: string;
}

interface Order {
    id: number;
    status: string;
    created_at: string;
    updated_at?: string;
    total_amount: string | number;
    subtotal?: string | number;
    shipping_cost?: string | number;
    items?: OrderItem[];
    shipping_address?: {
        alias?: string;
        street?: string;
        exterior_number?: string;
        interior_number?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
        phone?: string;
    };
    payment_method?: string;
    notes?: string;
}

interface OrderDetailModalProps {
    order: Order | null;
    isOpen: boolean;
    onClose: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    delivered: { label: "Entregado", color: "text-emerald-700", bg: "bg-emerald-100", icon: <CheckCircle size={14} /> },
    Entregado: { label: "Entregado", color: "text-emerald-700", bg: "bg-emerald-100", icon: <CheckCircle size={14} /> },
    paid: { label: "Pagado", color: "text-violet-700", bg: "bg-violet-100", icon: <CreditCard size={14} /> },
    Pagado: { label: "Pagado", color: "text-violet-700", bg: "bg-violet-100", icon: <CreditCard size={14} /> },
    shipped: { label: "Enviado", color: "text-blue-700", bg: "bg-blue-100", icon: <Truck size={14} /> },
    Enviado: { label: "Enviado", color: "text-blue-700", bg: "bg-blue-100", icon: <Truck size={14} /> },
    pending: { label: "Pendiente", color: "text-amber-700", bg: "bg-amber-100", icon: <Clock size={14} /> },
    Pendiente: { label: "Pendiente", color: "text-amber-700", bg: "bg-amber-100", icon: <Clock size={14} /> },
};

function getStatusConfig(status: string) {
    return (
        STATUS_CONFIG[status] ?? {
            label: status || "Pendiente",
            color: "text-amber-700",
            bg: "bg-amber-100",
            icon: <Clock size={14} />,
        }
    );
}

function formatPrice(val: string | number | undefined): string {
    if (val === undefined || val === null) return "0.00";
    return parseFloat(String(val)).toFixed(2);
}

export default function OrderDetailModal({ order, isOpen, onClose }: OrderDetailModalProps) {
    const backdropRef = useRef<HTMLDivElement>(null);

    // Cerrar al presionar Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    // Bloquear scroll del body cuando el modal está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen || !order) return null;

    const statusCfg = getStatusConfig(order.status);
    const items = order.items ?? [];
    const addr = order.shipping_address;

    const subtotal = order.subtotal
        ? formatPrice(order.subtotal)
        : formatPrice(
            items.reduce(
                (acc, item) => acc + parseFloat(formatPrice(item.subtotal ?? (parseFloat(String(item.unit_price ?? item.price ?? 0)) * item.quantity))),
                0
            )
        );

    const shippingCost = order.shipping_cost !== undefined ? formatPrice(order.shipping_cost) : null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === backdropRef.current) onClose();
    };

    return (
        <div
            ref={backdropRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
                style={{ animation: "order-modal-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}
            >
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-xl">
                            <ShoppingBag size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 text-lg leading-tight">
                                Pedido{" "}
                                <span className="text-indigo-600">
                                    #ORD-{String(order.id).padStart(3, "0")}
                                </span>
                            </h2>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                <Calendar size={11} />
                                {new Date(order.created_at).toLocaleDateString("es-MX", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span
                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}
                        >
                            {statusCfg.icon}
                            {statusCfg.label}
                        </span>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
                            aria-label="Cerrar"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* ── Scrollable body ── */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

                    {/* ── Artículos ── */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Package size={15} /> Artículos ({items.length})
                        </h3>

                        {items.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No hay artículos registrados en este pedido.</p>
                        ) : (
                            <div className="space-y-3">
                                {items.map((item, idx) => {
                                    const name = item.product_name ?? item.product?.name ?? `Artículo #${idx + 1}`;
                                    const unitPrice = parseFloat(String(item.unit_price ?? item.price ?? 0));
                                    const itemSubtotal = parseFloat(
                                        formatPrice(item.subtotal ?? unitPrice * item.quantity)
                                    );
                                    const img = item.image ?? item.product?.image;

                                    return (
                                        <div
                                            key={item.id ?? idx}
                                            className="flex items-center gap-4 bg-gray-50 rounded-xl p-3"
                                        >
                                            {img ? (
                                                <img
                                                    src={img}
                                                    alt={name}
                                                    className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 bg-indigo-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-200">
                                                    <Package size={24} className="text-indigo-300" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 text-sm truncate">{name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {item.quantity} × ${unitPrice.toFixed(2)} MXN
                                                </p>
                                            </div>
                                            <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                                                ${itemSubtotal.toFixed(2)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* ── Dirección de envío ── */}
                    {addr && (
                        <section>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <MapPin size={15} /> Dirección de Envío
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-1">
                                {addr.alias && (
                                    <p className="font-bold text-gray-800">{addr.alias}</p>
                                )}
                                {addr.street && (
                                    <p>
                                        {addr.street} #{addr.exterior_number}
                                        {addr.interior_number ? ` Int. ${addr.interior_number}` : ""}
                                    </p>
                                )}
                                {addr.neighborhood && <p>Col. {addr.neighborhood}</p>}
                                {(addr.city || addr.state) && (
                                    <p>
                                        {addr.city}{addr.city && addr.state ? ", " : ""}
                                        {addr.state} {addr.postal_code}
                                    </p>
                                )}
                                {addr.country && <p>{addr.country}</p>}
                                {addr.phone && (
                                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                                        📞 {addr.phone}
                                    </p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ── Pago / Notas ── */}
                    {(order.payment_method || order.notes) && (
                        <section>
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <CreditCard size={15} /> Pago
                            </h3>
                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-2">
                                {order.payment_method && (
                                    <div className="flex items-center gap-2">
                                        <Hash size={13} className="text-gray-400" />
                                        <span className="text-gray-500">Método:</span>
                                        <span className="font-medium capitalize">{order.payment_method}</span>
                                    </div>
                                )}
                                {order.notes && (
                                    <p className="text-gray-500 italic text-xs mt-1">
                                        Nota: {order.notes}
                                    </p>
                                )}
                            </div>
                        </section>
                    )}

                    {/* ── Resumen de costos ── */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                            Resumen
                        </h3>
                        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${subtotal} MXN</span>
                            </div>
                            {shippingCost !== null && (
                                <div className="flex justify-between text-gray-600">
                                    <span>Envío</span>
                                    <span>
                                        {parseFloat(shippingCost) === 0
                                            ? <span className="text-emerald-600 font-medium">Gratis</span>
                                            : `$${shippingCost} MXN`}
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-gray-900 text-base">
                                <span>Total</span>
                                <span>${formatPrice(order.total_amount)} MXN</span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes order-modal-in {
                    from { opacity: 0; transform: scale(0.92) translateY(16px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
}
