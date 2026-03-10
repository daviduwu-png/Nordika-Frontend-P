import { ShoppingBag, RotateCcw, Loader2 } from "lucide-react";
import ColorPicker from "./ColorPicker";
import SizePicker from "./SizePicker";
import DesignUploader from "./DesignUploader";

export default function CustomizerPanel({
  productoActual,
  color,
  logo,
  scale,
  tallaId,
  adding,
  fileInputRef,
  onColorChange,
  onTallaChange,
  onFileChange,
  onScaleChange,
  onAgregar,
  onReset,
}) {
  const tieneVariantes = productoActual?.variants?.length > 0;

  const stepDiseño = tieneVariantes ? 3 : 2;

  const puedeAgregar = !adding && !!productoActual && !!logo && !(tieneVariantes && !tallaId);

  return (
    <div className="w-full lg:w-80 h-fit bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-extrabold text-gray-900">Personalizar</h2>
        <span className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-sm text-center">
          ${productoActual?.price} <br />
          <span className="text-xs">+ $150 (Personalización)</span>
        </span>
      </div>

      <ColorPicker colorActual={color} onChange={onColorChange} />

      <SizePicker variantes={productoActual?.variants} tallaIdActual={tallaId} step={2} onSelect={onTallaChange} />

      <DesignUploader
        logo={logo}
        scale={scale}
        step={stepDiseño}
        fileInputRef={fileInputRef}
        onFileChange={onFileChange}
        onScaleChange={onScaleChange}
      />

      <div className="border-t border-gray-100 pt-6 mt-4 space-y-3">
        <button
          onClick={onAgregar}
          disabled={!puedeAgregar}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-xl shadow-gray-900/10 transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {adding ? <Loader2 size={20} className="animate-spin" /> : <ShoppingBag size={20} />}
          Agregar al Carrito
        </button>

        <button
          onClick={onReset}
          className="w-full py-2 text-gray-400 hover:text-red-500 text-sm font-medium transition flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} /> Reiniciar
        </button>
      </div>
    </div>
  );
}
