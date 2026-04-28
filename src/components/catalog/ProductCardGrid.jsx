import { addCartItem } from "../../store/cartStore";
import { ShoppingCart } from "lucide-react";

const MOCKUPS = {
  playeras: "/mockups/playera.png",
  sudaderas: "/mockups/sudadera.png",
  gorras: "/mockups/gorra.png",
  tazas: "/mockups/taza.png",
  shorts_box: "/mockups/shorts-box.png",
};

const getCategoryLabel = (category) => {
  const labels = {
    todos: "Todos",
    shorts_box: "Shorts para box",
    "sin-categoria": "Sin categoría",
  };
  const safe = category || "sin-categoria";
  return labels[safe] || safe.replace(/_/g, " ");
};

export default function ProductCardGrid({ producto }) {
  const image = producto.image || MOCKUPS[producto.category] || "/mockups/playera.png";

  return (
    <div
      onClick={() => (window.location.href = `/producto/${producto.slug}`)}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col"
    >
      <div className="aspect-square overflow-hidden bg-gray-50 relative">
        <img
          src={image}
          alt={producto.name || "Producto"}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 flex items-end justify-end p-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addCartItem(producto);
            }}
            title="Añadir al carrito"
            className="bg-white text-gray-900 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-200 w-10 h-10 flex items-center justify-center md:translate-y-2 md:group-hover:translate-y-0"
          >
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
          {getCategoryLabel(producto.category)}
        </p>
        <h3 className="text-sm font-bold text-gray-900 leading-snug">{producto.name || "Producto"}</h3>
        <p className="text-indigo-600 font-extrabold mt-auto pt-3 text-base">
          ${Number(producto.price || 0).toFixed(2)}
        </p>
      </div>
    </div>
  );
}
