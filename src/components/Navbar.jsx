import { useState, useEffect } from "react";
import { Menu, X, User, ShoppingBag, Palette, LogOut } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { useStore } from "@nanostores/react";
import { cartItems, isCartOpen } from "../store/cartStore";
import { userInfo, initUser, logout } from "../store/userStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const $cartItems = useStore(cartItems);

  const $user = useStore(userInfo);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    initUser();
  }, []);

  const totalItems = Object.values($cartItems).reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1 rounded-md">
              <img src="/logo-nordika.jpg" alt="Logo" className="h-8 w-auto rounded-md" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Nordika Wear</h1>
          </div>

          {/* MENÚ DE ESCRITORIO */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Inicio
            </a>
            <a href="/catalogo" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
              Catálogo
            </a>
            <a
              href="/personalizar"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all"
            >
              <Palette size={16} /> Personalizar
            </a>

            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              <button
                onClick={() => isCartOpen.set(true)}
                className="group relative text-gray-500 hover:text-indigo-600 transition"
              >
                <ShoppingBag size={24} />
                {isMounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce-short">
                    {totalItems}
                  </span>
                )}
              </button>

              {isMounted && $user ? (
                // Usuario Logueado
                <div className="flex items-center gap-3 animate-fade-in">
                  <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                    Hola, {$user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-red-500 transition tooltip"
                    title="Cerrar Sesión"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                //  Invitado (No logueado)
                <a href="/login" className="text-gray-500 hover:text-indigo-600 transition">
                  <User size={24} />
                </a>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => isCartOpen.set(true)} className="text-gray-600 relative">
              <ShoppingBag size={22} />
              {isMounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-indigo-600 transition">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg py-4 px-4 flex flex-col space-y-4 animate-fade-in-down">
            <a href="/" className="text-gray-700 hover:text-indigo-600 font-medium py-2 border-b border-gray-50">
              Inicio
            </a>
            <a
              href="/catalogo"
              className="text-gray-700 hover:text-indigo-600 font-medium py-2 border-b border-gray-50"
            >
              Catálogo
            </a>
            <a href="/personalizar" className="text-indigo-600 font-bold py-2 flex items-center gap-2">
              <Palette size={18} /> Personalizar Ropa
            </a>

            {isMounted && $user ? (
              <button
                onClick={logout}
                className="bg-red-50 text-red-600 w-full py-3 rounded-xl font-bold mt-2 flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Cerrar Sesión ({$user.name})
              </button>
            ) : (
              <a href="/login" className="bg-gray-900 text-white text-center py-3 rounded-xl font-bold mt-2">
                Iniciar Sesión
              </a>
            )}
          </div>
        )}
      </nav>

      <CartDrawer />
    </>
  );
}
