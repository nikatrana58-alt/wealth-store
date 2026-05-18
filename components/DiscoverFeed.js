"use client";

import ProductCard from "./ProductCard";
import MasonryGrid from "./MasonryGrid";
import { Sparkles } from "lucide-react";
import { useProducts } from "./ProductsProvider";

export default function DiscoverFeed() {
  const { products, loading } = useProducts();

  return (
    <section className="max-w-[1440px] mx-auto px-5 py-32">
      <div className="mb-20 text-center">
        <div className="flex items-center justify-center gap-2 text-purple-500 font-black uppercase tracking-[0.3em] text-xs mb-4">
          <Sparkles size={14} />
          The Infinite Vault
        </div>

        <h2 className="text-6xl md:text-8xl font-black tracking-tighter">
          Unearth <span className="premium-gradient italic">Treasures</span>
        </h2>
        
        <p className="text-gray-500 text-xl font-medium mt-6 max-w-2xl mx-auto">
          Deep-dive into our complete collection of verified viral masterpieces.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="glass h-[420px] rounded-5xl skeleton" />
          ))}
        </div>
      ) : (
        <MasonryGrid>
          {products.map((product) => (
            <ProductCard
              key={product.id || product.slug}
              product={product}
            />
          ))}
        </MasonryGrid>
      )}
    </section>
  );
}
