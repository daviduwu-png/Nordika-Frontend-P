import { Upload } from "lucide-react";

export default function DesignUploader({ logo, scale, step, fileInputRef, onFileChange, onScaleChange }) {
  return (
    <>
      <div className="mb-8">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">
          {step}. Tu Diseño
        </label>

        <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition gap-2 group"
        >
          <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
          <span className="font-medium text-sm">{logo ? "Cambiar imagen" : "Subir imagen (PNG)"}</span>
        </button>

        <p className="text-xs text-gray-400 mt-2">
          Importante: Al enviar diseño estás aceptando un cargo fijo extra de $150.00 MXN en el checkout.
        </p>

        {logo && <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">✓ Diseño cargado</p>}
      </div>

      {logo && (
        <div className="mb-8 animate-fade-in-up">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block">Ajustar Tamaño</label>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={scale}
            onChange={(e) => onScaleChange(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      )}
    </>
  );
}
