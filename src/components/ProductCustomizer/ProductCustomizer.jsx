import { Shirt, Loader2 } from "lucide-react";
import { useCustomizer } from "./hooks/useCustomizer";
import { getMockupForCategory } from "./utils/mockupUtils.jsx";
import ProductSelector from "./components/ProductSelector";
import MockupCanvas from "./components/MockupCanvas";
import CustomizerPanel from "./components/CustomizerPanel";

/**
 * ProductCustomizer
 * Componente raíz del personalizador de productos.
 *
 * Arquitectura:
 *   - useCustomizer()     → toda la lógica de estado y efectos
 *   - ProductSelector     → botones para cambiar de producto (solo si hay >1)
 *   - MockupCanvas        → área visual con mockup, color y logo draggable
 *   - CustomizerPanel     → panel lateral con controles (color, talla, diseño)
 *     ├── ColorPicker
 *     ├── SizePicker
 *     └── DesignUploader
 */
export default function ProductCustomizer() {
  const {
    productosDisponibles,
    productoActual,
    loading,
    color,
    logo,
    scale,
    tallaId,
    adding,
    fileInputRef,
    draggableRef,
    setColor,
    setScale,
    setTallaId,
    setLogo,
    seleccionarProducto,
    handleImageUpload,
    resetEditor,
    handleAgregarAlCarrito,
  } = useCustomizer();

  // ── Estados de carga / vacío ────────────────────────────────────────────────

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
          <p className="mt-2 text-sm">
            El administrador aún no ha habilitado productos &quot;is_customizable&quot; en el catálogo.
          </p>
        </div>
      </div>
    );
  }

  const mockupUI = getMockupForCategory(productoActual?.category);
  const showSelector = productosDisponibles.length > 1;

  // ── UI principal ────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] p-4">
      <div
        className={`flex-1 bg-gray-50 rounded-3xl border border-gray-200 p-4 lg:p-10 flex flex-col items-center justify-start lg:justify-center relative shadow-sm overflow-hidden ${
          showSelector ? "lg:pl-28" : ""
        }`}
      >
        <ProductSelector
          productos={productosDisponibles}
          productoActual={productoActual}
          onSelect={seleccionarProducto}
        />

        <MockupCanvas
          mockupImg={mockupUI.img}
          color={color}
          logo={logo}
          scale={scale}
          draggableRef={draggableRef}
          fileInputRef={fileInputRef}
          onRemoveLogo={() => setLogo(null)}
        />
      </div>

      {/* ── Panel de controles derecho ── */}
      <CustomizerPanel
        productoActual={productoActual}
        color={color}
        logo={logo}
        scale={scale}
        tallaId={tallaId}
        adding={adding}
        fileInputRef={fileInputRef}
        onColorChange={setColor}
        onTallaChange={setTallaId}
        onFileChange={handleImageUpload}
        onScaleChange={setScale}
        onAgregar={handleAgregarAlCarrito}
        onReset={resetEditor}
      />
    </div>
  );
}
