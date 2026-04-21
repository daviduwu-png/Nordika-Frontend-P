import { useState, useEffect } from "react";
import { Search, Frown, ShoppingCart } from "lucide-react";
import { addCartItem } from "../store/cartStore";
import { productService } from "../services/productService";

export default function ProductGrid() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

  useEffect(() => {
    productService.getAllProducts().then((data) => {
      setProductos(data);
      setCargando(false);
    });
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const productName = producto.name || "";
    const productCategory = producto.category || "";

    const coincideTexto = productName.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === "todos" || productCategory === categoriaActiva;

    return coincideTexto && coincideCategoria;
  });

  const categorias = ["todos", ...new Set(productos.map((p) => p.category || "sin-categoria"))];

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`px-4 py-2 rounded-full capitalize text-sm font-semibold transition ${
                categoriaActiva === cat
                  ? "bg-black text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 group">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="peer w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-gray-400 peer-focus:text-indigo-600 transition-colors duration-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              onClick={() => (window.location.href = `/producto/${producto.slug}`)}
              className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
            >
              <div className="aspect-square overflow-hidden bg-gray-100 relative">
                <img
                  src={producto.image || "https://via.placeholder.com/300?text=No+Image"}
                  alt={producto.name || "Producto"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute inset-0 flex transition-all duration-300 opacity-100 items-end justify-end p-3 md:opacity-0 md:group-hover:opacity-100 md:items-center md:justify-center md:hover:bg-black/10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addCartItem(producto);
                    }}
                    title="Añadir al carrito"
                    className="bg-white text-gray-900 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 w-10 h-10 flex items-center justify-center md:w-auto md:h-auto md:p-3 md:transform md:translate-y-4 md:group-hover:translate-y-0"
                  >
                    <ShoppingCart size={18} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{producto.category || "General"}</p>
                <h3 className="text-lg font-bold text-gray-900 truncate">{producto.name || "Producto sin nombre"}</h3>
                <p className="text-indigo-600 font-bold mt-2">${producto.price || 0}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="inline-flex bg-gray-100 p-4 rounded-full mb-4">
              <Frown size={48} className="text-gray-400" />
            </div>
            <p className="text-xl text-gray-600 font-medium">No encontramos productos.</p>
            <button
              onClick={() => {
                setBusqueda("");
                setCategoriaActiva("todos");
              }}
              className="mt-4 text-indigo-600 hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
