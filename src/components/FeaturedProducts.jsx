import { useState, useEffect } from "react";
import { productService } from "../services/productService";

const MOCKUPS = {
  playeras: "/mockups/playera.png",
  sudaderas: "/mockups/sudadera.png",
  gorras: "/mockups/gorra.png",
  tazas: "/mockups/taza.png",
};

export default function FeaturedProducts() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    productService.getAllProducts().then((data) => {
      setProductos(data.slice(0, 4));
      setCargando(false);
    });
  }, []);

  if (cargando) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-5 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (productos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {productos.map((producto) => {
        const imagen = producto.image || MOCKUPS[producto.category] || "/mockups/playera.png";
        return (
          <a
            key={producto.id}
            href={`/producto/${producto.slug}`}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer h-full flex flex-col"
          >
            <div className="aspect-square overflow-hidden bg-gray-100 relative">
              <img
                src={imagen}
                alt={producto.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="w-full bg-white text-gray-900 font-bold py-2 rounded-lg shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                  <span>Ver Detalles</span>
                </div>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{producto.category}</p>
              <h3 className="text-lg font-bold text-gray-900 truncate">{producto.name}</h3>
              <div className="flex items-center justify-between mt-auto pt-4">
                <span className="text-xl font-bold text-indigo-600">${producto.price}</span>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
