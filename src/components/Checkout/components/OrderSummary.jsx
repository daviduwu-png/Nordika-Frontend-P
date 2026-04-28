import { ShieldCheck, Lock, Truck } from "lucide-react";

export const ENVIO_GRATIS_DESDE = 999;
export const COSTO_ENVIO = 150;

export default function OrderSummary({ items, subtotal, envio, total, className = "" }) {
  const faltaParaGratis = ENVIO_GRATIS_DESDE - subtotal;
  const progresoEnvio = Math.min((subtotal / ENVIO_GRATIS_DESDE) * 100, 100);

  return (
    <div
      className={`w-full lg:w-96 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 lg:sticky lg:top-24 h-fit ${className}`.trim()}
    >
      <h3 className="text-base font-bold text-gray-900 mb-5">Resumen del Pedido</h3>

      <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-6">
        {items.map((item) => (
          <div key={item.cartItemId} className="flex gap-3">
            <div className="relative w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
              <img
                src={
                  item.image ||
                  {
                    playeras: "/mockups/playera.png",
                    sudaderas: "/mockups/sudadera.png",
                    gorras: "/mockups/gorra.png",
                    tazas: "/mockups/taza.png",
                    shorts_box: "/mockups/shorts-box.png",
                  }[item.category] ||
                  "/mockups/playera.png"
                }
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-lg font-bold">
                {item.cantidad}
              </span>
            </div>

            {/* Nombre y variante */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">
                {item.selectedVariant ? `Talla: ${item.selectedVariant.size}` : item.category}
              </p>
            </div>

            {/* Subtotal del item */}
            <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
              ${(Number(item.price) * item.cantidad).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-5 pb-5 border-b border-gray-200">
        <input
          type="text"
          placeholder="Código de descuento"
          className="w-full sm:flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button
          type="button"
          className="w-full sm:w-auto bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 transition"
        >
          Aplicar
        </button>
      </div>

      {/* ── Banner de envío gratis ───────────────────────────────────────────── */}
      {envio === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
          <Truck size={16} className="text-blue-600 flex-shrink-0" />
          <p className="text-blue-700 text-xs font-semibold">Envío gratis aplicado</p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          <p className="text-amber-700 text-xs font-medium">
            Agrega <span className="font-bold">${faltaParaGratis.toFixed(2)} MXN</span> más para obtener{" "}
            <span className="font-bold">envío gratis</span>
          </p>
          {/* Barra de progreso */}
          <div className="mt-1.5 bg-amber-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progresoEnvio}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2.5 text-sm text-gray-600 mb-5">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          {envio === 0 ? (
            <span className="font-semibold text-green-600">✓ Gratis</span>
          ) : (
            <span className="font-medium text-gray-900">${envio.toFixed(2)} MXN</span>
          )}
        </div>
        <div className="flex justify-between font-bold text-gray-900 text-lg pt-3 border-t border-gray-200 mt-3">
          <span>Total</span>
          <span>${total.toFixed(2)} MXN</span>
        </div>
      </div>

      {/* ── Sellos de confianza ──────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-lg border border-gray-100">
          <ShieldCheck size={15} className="text-green-500 flex-shrink-0" />
          <span>Garantía de devolución de 30 días</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-lg border border-gray-100">
          <Lock size={15} className="text-indigo-500 flex-shrink-0" />
          <span>Pago 100% seguro y encriptado</span>
        </div>
      </div>
    </div>
  );
}
