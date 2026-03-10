import React from "react";
import {
    CheckCircle, CreditCard, Truck, Clock, XCircle,
    RefreshCcw, Loader2,
} from "lucide-react";

export type OrderStatus = "delivered" | "paid" | "shipped" | "pending" | "cancelled" | "failed" | string;

export function getStatusBadge(status: string) {
    const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
        delivered: { label: "Entregado", cls: "bg-green-100 text-green-700", icon: <CheckCircle size={12} /> },
        paid:      { label: "Pagado",    cls: "bg-purple-100 text-purple-700", icon: <CreditCard size={12} /> },
        shipped:   { label: "Enviado",   cls: "bg-blue-100 text-blue-700", icon: <Truck size={12} /> },
        pending:   { label: "Pendiente", cls: "bg-amber-100 text-amber-700", icon: <Clock size={12} /> },
        cancelled: { label: "Cancelado", cls: "bg-red-100 text-red-700", icon: <XCircle size={12} /> },
        failed:    { label: "Fallido",   cls: "bg-red-100 text-red-700", icon: <XCircle size={12} /> },
    };
    const cfg = map[status] ?? {
        label: status || "Pendiente",
        cls: "bg-amber-100 text-amber-700",
        icon: <Clock size={12} />,
    };
    return (
        <span className={`${cfg.cls} text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1`}>
            {cfg.icon} {cfg.label}
        </span>
    );
}

interface OrdersTabProps {
    orders: any[];
    isAdmin: boolean;
    refundingId: number | null;
    onViewOrder: (order: any) => void;
    onRefund: (order: any) => void;
}

export default function OrdersTab({
    orders,
    isAdmin,
    refundingId,
    onViewOrder,
    onRefund,
}: OrdersTabProps) {
    return (
        <>
            <h2 className="text-xl font-bold mb-6">Historial de Pedidos</h2>
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <p className="text-gray-500">Aún no tienes pedidos registrados.</p>
                ) : (
                    orders.map((order: any, idx: number) => (
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
                                        onClick={() => onViewOrder(order)}
                                        className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1"
                                    >
                                        Ver detalles
                                    </button>
                                    {/* Reembolso solo visible para admins con órdenes pagadas */}
                                    {isAdmin && order.status === "paid" && (
                                        <button
                                            onClick={() => onRefund(order)}
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
    );
}
