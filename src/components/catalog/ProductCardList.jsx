import { addCartItem } from "../../store/cartStore";
import { ShoppingCart, ChevronRight } from "lucide-react";

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

export default function ProductCardList({ producto }) {
  const image = producto.image || MOCKUPS[producto.category] || "/mockups/playera.png";
  const description = (producto.description || "Sin descripción disponible").trim();

  return (
    <div
      onClick={() => (window.location.href = `/producto/${producto.slug}`)}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex items-stretch gap-0"
    >
      <div className="w-28 sm:w-36 md:w-44 shrink-0 bg-gray-50 overflow-hidden relative">
        <img
          src={image}
          alt={producto.name || "Producto"}
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col justify-center px-4 py-4 flex-1 min-w-0">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
          {getCategoryLabel(producto.category)}
        </p>
        <h3 className="text-base font-bold text-gray-900 leading-snug truncate">{producto.name || "Producto"}</h3>
        <p
          className="text-sm text-gray-500 mt-1 leading-relaxed hidden sm:block"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        <p className="text-indigo-600 font-extrabold mt-2 text-lg">${Number(producto.price || 0).toFixed(2)}</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 pr-4 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            addCartItem(producto);
          }}
          title="Añadir al carrito"
          className="bg-gray-100 text-gray-700 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-200 w-9 h-9 flex items-center justify-center"
        >
          <ShoppingCart size={15} />
        </button>
        <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
      </div>
    </div>
  );
}
