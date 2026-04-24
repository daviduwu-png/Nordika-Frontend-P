import { ShoppingBag, Coffee, Shirt, HardHat } from "lucide-react";

export const getMockupForCategory = (category) => {
  const cat = (category || "").toLowerCase();

  if (cat.includes("short") && cat.includes("box")) {
    return { img: "/mockups/shorts-box.png", icon: <Shirt size={20} /> };
  }
  if (cat.includes("sudadera")) return { img: "/mockups/sudadera.png", icon: <ShoppingBag size={20} /> };
  if (cat.includes("taza")) return { img: "/mockups/taza.png", icon: <Coffee size={20} /> };
  if (cat.includes("gorra")) return { img: "/mockups/gorra.png", icon: <HardHat size={20} /> };

  return { img: "/mockups/playera.png", icon: <Shirt size={20} /> };
};

/**
 * Paleta de colores disponibles para personalización.
 */
export const COLORES = [
  { nombre: "Blanco", hex: "#ffffff" },
  { nombre: "Negro", hex: "#262626" },
  { nombre: "Rojo", hex: "#ef4444" },
  { nombre: "Azul", hex: "#3b82f6" },
  { nombre: "Amarillo", hex: "#eab308" },
  { nombre: "Verde", hex: "#22c55e" },
];
