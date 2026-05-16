"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/getProducts";
import { motion } from "framer-motion";
import { Compass, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DiscoverSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const p = await getProducts();
      setProducts(p.slice(0, 2));
    };
    load();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-5 py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-2 text-purple-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
            <Compass size={14} />
            Exploration Hub
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
            Grand <span className="premium-gradient italic">Discoveries</span>
          </h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {products.map((product, i) => (
          <Link href={`/product/${product.slug}`} key={product.id || product.slug}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="glass rounded-6xl overflow-hidden group border border-white/5 hover:border-purple-500/30 transition-all duration-1000 bg-white/1"
            >
              <div className="overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-150 object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#020617] via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                      {product.category}
                    </span>
                    <span className="text-white/40 font-bold text-xs uppercase tracking-widest">Premium Collection</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter group-hover:text-purple-400 transition-colors">
                      {product.title}
                    </h3>
                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 shadow-2xl shrink-0">
                      <ArrowRight size={24} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 bg-black/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Limited Availability</span>
                  </div>
                  <span className="text-3xl font-black text-white">{product.price}</span>
                </div>
                <p className="text-gray-500 text-lg font-medium leading-relaxed line-clamp-2">
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