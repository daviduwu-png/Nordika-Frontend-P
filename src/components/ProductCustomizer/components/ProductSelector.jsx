import { getMockupForCategory } from "../utils/mockupUtils.jsx";

export default function ProductSelector({ productos, productoActual, onSelect }) {
  if (productos.length <= 1) return null;

  return (
    <div className="lg:absolute lg:top-8 lg:left-8 z-40 flex flex-row lg:flex-col gap-3 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 mb-4 lg:mb-0 max-w-full hide-scrollbar">
      {productos.map((prod) => {
        const { img, icon } = getMockupForCategory(prod.category);
        const isSelected = productoActual?.id === prod.id;

        return (
          <button
            key={prod.id}
            onClick={() => onSelect(prod)}
            title={prod.name}
            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 overflow-hidden bg-white shadow-sm transition-all hover:scale-105 ${
              isSelected
                ? "border-indigo-600 shadow-indigo-200 shadow-lg ring-2 ring-indigo-600 ring-offset-2"
                : "border-gray-100 hover:border-indigo-300"
            }`}
          >
            <img src={img} alt={prod.name} className="w-full h-full object-contain p-2" />

            <span className={`absolute bottom-1 right-1 ${isSelected ? "text-indigo-600" : "text-gray-300"}`}>
              {icon}
            </span>
            {isSelected && <div className="absolute inset-0 bg-indigo-600/10 pointer-events-none" />}
          </button>
        );
      })}
    </div>
  );
}
