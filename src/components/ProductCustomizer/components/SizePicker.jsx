export default function SizePicker({ variantes, tallaIdActual, step, onSelect }) {
  if (!variantes || variantes.length === 0) return null;

  const varianteActiva = variantes.find((v) => v.id === tallaIdActual);

  return (
    <div className="mb-8 animate-fade-in-up">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">
        {step}. Elige tu Talla
      </label>

      <div className="flex flex-wrap gap-2">
        {variantes.map((v) => (
          <button
            key={v.id}
            disabled={v.stock <= 0}
            onClick={() => onSelect(v.id)}
            className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors border ${
              v.stock <= 0
                ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed line-through"
                : tallaIdActual === v.id
                  ? "bg-gray-900 border-gray-900 text-white shadow-md"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            {v.size === "UNI" ? "Unitalla" : v.size}
          </button>
        ))}
      </div>

      {tallaIdActual && varianteActiva && varianteActiva.stock <= 5 && (
        <p className="text-xs text-orange-500 mt-2 font-medium">
          ¡Deprisa! Solo quedan {varianteActiva.stock} disponibles.
        </p>
      )}
    </div>
  );
}
