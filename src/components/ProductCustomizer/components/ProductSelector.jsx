import { getCategoryLabel, getMockupForCategory } from "../utils/mockupUtils.jsx";

export default function ProductSelector({ productos, productoActual, onSelect }) {
  if (productos.length <= 1) return null;

  return (
    <div className="z-40 flex flex-row lg:flex-col gap-3 sm:gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[520px] w-full lg:w-[124px] lg:pr-4 pb-4 lg:pb-2 pt-1 lg:pt-2 mb-4 lg:mb-0 max-w-full shrink-0">
      {productos.map((prod) => {
        const { img, icon } = getMockupForCategory(prod.category);
        const isSelected = productoActual?.id === prod.id;
        const previewImg = img || prod.image;
        const productLabel = prod.name || getCategoryLabel(prod.category);
        const categoryLabel = getCategoryLabel(prod.category);

        return (
          <div key={prod.id} className="shrink-0 w-[88px] sm:w-[96px]">
            <button
              onClick={() => onSelect(prod)}
              title={productLabel}
              className={`relative mx-auto rounded-2xl border-2 overflow-hidden bg-white shadow-sm transition-all duration-200 flex items-center justify-center ${
                isSelected
                  ? "w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] border-indigo-600 ring-1 ring-indigo-600"
                  : "w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] border-gray-100 hover:border-indigo-300"
              }`}
            >
              <img
                src={previewImg}
                alt={productLabel}
                className={`w-full h-full object-contain transition-all duration-200 ${isSelected ? "p-2.5" : "p-3"}`}
              />

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
