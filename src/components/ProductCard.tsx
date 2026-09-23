import Link from "next/link";
import { Product } from "@/types";
import { getImageUrl, formatRupiah } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const displayPrice =
    product.discount_price && product.discount_price > 0
      ? product.discount_price
      : product.price || product.original_price || 0;

  const thumbnailUrl = getImageUrl(product.thumbnail?.url || "/assets/img/placeholder.webp");

  return (
    <Link
      href={`/produk/${product.slug || ""}`}
      className="product-card bg-white rounded-lg overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg border border-transparent hover:border-secondary shadow-sm flex flex-col justify-between group relative"
    >
      <div className="relative w-full h-44 overflow-hidden bg-[#FAFAFA]">
        <img
          src={thumbnailUrl}
          alt={product.thumbnail?.alt_text || product.name || "Produk"}
          className="w-full h-full object-fit"
        />

        {product.is_sale && (
          <div className="absolute top-2 left-2 bg-secondary text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded shadow z-10 uppercase tracking-wider">
            PROMO
          </div>
        )}

        {product.discount_percentage !== null &&
          product.discount_percentage !== undefined &&
          product.discount_percentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] md:text-xs font-black px-1.5 py-0.5 rounded shadow z-10">
              {product.discount_percentage}% OFF
            </div>
          )}
      </div>

      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-xs md:text-sm font-bold mb-1.5 text-textDark line-clamp-2 h-9 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {product.original_price > displayPrice ? (
            <div className="text-gray-400 line-through text-xs">
              {formatRupiah(product.original_price)}
            </div>
          ) : (
            <div className="h-4" />
          )}

          <div className="mt-1">
            <div className="text-secondary text-base md:text-lg font-extrabold tracking-tight whitespace-nowrap">
              {product.formatted_price && product.formatted_price !== "Rp 0"
                ? product.formatted_price
                : formatRupiah(displayPrice)}
            </div>
          </div>
        </div>

        <div className="text-[10px] md:text-xs text-textMuted mt-3 pt-1.5 border-t border-[#F0F0F0] flex justify-between items-center">
          <span className="flex items-center gap-1">
            ⭐ {product.average_rating || 5.0}
            {product.total_sold ? ` | Terjual ${product.total_sold}+` : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}