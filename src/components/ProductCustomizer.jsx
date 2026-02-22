import { useState, useRef } from "react";
import Draggable from "react-draggable";
import { Upload, X, RotateCcw, ShoppingBag, Coffee, Shirt } from "lucide-react";

const PRODUCTOS = {
  playera: {
    id: "playera",
    nombre: "Playera Unisex",
    icono: <Shirt />,
    imagen: "/mockups/playera.png",
    precioBase: 350,
  },
  sudadera: {
    id: "sudadera",
    nombre: "Sudadera Hoodie",
    icono: <ShoppingBag />,
    imagen: "/mockups/sudadera.png",
    precioBase: 650,
  },
  taza: {
    id: "taza",
    nombre: "Taza Cerámica",
    icono: <Coffee />,
    imagen: "/mockups/taza.png",
    precioBase: 150,
  },
};

export default function ProductCustomizer() {
  const [productoActual, setProductoActual] = useState("playera");
  const [color, setColor] = useState("#ffffff");
  const [logo, setLogo] = useState(null);
  const [scale, setScale] = useState(1);

  const fileInputRef = useRef(null);
  const draggableRef = useRef(null);

  const producto = PRODUCTOS[productoActual];

  const colores = [
    { nombre: "Blanco", hex: "#ffffff" },
    { nombre: "Negro", hex: "#262626" },
    { nombre: "Rojo", hex: "#ef4444" },
    { nombre: "Azul", hex: "#3b82f6" },
    { nombre: "Amarillo", hex: "#eab308" },
    { nombre: "Verde", hex: "#22c55e" },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  };

  const resetEditor = () => {
    setLogo(null);
    setColor("#ffffff");
    setScale(1);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const cambiarProducto = (nuevoId) => {
    setProductoActual(nuevoId);
    resetEditor();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] p-4">
      <div className="flex-1 bg-gray-50 rounded-3xl border border-gray-200 p-4 lg:p-10 flex flex-col items-center justify-center relative shadow-sm overflow-hidden">
        <div className="bg-white p-2 rounded-full shadow-lg border border-gray-100 flex gap-2 mb-8 z-40">
          {Object.values(PRODUCTOS).map((prod) => (
            <button
              key={prod.id}
              onClick={() => cambiarProducto(prod.id)}
              className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full font-bold transition-all text-sm sm:text-base ${
                productoActual === prod.id
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-transparent text-gray-500 hover:bg-gray-100"
              }`}
            >
              {prod.icono}
              <span className="hidden sm:inline">{prod.nombre}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center select-none bg-white/50 rounded-2xl border border-gray-100/50">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none drop-shadow-2xl"
          />

          <div
            className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply transition-colors duration-300"
            style={{
              backgroundColor: color,
              maskImage: `url(${producto.imagen})`,
              WebkitMaskImage: `url(${producto.imagen})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          ></div>

          <div className="absolute inset-0 z-30 overflow-hidden flex items-center justify-center">
            {logo ? (
              <Draggable nodeRef={draggableRef}>
                <div ref={draggableRef} className="cursor-move relative group inline-block">
                  <img
                    src={logo}
                    alt="Logo"
                    style={{ transform: `scale(${scale})` }}
                    className="max-w-[200px] pointer-events-none drop-shadow-md"
                  />

                  <button
                    onClick={() => {
                      setLogo(null);

                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-4 -right-4 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:scale-110 z-50"
                  >
                    <X size={14} />
                  </button>
                </div>
              </Draggable>
            ) : (
              <div className="pointer-events-none opacity-40 border-2 border-gray-300 border-dashed p-4 rounded-xl">
                <p className="text-xs font-bold text-gray-400">El diseño aparecerá aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 h-fit bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-gray-900">Personalizar</h2>
          <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-sm">
            ${producto.precioBase}
          </span>
        </div>

        <div className="mb-8">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">1. Color Base</label>
          <div className="flex flex-wrap gap-3">
            {colores.map((c) => (
              <button
                key={c.hex}
                onClick={() => setColor(c.hex)}
                className={`w-9 h-9 rounded-full border shadow-sm transition-all ${
                  color === c.hex ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : "hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">2. Tu Diseño</label>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition gap-2 group"
          >
            <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
            <span className="font-medium text-sm">{logo ? "Cambiar imagen" : "Subir imagen (PNG)"}</span>
          </button>
        </div>

        {logo && (
          <div className="mb-8 animate-fade-in">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">
              3. Ajustar Tamaño
            </label>
            <input
              type="range"
              min="0.2"
              max="4"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        )}

        <div className="border-t border-gray-100 pt-6 mt-4 space-y-3">
          <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-xl shadow-gray-900/10 transform active:scale-95">
            Agregar al Carrito
          </button>

          <button
            onClick={resetEditor}
            className="w-full py-2 text-gray-400 hover:text-red-500 text-sm font-medium transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} /> Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
