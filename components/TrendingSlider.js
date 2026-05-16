"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/getProducts";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TrendingSlider() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const p = await getProducts();
      setProducts(p.slice(0, 6));
    };
    load();
  }, []);

  return (
    <section className="py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 mb-12 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-purple-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
            <TrendingUp size={14} />
            Live Now
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Trending <span className="premium-gradient italic">Curations</span>
          </h2>
        </div>
        <button className="glass px-8 py-4 rounded-2xl font-black text-sm hover:bg-white/5 transition flex items-center gap-2 group">
          View All 
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex gap-8 overflow-x-auto scrollbar-hide px-5 pb-10">
        {products.map((product, i) => (
          <Link href={`/product/${product.slug}`} key={product.id || product.slug}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[400px] glass rounded-[48px] overflow-hidden group border border-white/5 hover:border-purple-500/30 transition-all duration-700"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-10">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-purple-400 transition-colors">
                    {product.title}
                  </h3>
                  <span className="text-2xl font-black">
                    {product.price}
                  </span>
                </div>

                <p className="text-gray-400 font-medium line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}