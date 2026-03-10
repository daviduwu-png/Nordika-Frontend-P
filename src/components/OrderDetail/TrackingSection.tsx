import React, { useState } from "react";
import { Truck, Copy, Check, ExternalLink } from "lucide-react";

interface TrackingSectionProps {
    trackingNumber: string;
    trackingUrl?: string;
}

export default function TrackingSection({ trackingNumber, trackingUrl }: TrackingSectionProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(trackingNumber).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <section>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Truck size={15} /> Rastreo del Envío
            </h3>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className="text-xs text-blue-500 font-medium uppercase tracking-wide mb-1">
                            Número de rastreo
                        </p>
                        <p className="font-bold text-blue-900 font-mono text-base">{trackingNumber}</p>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white border border-blue-200 px-3 py-2 rounded-lg transition-colors hover:bg-blue-50 flex-shrink-0"
                    >
                        {copied ? (
                            <Check size={13} className="text-green-500" />
                        ) : (
                            <Copy size={13} />
                        )}
                        {copied ? "¡Copiado!" : "Copiar"}
                    </button>
                </div>

                {trackingUrl ? (
                    <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-lg transition-colors w-full justify-center"
                    >
                        <ExternalLink size={13} />
                        Rastrear mi paquete
                    </a>
                ) : (
                    <p className="text-xs text-blue-500 italic">
                        Usa el número de rastreo en el sitio de la paquetería para seguir tu envío.
                    </p>
                )}
            </div>
        </section>
    );
}
