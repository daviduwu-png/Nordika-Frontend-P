import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { cartItems } from "../store/cartStore";
import { CreditCard, ShieldCheck, Lock } from "lucide-react";

export default function CheckoutForm() {
  const $cartItems = useStore(cartItems);
  const items = Object.values($cartItems);

  // FIX DE HIDRATACIÓN (Para que no falle con LocalStorage)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + Number(item.price) * item.cantidad, 0);
  const envio = 150; // Tarifa fija simulada
  const total = subtotal + envio;

  // Estado para simular selección de método de pago
  const [metodoPago, setMetodoPago] = useState("card");

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
        <a href="/catalogo" className="text-indigo-600 font-bold hover:underline mt-4 block">
          Volver a la tienda
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start animate-fade-in">
      {/* --- COLUMNA IZQUIERDA: FORMULARIOS --- */}
      <div className="flex-1 w-full space-y-8">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">1. Información de Contacto</h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="news" className="accent-indigo-600 w-4 h-4" />
              <label htmlFor="news" className="text-sm text-gray-600">
                Enviarme novedades y ofertas exclusivas.
              </label>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">2. Dirección de Envío</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Apellidos"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Calle y número"
              className="w-full md:col-span-2 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Colonia"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Código Postal"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Ciudad"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
              <option>México</option>
            </select>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4">3. Método de Pago</h2>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div
              onClick={() => setMetodoPago("card")}
              className={`p-4 flex items-center gap-4 cursor-pointer border-b border-gray-100 ${metodoPago === "card" ? "bg-indigo-50" : "bg-white"}`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${metodoPago === "card" ? "border-indigo-600" : "border-gray-300"}`}
              >
                {metodoPago === "card" && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
              </div>
              <div className="flex-1 font-medium text-gray-900">Tarjeta de Crédito / Débito</div>
              <div className="flex gap-2">
                <div className="bg-gray-200 w-8 h-5 rounded text-[10px] flex items-center justify-center font-bold text-gray-500">
                  VISA
                </div>
                <div className="bg-gray-200 w-8 h-5 rounded text-[10px] flex items-center justify-center font-bold text-gray-500">
                  MC
                </div>
              </div>
            </div>

            {metodoPago === "card" && (
              <div className="p-4 bg-gray-50 space-y-4 animate-fade-in">
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Número de tarjeta"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM / AA"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Nombre en la tarjeta"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <Lock size={12} />
                  <span>Tus pagos son procesados de forma segura con encriptación de 256-bits.</span>
                </div>
              </div>
            )}
          </div>
        </section>

        <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-2 transform active:scale-[0.99]">
          <Lock size={18} /> Pagar ${total.toFixed(2)} MXN
        </button>
      </div>

      {/* --- COLUMNA DERECHA: RESUMEN (STICKY) --- */}
      <div className="w-full lg:w-96 bg-gray-50 p-6 rounded-2xl border border-gray-200 lg:sticky lg:top-24 h-fit">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen del Pedido</h3>

        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-6 scrollbar-thin">
          {items.map((item) => (
            <div key={item.cartItemId} className="flex gap-3">
              <div className="relative w-16 h-16 bg-white rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-md font-bold">
                  {item.cantidad}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {item.selectedVariant ? `Talla: ${item.selectedVariant.size}` : item.category}
                </p>
              </div>
              <p className="text-sm font-bold text-gray-900">${(Number(item.price) * item.cantidad).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 pb-6 border-b border-gray-200">
          <input
            type="text"
            placeholder="Código de descuento"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 transition">
            Aplicar
          </button>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>${envio.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-lg pt-4 border-t border-gray-200 mt-4">
            <span>Total</span>
            <span>${total.toFixed(2)} MXN</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 bg-white p-3 rounded-lg border border-gray-100">
          <ShieldCheck size={16} className="text-green-500" />
          <span>Garantía de devolución de 30 días</span>
        </div>
      </div>
    </div>
  );
}
