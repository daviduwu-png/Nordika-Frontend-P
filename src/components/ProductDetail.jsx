import { useState } from "react";
import { addCartItem } from "../store/cartStore";
import { ShoppingBag, Truck, ShieldCheck, Ruler } from "lucide-react";
import { sileo } from "sileo";
import { getCategoryLabel } from "./ProductCustomizer/utils/mockupUtils.jsx";

const CATEGORY_MOCKUPS = {
  playeras: "/mockups/playera.png",
  sudaderas: "/mockups/sudadera.png",
  gorras: "/mockups/gorra.png",
  tazas: "/mockups/taza.png",
  shorts_box: "/mockups/shorts-box.png",
};

function getProductImage(product) {
  if (product.image) return product.image;
  return CATEGORY_MOCKUPS[product.category] || "/mockups/playera.png";
}

export default function ProductDetail({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(null);

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      sileo.info({ title: "Por favor selecciona una talla." });
      return;
    }

    const productToAdd = {
      ...product,
      selectedVariant: selectedVariant,
    };

    addCartItem(productToAdd);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1">
        <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square sticky top-24">
          <img
            src={getProductImage(product)}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div>
          <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase bg-indigo-50 px-3 py-1 rounded-full">
            {getCategoryLabel(product.category)}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 mb-2 tracking-tight">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900">${product.price}</p>
        </div>

        <div className="prose text-gray-500 leading-relaxed">
          <p>{product.description || "Sin descripción disponible para este producto."}</p>
        </div>

        {product.variants && product.variants.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-900">Selecciona tu talla</h3>
              <button className="text-xs text-indigo-600 font-bold flex items-center gap-1 hover:underline">
                <Ruler size={14} /> Guía de tallas
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                const isOutOfStock = variant.stock <= 0;

                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={isOutOfStock}
                    className={`
                                    min-w-[3.5rem] h-14 rounded-xl border-2 font-bold text-sm transition-all
                                    ${
                                      isSelected
                                        ? "border-black bg-black text-white shadow-lg scale-105"
                                        : "border-gray-200 bg-white text-gray-900 hover:border-black"
                                    }
                                    ${isOutOfStock ? "opacity-50 cursor-not-allowed decoration-slice line-through bg-gray-50" : ""}
                                `}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>

            {selectedVariant && selectedVariant.stock < 5 && selectedVariant.stock > 0 && (
              <p className="text-orange-500 text-xs font-bold mt-2 animate-pulse">
                ¡Solo quedan {selectedVariant.stock} piezas!
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-indigo-600 text-white h-14 rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <ShoppingBag size={20} />
            Agregar al Carrito
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <Truck size={20} className="text-gray-400" />
            <span>Envío gratis $999</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-gray-400" />
            <span>Garantía Nordika</span>
          </div>
        </div>
      </div>
    </div>
  );
}
