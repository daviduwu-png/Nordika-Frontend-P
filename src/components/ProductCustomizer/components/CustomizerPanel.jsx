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
    <div className="w-full lg:w-90 h-fit bg-white p-6 rounded-3xl shadow-xl border border-gray-100 sticky top-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 mb-6">
        <h2 className="text-xl font-extrabold text-gray-900">Personalizar</h2>
        <div className="rounded-xl border border-indigo-200/70 bg-white/90 px-4 sm:px-3 py-3 sm:py-2 flex flex-row sm:flex-col justify-between items-center sm:items-end shadow-sm w-full sm:w-auto sm:min-w-[10.5rem]">
          <div className="text-left sm:text-right">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-indigo-500">Precio base</p>
            <p className="text-xl sm:text-2xl font-extrabold text-indigo-700 leading-none mt-1">${productoActual?.price}</p>
          </div>
          <p className="text-[10px] sm:text-[11px] font-semibold text-indigo-600 mt-0 sm:mt-1 bg-indigo-50 sm:bg-transparent px-2 py-1 sm:p-0 rounded-md sm:rounded-none">+ $150 Personalización</p>
        </div>
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
