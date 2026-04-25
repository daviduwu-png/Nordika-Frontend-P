import { useState, useEffect, useMemo, useRef } from "react";
import { productService } from "../services/productService";
import FeaturedProductCard from "./FeaturedProductCard";

const MOCKUPS = {
  playeras: "/mockups/playera.png",
  sudaderas: "/mockups/sudadera.png",
  gorras: "/mockups/gorra.png",
  tazas: "/mockups/taza.png",
  shorts_box: "/mockups/shorts-box.png",
};

const CATEGORY_LABELS = {
  playeras: "Playeras",
  sudaderas: "Sudaderas",
  gorras: "Gorras",
  tazas: "Tazas",
  shorts_box: "Shorts box",
};

const getCategoryLabel = (category) => {
  if (!category) return "Producto";
  return CATEGORY_LABELS[category] || category.replaceAll("_", " ");
};

const formatPrice = (price) => {
  const amount = Number(price);
  if (!Number.isFinite(amount)) return "$0.00";
  return `$${amount.toFixed(2)}`;
};

export default function FeaturedProducts({ variant = "featured", limit = 8, autoPlayMs = 4500 }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const sliderRef = useRef(null);
  const isHero = variant === "hero";
  const isNewArrivals = variant === "new-arrivals";
  const badgeText = isHero ? "Destacados" : isNewArrivals ? "Recien agregados" : "Mas vendido";

  const maxIndicators = 6;
  const visibleIndicators = useMemo(() => {
    if (productos.length <= maxIndicators) return productos.length;
    return maxIndicators;
  }, [productos.length]);

  useEffect(() => {
    productService.getAllProducts().then((data) => {
      const productList = Array.isArray(data) ? data : [];
      const sortedProducts = [...productList];

      if (isNewArrivals) {
        sortedProducts.sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0));
      }

      setProductos(sortedProducts.slice(0, limit));
      setCargando(false);
    });
  }, [isNewArrivals, limit]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return undefined;

    const updateCurrentSlide = () => {
      const firstCard = slider.querySelector("[data-slide]");
      if (!firstCard) return;

      const cardWidth = firstCard.getBoundingClientRect().width;
      const computedStyle = window.getComputedStyle(slider);
      const gap = parseFloat(computedStyle.columnGap || computedStyle.gap || "0") || 0;
      const step = cardWidth + gap;
      if (!step) return;

      const index = Math.round(slider.scrollLeft / step);
      setCurrentIndex(Math.max(0, Math.min(index, productos.length - 1)));
    };

    updateCurrentSlide();
    slider.addEventListener("scroll", updateCurrentSlide, { passive: true });
    window.addEventListener("resize", updateCurrentSlide);

    return () => {
      slider.removeEventListener("scroll", updateCurrentSlide);
      window.removeEventListener("resize", updateCurrentSlide);
    };
  }, [productos.length]);

  const scrollToIndex = (index) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const firstCard = slider.querySelector("[data-slide]");
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const computedStyle = window.getComputedStyle(slider);
    const gap = parseFloat(computedStyle.columnGap || computedStyle.gap || "0") || 0;
    const step = cardWidth + gap;

    slider.scrollTo({
      left: step * index,
      behavior: "smooth",
    });
  };

  const prevSlide = () => {
    scrollToIndex(Math.max(currentIndex - 1, 0));
  };

  const nextSlide = () => {
    scrollToIndex(Math.min(currentIndex + 1, productos.length - 1));
  };

  useEffect(() => {
    if (productos.length <= 1 || isAutoPlayPaused) return undefined;

    const intervalId = window.setInterval(() => {
      setCurrentIndex((previousIndex) => {
        const nextIndex = previousIndex >= productos.length - 1 ? 0 : previousIndex + 1;
        scrollToIndex(nextIndex);
        return nextIndex;
      });
    }, autoPlayMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [productos.length, isAutoPlayPaused, autoPlayMs]);

  if (cargando) {
    if (isHero) {
      return (
        <div className="flex gap-3 overflow-x-hidden pb-4 px-1 md:px-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse shrink-0 basis-[63%] sm:basis-[46%] md:basis-[35%] lg:basis-[28%]"
            >
              <div className="aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-5 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-1/3" />
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-5 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (productos.length === 0) {
    if (isHero) {
      return <div className="h-[18rem] sm:h-[19rem] md:h-[21rem]" aria-hidden="true" />;
    }

    return null;
  }

  return (
    <div className="relative">
      {!isHero && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-7 bg-gradient-to-r from-white to-transparent hidden md:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 md:w-10 bg-gradient-to-l from-white to-transparent" />
        </>
      )}

      <div
        ref={sliderRef}
        className={`flex ${isHero ? "gap-3" : "gap-3 md:gap-6"} overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 px-1 md:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
        onMouseEnter={() => setIsAutoPlayPaused(true)}
        onMouseLeave={() => setIsAutoPlayPaused(false)}
        onTouchStart={() => setIsAutoPlayPaused(true)}
        onTouchEnd={() => setIsAutoPlayPaused(false)}
      >
        {productos.map((producto) => {
          const imagen = producto.image || MOCKUPS[producto.category] || "/mockups/playera.png";
          const description = (producto.description || "Sin descripcion disponible").trim();
          const hasSlug = Boolean(producto.slug);
          const title = producto.name || "Producto";
          const category = getCategoryLabel(producto.category);
          const href = hasSlug ? `/producto/${producto.slug}` : "/catalogo";
          const basisClass = isHero
            ? "basis-[63%] sm:basis-[46%] md:basis-[35%] lg:basis-[28%]"
            : "basis-[58%] sm:basis-[48%] lg:basis-[31%] xl:basis-[24%]";

          return (
            <FeaturedProductCard
              key={producto.id}
              image={imagen}
              price={formatPrice(producto.price)}
              description={description}
              title={title}
              category={category}
              badge={badgeText}
              href={href}
              basisClass={basisClass}
            />
          );
        })}
      </div>

      <div className={`mt-6 flex items-center justify-center ${isHero ? "" : "sm:justify-between"} gap-4`}>
        <div className="flex items-center gap-2">
          {Array.from({ length: visibleIndicators }).map((_, index) => {
            const targetIndex = Math.round(
              (index * Math.max(productos.length - 1, 0)) / Math.max(visibleIndicators - 1, 1)
            );
            const isActive = currentIndex === targetIndex;

            return (
              <button
                key={`dot-${targetIndex}`}
                type="button"
                aria-label={`Ir al producto ${targetIndex + 1}`}
                onClick={() => scrollToIndex(targetIndex)}
                className={`h-2.5 rounded-full transition-all ${
                  isActive ? "w-8 bg-indigo-600" : "w-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Producto anterior"
            className="h-10 w-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={currentIndex === 0}
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Siguiente producto"
            className="h-10 w-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={currentIndex >= productos.length - 1}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
