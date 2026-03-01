import { CreditCard, Lock } from "lucide-react";
import { StripeLogo, MPLogo } from "./Logos.jsx";

export const formatCardNumber = (val) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

export const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length > 2 ? `${clean.slice(0, 2)} / ${clean.slice(2)}` : clean;
};

// ─── Panel de Stripe ────────────────────────────────────────────────────────
function StripePanel({ cardNumber, setCardNumber, cardExpiry, setCardExpiry, cardCvc, setCardCvc, cardName, setCardName }) {
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
                    <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                        id="stripe-card-number"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono tracking-wider transition"
                    />
                </div>
            </div>

            {/* Vencimiento y CVC */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                        Vencimiento
                    </label>
                    <input
                        id="stripe-expiry"
                        type="text"
                        placeholder="MM / AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={7}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono transition"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-600 block mb-1">
                        CVC
                    </label>
                    <input
                        id="stripe-cvc"
                        type="text"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono transition"
                    />
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
    cardNumber, setCardNumber,
    cardExpiry, setCardExpiry,
    cardCvc, setCardCvc,
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
                    cardNumber={cardNumber}
                    setCardNumber={setCardNumber}
                    cardExpiry={cardExpiry}
                    setCardExpiry={setCardExpiry}
                    cardCvc={cardCvc}
                    setCardCvc={setCardCvc}
                    cardName={cardName}
                    setCardName={setCardName}
                />
            )}

            {metodoPago === "mercadopago" && <MPPanel />}
        </section>
    );
}
