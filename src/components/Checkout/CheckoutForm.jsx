import { CreditCard as CardIcon, CheckCircle, Lock, ChevronRight, Loader2 } from "lucide-react";
import { useCheckout } from "./hooks/useCheckout.js";
import ContactInfo from "./components/ContactInfo.jsx";
import ShippingAddress from "./components/ShippingAddress.jsx";
import PaymentSelector from "./components/PaymentSelector.jsx";
import OrderSummary from "./components/OrderSummary.jsx";

export default function CheckoutForm() {
    const {
        items,
        isMounted,
        subtotal,
        envio,
        total,
        // Contacto
        email, setEmail,
        telefono, setTelefono,
        // Dirección
        nombre, setNombre,
        apellidos, setApellidos,
        calle, setCalle,
        colonia, setColonia,
        cp, setCp,
        ciudad, setCiudad,
        estado, setEstado,
        // Direcciones guardadas
        savedAddresses,
        selectedAddressId,
        handleSelectAddress,
        loadingAddresses,
        // Tarjeta Stripe
        cardNumber, setCardNumber,
        cardExpiry, setCardExpiry,
        cardCvc, setCardCvc,
        cardName, setCardName,
        // Estado del pago
        metodoPago, setMetodoPago,
        loadingOrder,
        orderError,
        orderSuccess,
        orderSuccessId,
        // Handlers
        handlePagarStripe,
        handlePagarMP,
    } = useCheckout();

    if (!isMounted) return null;

    if (items.length === 0 && !orderSuccess) {
        return (
            <div className="text-center py-20 animate-fade-in">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CardIcon size={36} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Tu carrito está vacío
                </h2>
                <p className="text-gray-500 mb-6">
                    Agrega algunos productos antes de continuar.
                </p>
                <a
                    href="/catalogo"
                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition"
                >
                    Ver catálogo
                </a>
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="text-center py-20 animate-fade-in max-w-md mx-auto">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    ¡Pedido confirmado!
                </h2>
                {orderSuccessId && (
                    <p className="text-indigo-600 font-bold mb-2">
                        #ORD-{String(orderSuccessId).padStart(3, "0")}
                    </p>
                )}
                <p className="text-gray-500 mb-8">
                    Tu orden ha sido procesada correctamente. Te redirigiremos a tu cuenta
                    en unos segundos.
                </p>
                <a
                    href="/cuenta"
                    className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-700 transition"
                >
                    Ver mis pedidos
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-10 items-start animate-fade-in">

            <div className="flex-1 w-full space-y-8">

                <ContactInfo
                    email={email} setEmail={setEmail}
                    telefono={telefono} setTelefono={setTelefono}
                />

                <ShippingAddress
                    nombre={nombre} setNombre={setNombre}
                    apellidos={apellidos} setApellidos={setApellidos}
                    calle={calle} setCalle={setCalle}
                    colonia={colonia} setColonia={setColonia}
                    cp={cp} setCp={setCp}
                    ciudad={ciudad} setCiudad={setCiudad}
                    estado={estado} setEstado={setEstado}
                    savedAddresses={savedAddresses}
                    selectedAddressId={selectedAddressId}
                    handleSelectAddress={handleSelectAddress}
                    loadingAddresses={loadingAddresses}
                />

                <PaymentSelector
                    metodoPago={metodoPago} setMetodoPago={setMetodoPago}
                    cardNumber={cardNumber} setCardNumber={setCardNumber}
                    cardExpiry={cardExpiry} setCardExpiry={setCardExpiry}
                    cardCvc={cardCvc} setCardCvc={setCardCvc}
                    cardName={cardName} setCardName={setCardName}
                />

                {orderError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm font-medium animate-fade-in">
                         {orderError}
                    </div>
                )}

               
                <button
                    id="checkout-pay-button"
                    type="button"
                    onClick={metodoPago === "stripe" ? handlePagarStripe : handlePagarMP}
                    disabled={loadingOrder}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${metodoPago === "stripe"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-[#009EE3] hover:bg-[#0088cc] text-white"
                        }`}
                >
                    {loadingOrder ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            <Lock size={18} />
                            {metodoPago === "stripe"
                                ? `Pagar $${total.toFixed(2)} MXN`
                                : `Ir a Mercado Pago · $${total.toFixed(2)} MXN`}
                            <ChevronRight size={18} />
                        </>
                    )}
                </button>

                <p className="text-xs text-center text-gray-400">
                    Al confirmar tu compra, aceptas nuestros Términos y Condiciones y
                    Política de Privacidad.
                </p>
            </div>

            <OrderSummary
                items={items}
                subtotal={subtotal}
                envio={envio}
                total={total}
            />

        </div>
    );
}
