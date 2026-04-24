import { useState, useEffect } from "react";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useStore } from "@nanostores/react";
import { isCartOpen, cartItems, addCartItem, removeCartItem, decreaseCartItem } from "../store/cartStore";

export default function CartDrawer() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const itemsArray = Object.values($cartItems);

  const total = itemsArray.reduce((acc, item) => acc + Number(item.price) * item.cantidad, 0);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          $isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => isCartOpen.set(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          $isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag size={20} />
              Tu Carrito ({isMounted ? itemsArray.length : 0})
            </h2>
            <button onClick={() => isCartOpen.set(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
              <X size={24} />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {isMounted && itemsArray.length > 0 ? (
              itemsArray.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 animate-fade-in">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
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
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>

                      <p className="text-sm text-gray-500 capitalize">
                        Talla: {item.selectedVariant ? item.selectedVariant.size : "Única"}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">Categoría: {item.category}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-indigo-600">${item.price}</span>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-md">
                          <button
                            onClick={() => decreaseCartItem(item.cartItemId)}
                            className="px-2 py-0.5 hover:bg-gray-100 text-gray-600 font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs px-2 font-medium min-w-[20px] text-center">{item.cantidad}</span>
                          <button
                            onClick={() => addCartItem(item)}
                            disabled={item.selectedVariant && item.cantidad >= item.selectedVariant.stock}
                            className={`px-2 py-0.5 font-bold transition ${
                              item.selectedVariant && item.cantidad >= item.selectedVariant.stock
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeCartItem(item.cartItemId)}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag size={48} className="text-gray-300" />
                <p className="text-gray-500">Tu carrito está vacío.</p>
                <button onClick={() => isCartOpen.set(false)} className="text-indigo-600 font-bold hover:underline">
                  Seguir comprando
                </button>
              </div>
            )}
          </div>

          {isMounted && itemsArray.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 text-center">Impuestos y envío calculados en el checkout.</p>
              <a
                href="/checkout"
                className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg active:scale-95"
              >
                Proceder al Pago <ArrowRight size={18} />
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
