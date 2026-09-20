// components/product/ProductRecommendations.tsx
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types";

interface Props {
  loading: boolean;
  recommendations: Product[];
}

export function ProductRecommendations({ loading, recommendations }: Props) {
  if (!loading && recommendations.length === 0) return null;

  return (
    <section className="mt-16 md:mt-24">
      <div className="flex justify-between items-center mb-6 bg-white p-3.5 border-b-2 border-primary rounded-t shadow-sm">
        <div className="text-sm md:text-lg font-bold text-primary uppercase">Produk Rekomendasi</div>
        <Link href="/produk" className="text-secondary text-xs md:text-sm font-medium hover:opacity-85">
          Lihat Koleksi →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg h-64 border border-gray-100 p-3 flex flex-col justify-between animate-pulse">
              <div className="w-full h-36 bg-gray-200 rounded-md"></div>
              <div className="space-y-2 mt-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {recommendations.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </section>
  );
}