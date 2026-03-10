import { COLORES } from "../utils/mockupUtils.jsx";

export default function ColorPicker({ colorActual, onChange }) {
  return (
    <div className="mb-8">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">
        1. Color Base
      </label>
      <div className="flex flex-wrap gap-3">
        {COLORES.map((c) => (
          <button
            key={c.hex}
            title={c.nombre}
            onClick={() => onChange(c.hex)}
            className={`w-9 h-9 rounded-full border shadow-sm transition-all ${
              colorActual === c.hex
                ? "ring-2 ring-offset-2 ring-gray-900 scale-110"
                : "hover:scale-105"
            }`}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </div>
  );
}
