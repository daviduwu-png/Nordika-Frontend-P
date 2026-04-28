const getCategoryLabel = (category) => {
  if (!category) return "Producto";
  return category;
};

export default function FeaturedProductCard({
  image,
  price,
  description,
  title,
  category,
  badge,
  href,
  basisClass,
  slideStyle,
}) {
  return (
    <a
      data-slide
      href={href}
      style={slideStyle}
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer flex flex-col shrink-0 min-w-0 snap-start ${basisClass}`}
    >
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <span className="absolute top-2 left-2 z-10 rounded-full bg-gray-900 text-white text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wide">
          {badge}
        </span>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden lg:block">
          <div className="w-full bg-white text-gray-900 font-bold py-2 rounded-lg shadow-lg hover:bg-gray-50 flex items-center justify-center gap-2">
            <span>Ver Detalles</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{getCategoryLabel(category)}</p>
        <h3
          className="text-lg font-bold text-gray-900 leading-snug min-h-[3.25rem]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title || "Producto"}
        </h3>
        <p
          className="text-sm text-gray-500 leading-relaxed mt-1 min-h-[2.5rem]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="text-xl font-bold text-indigo-600">{price}</span>
        </div>
      </div>
    </a>
  );
}
