import { useState, useEffect } from "react";
import { Search, Frown, LayoutGrid, List } from "lucide-react";
import { productService } from "../services/productService";
import ProductCardGrid from "./catalog/ProductCardGrid";
import ProductCardList from "./catalog/ProductCardList";

const CATEGORY_LABELS = {
  todos: "Todos",
  shorts_box: "Shorts para box",
  "sin-categoria": "Sin categoría",
};

const getCategoryLabel = (category) => {
  const safe = category || "sin-categoria";
  return CATEGORY_LABELS[safe] || safe.replace(/_/g, " ");
};

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-100" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-5 bg-gray-200 rounded w-1/4 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse flex h-28">
          <div className="w-28 sm:w-36 bg-gray-100 shrink-0" />
          <div className="flex flex-col justify-center px-4 py-3 gap-2 flex-1">
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-5 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-3/4 hidden sm:block" />
            <div className="h-5 bg-gray-200 rounded w-1/5 mt-1" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ViewToggle({ view, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
      <button
        title="Vista en cuadrícula"
        onClick={() => onChange("grid")}
        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
          view === "grid" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-700"
        }`}
      >
        <LayoutGrid size={18} />
      </button>
      <button
        title="Vista en lista"
        onClick={() => onChange("list")}
        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 ${
          view === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-700"
        }`}
      >
        <List size={18} />
      </button>
    </div>
  );
}

export default function ProductGrid() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [maxPrecio, setMaxPrecio] = useState(1000);
  const [tallaFiltro, setTallaFiltro] = useState("todas");
  const [view, setView] = useState("grid"); // "grid" | "list"
  const [maxPriceInDB, setMaxPriceInDB] = useState(1000);

  useEffect(() => {
    productService.getAllProducts().then((data) => {
      const prods = Array.isArray(data) ? data : [];
      setProductos(prods);
      if (prods.length > 0) {
        const mx = Math.max(...prods.map((p) => Number(p.price || 0)));
        const roundedMax = Math.ceil(mx / 50) * 50;
        setMaxPriceInDB(Math.max(roundedMax || 500, 500));
        setMaxPrecio(Math.max(roundedMax || 500, 500));
      }
      setCargando(false);
    });
  }, []);

  const productosFiltrados = productos.filter((p) => {
    const nombre = (p.name || "").toLowerCase();
    const categoria = p.category || "";

    let match = nombre.includes(busqueda.toLowerCase());
    if (categoriaActiva !== "todos" && categoria !== categoriaActiva) match = false;

    const pPrice = Number(p.price || 0);
    if (pPrice > maxPrecio) match = false;

    if (tallaFiltro !== "todas") {
      if (!p.variants || !p.variants.some((v) => v.size === tallaFiltro)) {
        match = false;
      }
    }

    return match;
  });

  const categorias = ["todos", ...new Set(productos.map((p) => p.category || "sin-categoria"))];
  const tallasDisponibles = [
    "todas",
    ...new Set(productos.flatMap((p) => p.variants?.map((v) => v.size) || []).filter(Boolean)),
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-2 rounded-full capitalize text-sm font-semibold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  categoriaActiva === cat
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
          {(busqueda || categoriaActiva !== "todos" || maxPrecio !== maxPriceInDB || tallaFiltro !== "todas") && (
            <button
              onClick={() => {
                setBusqueda("");
                setCategoriaActiva("todos");
                setMaxPrecio(maxPriceInDB);
                setTallaFiltro("todas");
              }}
              className="text-xs font-bold text-red-500 hover:text-red-700 whitespace-nowrap hidden sm:block shrink-0 px-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex-1 w-full relative group">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="peer w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-sm"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-indigo-600 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2 min-w-[220px]">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Precio máximo:</span>
                <span className="font-bold text-indigo-600">${maxPrecio}</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxPriceInDB}
                step="50"
                value={maxPrecio}
                onChange={(e) => setMaxPrecio(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-center flex-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2 shrink-0">Talla:</span>
              {tallasDisponibles.map((t) => (
                <button
                  key={t}
                  onClick={() => setTallaFiltro(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                    tallaFiltro === t
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  {t === "todas" ? "Todas" : t === "UNI" ? "UNI" : t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 hidden md:flex shrink-0">
              {!cargando && (
                <span className="text-xs text-gray-500 font-bold bg-gray-50 px-3 py-1.5 rounded-lg">
                  {productosFiltrados.length} {productosFiltrados.length === 1 ? "resultado" : "resultados"}
                </span>
              )}
              <ViewToggle view={view} onChange={setView} />
            </div>
          </div>

          <div className="flex justify-between items-center md:hidden pt-2 border-t border-gray-100 mt-2">
            <div className="flex items-center gap-3">
              {!cargando && (
                <span className="text-xs text-gray-500 font-bold">
                  {productosFiltrados.length} {productosFiltrados.length === 1 ? "resultado" : "resultados"}
                </span>
              )}
              {(busqueda || categoriaActiva !== "todos" || maxPrecio !== maxPriceInDB || tallaFiltro !== "todas") && (
                <button
                  onClick={() => {
                    setBusqueda("");
                    setCategoriaActiva("todos");
                    setMaxPrecio(maxPriceInDB);
                    setTallaFiltro("todas");
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-700 whitespace-nowrap"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </div>

      {cargando && (view === "grid" ? <SkeletonGrid /> : <SkeletonList />)}

      {!cargando && productosFiltrados.length === 0 && (
        <div className="text-center py-24">
          <div className="inline-flex bg-gray-100 p-5 rounded-full mb-4">
            <Frown size={44} className="text-gray-400" />
          </div>
          <p className="text-xl text-gray-600 font-semibold">No encontramos productos.</p>
          <p className="text-sm text-gray-400 mt-1">Intenta cambiar los filtros o la búsqueda.</p>
          <button
            onClick={() => {
              setBusqueda("");
              setCategoriaActiva("todos");
              setMaxPrecio(maxPriceInDB);
              setTallaFiltro("todas");
            }}
            className="mt-5 text-indigo-600 font-semibold hover:underline text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {!cargando && productosFiltrados.length > 0 && view === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {productosFiltrados.map((producto) => (
            <ProductCardGrid key={producto.id} producto={producto} />
          ))}
        </div>
      )}

      {!cargando && productosFiltrados.length > 0 && view === "list" && (
        <div className="flex flex-col gap-3">
          {productosFiltrados.map((producto) => (
            <ProductCardList key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
