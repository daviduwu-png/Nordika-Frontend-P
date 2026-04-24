import Draggable from "react-draggable";
import { X } from "lucide-react";

export default function MockupCanvas({ mockupImg, color, logo, scale, draggableRef, fileInputRef, onRemoveLogo }) {
  return (
    <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center select-none bg-white/50 rounded-2xl border border-gray-100/50 my-auto">
      <img
        src={mockupImg}
        alt="Base del producto"
        className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none drop-shadow-2xl p-6"
      />

      <div
        className="absolute inset-0 z-20 pointer-events-none mix-blend-multiply transition-colors duration-300"
        style={{
          backgroundColor: color,
          maskImage: `url(${mockupImg})`,
          WebkitMaskImage: `url(${mockupImg})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />

      <div className="absolute inset-0 z-30 overflow-hidden flex items-center justify-center">
        {logo ? (
          <Draggable nodeRef={draggableRef}>
            <div ref={draggableRef} className="cursor-move relative group inline-block">
              <img
                src={logo}
                alt="Diseño personalizado"
                style={{ transform: `scale(${scale})` }}
                className="max-w-[200px] pointer-events-none drop-shadow-md"
              />
              <button
                onClick={() => {
                  onRemoveLogo();
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute -top-4 -right-4 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:scale-110 z-50"
                title="Quitar diseño"
              >
                <X size={14} />
              </button>
            </div>
          </Draggable>
        ) : (
          <div className="pointer-events-none opacity-40 border-2 border-gray-300 border-dashed p-4 rounded-xl">
            <p className="text-xs font-bold text-gray-400">El diseño aparecerá aquí</p>
          </div>
        )}
      </div>
    </div>
  );
}
