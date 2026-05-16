"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/getProducts";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import MasonryGrid from "./MasonryGrid";
import { Sparkles } from "lucide-react";

export default function DiscoverFeed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const p = await getProducts();
      setProducts(p);
    };
    load();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-5 py-32">
      <div className="mb-20 text-center">
        <div className="flex items-center justify-center gap-2 text-purple-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
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

      <MasonryGrid>
        {products.map((product) => (
          <ProductCard
            key={product.id || product.slug}
            product={product}
          />
        ))}
      </MasonryGrid>
    </section>
  );
}