import React from "react";
import { CheckCircle, Clock, AlertTriangle, X } from "lucide-react";

export type PaymentBannerState = {
    type: "success" | "pending" | "failed";
    orderId?: string;
};

interface PaymentBannerProps {
    banner: PaymentBannerState;
    onDismiss: () => void;
}

export default function PaymentBanner({ banner, onDismiss }: PaymentBannerProps) {
    if (banner.type === "success") {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-3 shadow-sm">
                <CheckCircle size={22} className="text-green-500 flex-shrink-0" />
                <div className="flex-1">
                    <p className="font-bold text-green-800">¡Pago recibido exitosamente!</p>
                    {banner.orderId && (
                        <p className="text-xs text-green-600">
                            Orden #ORD-{String(banner.orderId).padStart(3, "0")} · Recibirás un correo de confirmación pronto.
                        </p>
                    )}
                </div>
                <button onClick={onDismiss} className="text-green-400 hover:text-green-600">
                    <X size={16} />
                </button>
            </div>
        );
    }

    if (banner.type === "pending") {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-3 shadow-sm">
                <Clock size={22} className="text-amber-500 flex-shrink-0" />
                <div className="flex-1">
                    <p className="font-bold text-amber-800">Pago en proceso</p>
                    {banner.orderId && (
                        <p className="text-xs text-amber-600">
                            Orden #ORD-{String(banner.orderId).padStart(3, "0")} · Tu pago está siendo procesado. Te avisaremos cuando se acredite.
                        </p>
                    )}
                </div>
                <button onClick={onDismiss} className="text-amber-400 hover:text-amber-600">
                    <X size={16} />
                </button>
            </div>
        );
    }

    // "failed"
    return (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center gap-3 shadow-sm">
            <AlertTriangle size={22} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
                <p className="font-bold text-red-800">El pago fue rechazado</p>
                {banner.orderId && (
                    <p className="text-xs text-red-600">
                        No se realizó ningún cargo. Puedes intentarlo de nuevo.
                    </p>
                )}
            </div>
            <button onClick={onDismiss} className="text-red-400 hover:text-red-600">
                <X size={16} />
            </button>
        </div>
    );
}
