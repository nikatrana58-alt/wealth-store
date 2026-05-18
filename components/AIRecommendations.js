"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useProducts } from "./ProductsProvider";

export default function AIRecommendations() {
  const { products, loading } = useProducts();
  const recommendations = products.slice(0, 3);

  return (
    <section className="max-w-[1440px] mx-auto px-5 py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-2 text-purple-500 font-black uppercase tracking-[0.3em] text-xs mb-4">
            <BrainCircuit size={14} />
            Neural Engine Match
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
            Smart <span className="premium-gradient italic">Curations</span>
          </h2>
          <p className="text-gray-500 text-xl font-medium mt-6 max-w-lg">
            Our AI analyzed 12,000+ data points to find your perfect luxury match.
          </p>
        </div>
        
        <button className="glass px-10 py-5 rounded-3xl font-black text-sm hover:bg-white/5 transition flex items-center gap-2 group">
          Refine Algorithm
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {loading
          ? [1, 2, 3].map((item) => (
            <div
              key={item}
              className="glass rounded-5xl overflow-hidden h-[560px] skeleton"
            />
          ))
          : recommendations.map((product, i) => (
          <Link href={`/product/${product.slug}`} key={product.id || product.slug}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="glass rounded-5xl overflow-hidden group border border-white/5 hover:border-purple-500/30 transition-all duration-700 bg-white/2"
            >
              <div className="relative aspect-square overflow-hidden p-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-4xl group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-8 right-8">
                  <div className="glass px-4 py-2 rounded-2xl backdrop-blur-xl border border-white/20">
                    <span className="text-xs font-black text-white">{product.score}% Match</span>
                  </div>
                </div>
              </div>

              <div className="p-10 pt-4">
                <p className="text-xs font-black text-purple-500 uppercase tracking-widest mb-2">{product.aiTag}</p>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-purple-400 transition-colors">
                    {product.title}
                  </h3>
                  <span className="text-xl font-black">{product.price}</span>
                </div>
                
                <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed mb-8">
                  {product.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                  View Analysis <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
