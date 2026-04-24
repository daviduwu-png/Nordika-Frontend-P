import { getCategoryLabel, getMockupForCategory } from "../utils/mockupUtils.jsx";

export default function ProductSelector({ productos, productoActual, onSelect }) {
  if (productos.length <= 1) return null;

  return (
    <div className="lg:absolute lg:top-8 lg:left-8 z-40 flex flex-row lg:flex-col gap-3 sm:gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[540px] w-full lg:w-auto pb-4 lg:pb-0 mb-4 lg:mb-0 max-w-full hide-scrollbar">
      {productos.map((prod) => {
        const { img, icon } = getMockupForCategory(prod.category);
        const isSelected = productoActual?.id === prod.id;
        const previewImg = prod.image || img;
        const productLabel = prod.name || getCategoryLabel(prod.category);
        const categoryLabel = getCategoryLabel(prod.category);

        return (
          <div key={prod.id} className="w-[84px] sm:w-[92px] shrink-0">
            <button
              onClick={() => onSelect(prod)}
              title={productLabel}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl border-2 overflow-hidden bg-white shadow-sm transition-all hover:scale-105 ${
                isSelected
                  ? "border-indigo-600 shadow-indigo-200 shadow-lg ring-2 ring-indigo-600 ring-offset-2"
                  : "border-gray-100 hover:border-indigo-300"
              }`}
            >
              <img src={previewImg} alt={productLabel} className="w-full h-full object-contain p-2" />

              <span className={`absolute bottom-1 right-1 ${isSelected ? "text-indigo-600" : "text-gray-300"}`}>
                {icon}
              </span>
              {isSelected && <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none" />}
            </button>

            <p className="mt-1 text-[11px] leading-tight text-center text-gray-600 truncate" title={productLabel}>
              {productLabel}
            </p>
            <p className="text-[10px] leading-tight text-center text-gray-400 truncate" title={categoryLabel}>
              {categoryLabel}
            </p>
          </div>
        );
      })}
    </div>
  );
}
