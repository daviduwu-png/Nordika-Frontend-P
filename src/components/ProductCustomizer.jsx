import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { Upload, X, RotateCcw, ShoppingBag, Coffee, Shirt, Loader2 } from "lucide-react";
import { addCartItem } from "../store/cartStore";
import { productService } from "../services/productService";
import { sileo } from "sileo";

export default function ProductCustomizer() {
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productoActual, setProductoActual] = useState(null);
  
  const [color, setColor] = useState("#ffffff");
  const [logo, setLogo] = useState(null);
  const [scale, setScale] = useState(1);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  
  const [tallaId, setTallaId] = useState(null);

  const fileInputRef = useRef(null);
  const draggableRef = useRef(null);

  const colores = [
    { nombre: "Blanco", hex: "#ffffff" },
    { nombre: "Negro", hex: "#262626" },
    { nombre: "Rojo", hex: "#ef4444" },
    { nombre: "Azul", hex: "#3b82f6" },
    { nombre: "Amarillo", hex: "#eab308" },
    { nombre: "Verde", hex: "#22c55e" },
  ];

  
  const getMockupForCategory = (category) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("sudadera")) return { img: "/mockups/sudadera.png", icon: <ShoppingBag /> };
    if (cat.includes("taza")) return { img: "/mockups/taza.png", icon: <Coffee /> };
    return { img: "/mockups/playera.png", icon: <Shirt /> }; 
  };

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await productService.getAllProducts();
        // Filtrar aquellos que permiten personalización
        const customizables = data.filter((p) => p.is_customizable);
        setProductosDisponibles(customizables);

        if (customizables.length > 0) {
          seleccionarProducto(customizables[0]);
        }
      } catch (error) {
        console.error("Error cargando productos personalizables:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const seleccionarProducto = (prod) => {
    setProductoActual(prod);
    setLogo(null);
    setColor("#ffffff");
    setScale(1);
    // Auto-seleccionar la primera talla disponible si existen variantes
    if (prod.variants && prod.variants.length > 0) {
      setTallaId(prod.variants[0].id);
    } else {
      setTallaId(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validación de peso máximo: 5MB
      if (file.size > 5 * 1024 * 1024) {
        sileo.error({
          title: "Imagen demasiado pesada",
          description: "El diseño no debe superar los 5MB.",
        });
        e.target.value = "";
        return;
      }

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
    if (productoActual?.variants?.length > 0) {
      setTallaId(productoActual.variants[0].id);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAgregarAlCarrito = async () => {
    if (!productoActual) return;
    
    if (productoActual.variants && productoActual.variants.length > 0 && !tallaId) {
      sileo.error({ title: "Falta talla", description: "Selecciona una talla para continuar."});
      return;
    }

    setAdding(true);
    try {
      const mockupInfo = getMockupForCategory(productoActual.category);
      const varianteSeleccionada = productoActual.variants?.find((v) => v.id === tallaId) || null;

      const cartItem = {
        id: productoActual.id,
        cartItemId: `custom-${productoActual.id}-${tallaId || 'novar'}-${Date.now()}`,
        name: `${productoActual.name} Personalizada`,
        price: Number(productoActual.price) + 150, 
        image: mockupInfo.img,
        category: productoActual.category,
        cantidad: 1,
        selectedVariant: varianteSeleccionada,
        
        customization: {
          product_type: productoActual.category,
          base_color: color,
          design_image: logo || null,
          scale: scale,
        },
      };

      addCartItem(cartItem);
      sileo.success({
        title: "¡Producto agregado!",
        description: `${productoActual.name} personalizada añadida al carrito.`,
      });
      resetEditor();
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      sileo.error({ title: "Error", description: "No se pudo agregar el producto." });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center text-gray-400 gap-4">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <p className="font-medium animate-pulse">Cargando ropa personalizable...</p>
        </div>
      </div>
    );
  }

  if (productosDisponibles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px] text-gray-500 p-8 text-center bg-gray-50 m-4 rounded-3xl border border-gray-100">
        <div>
          <Shirt size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-900">Sin productos personalizables</h2>
          <p className="mt-2 text-sm">El administrador aún no ha habilitado productos "is_customizable" en el catálogo.</p>
        </div>
      </div>
    );
  }

  const mockupUI = getMockupForCategory(productoActual?.category);

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] p-4">
      
      <div className="flex-1 bg-gray-50 rounded-3xl border border-gray-200 p-4 lg:p-10 flex flex-col items-center justify-center relative shadow-sm overflow-hidden">
        <div className="absolute top-4 left-4 z-40 flex flex-col gap-3">
          {productosDisponibles.map((prod) => {
            const { img } = getMockupForCategory(prod.category);
            const isSelected = productoActual?.id === prod.id;
            return (
              <button
                key={prod.id}
                onClick={() => seleccionarProducto(prod)}
                title={prod.name}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden bg-white shadow-sm transition-all hover:scale-105 ${
                  isSelected
                    ? "border-indigo-600 shadow-indigo-200 shadow-lg ring-2 ring-indigo-600 ring-offset-2"
                    : "border-gray-100 hover:border-indigo-300"
                }`}
              >
                <img src={img} alt={prod.name} className="w-full h-full object-contain p-2" />
                {isSelected && (
                  <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        
        <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center select-none bg-white/50 rounded-2xl border border-gray-100/50">
          <img
            src={mockupUI.img}
            alt="Base"
            className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none drop-shadow-2xl"
          />

          <div
            className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply transition-colors duration-300"
            style={{
              backgroundColor: color,
              maskImage: `url(${mockupUI.img})`,
              WebkitMaskImage: `url(${mockupUI.img})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />

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
          <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-sm text-center">
            ${productoActual?.price} <br/>
            <span className="text-xs">+ $150 (Personalización)</span>
          </span>
        </div>

        <div className="mb-8">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">1. Color Base</label>
          <div className="flex flex-wrap gap-3">
            {colores.map((c) => (
              <button
                key={c.hex}
                title={c.nombre}
                onClick={() => setColor(c.hex)}
                className={`w-9 h-9 rounded-full border shadow-sm transition-all ${
                  color === c.hex ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : "hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        {productoActual?.variants && productoActual.variants.length > 0 && (
          <div className="mb-8 animate-fade-in-up">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">
               2. Elige tu Talla
             </label>
             <div className="flex flex-wrap gap-2">
               {productoActual.variants.map((v) => (
                 <button
                   key={v.id}
                   disabled={v.stock <= 0}
                   onClick={() => setTallaId(v.id)}
                   className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors border ${
                     v.stock <= 0 
                      ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed line-through"
                      : tallaId === v.id
                       ? "bg-gray-900 border-gray-900 text-white shadow-md relative overflow-hidden"
                       : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                   }`}
                 >
                   {v.size === "UNI" ? "Unitalla" : v.size}
                 </button>
               ))}
             </div>
             {tallaId && productoActual.variants.find(v => v.id === tallaId)?.stock <= 5 && (
                 <p className="text-xs text-orange-500 mt-2 font-medium">
                   ¡Deprisa! Solo quedan {productoActual.variants.find(v => v.id === tallaId).stock} disponibles.
                 </p>
             )}
          </div>
        )}

        <div className="mb-8">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">
            {productoActual?.variants?.length > 0 ? "3. Tu Diseño" : "2. Tu Diseño"}
          </label>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition gap-2 group"
          >
            <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
            <span className="font-medium text-sm">{logo ? "Cambiar imagen" : "Subir imagen (PNG)"}</span>
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Importante: Al enviar diseño estás aceptando un cargo fijo extra de $150.00 MXN en el checkout.
          </p>
          {logo && (
            <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
              ✓ Diseño cargado
            </p>
          )}
        </div>

        {logo && (
          <div className="mb-8 animate-fade-in-up">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">
              Ajustar Tamaño
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
          <button
            onClick={handleAgregarAlCarrito}
            disabled={adding || !productoActual || (productoActual.variants?.length > 0 && !tallaId) || !logo}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-xl shadow-gray-900/10 transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {adding ? <Loader2 size={20} className="animate-spin" /> : <ShoppingBag size={20} />}
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
