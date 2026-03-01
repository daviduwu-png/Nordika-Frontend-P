import { CreditCard, Lock } from "lucide-react";
import { CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { StripeLogo, MPLogo } from "./Logos.jsx";

// ─── Panel de Stripe ────────────────────────────────────────────────────────
function StripePanel({ cardName, setCardName }) {
    const ELEMENT_OPTIONS = {
        style: {
            base: {
                color: "#1f2937",
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSmoothing: "antialiased",
                fontSize: "14px",
                "::placeholder": { color: "#9ca3af" }
            },
            invalid: {
                color: "#ef4444",
                iconColor: "#ef4444"
            }
        }
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 animate-fade-in">
            <p className="text-xs text-gray-500 flex items-center gap-1">
                <Lock size={11} /> Pago encriptado de 256 bits — procesado por Stripe
            </p>

            {/* Número de tarjeta */}
            <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                    Número de tarjeta
                </label>
                <div className="relative">
                    <CreditCard className="absolute left-3 top-[14px] text-gray-400 z-10" size={18} />
                    <div className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-3.5 bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition">
                        <CardNumberElement options={ELEMENT_OPTIONS} />
                    </div>
                </div>
            </div>

            {/* Vencimiento y CVC */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                        Vencimiento
                    </label>
                    <div className="w-full border border-gray-300 rounded-lg px-4 py-4 bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition">
                        <CardExpiryElement options={ELEMENT_OPTIONS} />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                        CVC
                    </label>
                    <div className="w-full border border-gray-300 rounded-lg px-4 py-4 bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition">
                        <CardCvcElement options={ELEMENT_OPTIONS} />
                    </div>
                </div>
            </div>

            {/* Nombre en la tarjeta */}
            <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                    Nombre en la tarjeta
                </label>
                <input
                    id="stripe-card-name"
                    type="text"
                    placeholder="Como aparece en la tarjeta"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
                />
            </div>
        </div>
    );
}

// ─── Panel de Mercado Pago ────────────────────────────────────────────────────
function MPPanel() {
    const metodos = ["VISA", "MC", "AMEX", "OXXO", "SPEI"];
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 animate-fade-in">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white font-bold text-lg">$</span>
                </div>
                <div>
                    <p className="font-bold text-blue-900 text-sm">Paga con Mercado Pago</p>
                    <p className="text-xs text-blue-700 mt-1">
                        Serás redirigido al checkout seguro de Mercado Pago donde podrás pagar
                        con tarjeta, transferencia bancaria, efectivo (OXXO, etc.) o tu saldo
                        de cuenta.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {metodos.map((m) => (
                            <span
                                key={m}
                                className="bg-white border border-blue-200 text-blue-700 text-[10px] font-bold px-2 py-1 rounded"
                            >
                                {m}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSelector({
    metodoPago,
    setMetodoPago,
    cardName, setCardName,
}) {
    return (
        <section>
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                </span>
                Método de Pago
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                    id="payment-method-stripe"
                    type="button"
                    onClick={() => setMetodoPago("stripe")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${metodoPago === "stripe"
                            ? "border-indigo-500 bg-indigo-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                >
                    <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${metodoPago === "stripe" ? "border-indigo-600" : "border-gray-300"
                            }`}
                    >
                        {metodoPago === "stripe" && (
                            <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                        )}
                    </div>
                    <StripeLogo />
                </button>

                <button
                    id="payment-method-mercadopago"
                    type="button"
                    onClick={() => setMetodoPago("mercadopago")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${metodoPago === "mercadopago"
                            ? "border-blue-500 bg-blue-50 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                >
                    <div
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${metodoPago === "mercadopago" ? "border-blue-600" : "border-gray-300"
                            }`}
                    >
                        {metodoPago === "mercadopago" && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                    </div>
                    <MPLogo />
                </button>
            </div>

            {metodoPago === "stripe" && (
                <StripePanel
                    cardName={cardName}
                    setCardName={setCardName}
                />
            )}

            {metodoPago === "mercadopago" && <MPPanel />}
        </section>
    );
}
