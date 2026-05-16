"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/getProducts";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ProductSpotlight() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const load = async () => {
      const p = await getProducts();
      setProduct(p.find(item => item.badge === "Luxury") || p[0]);
    };
    load();
  }, []);

  if (!product) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 py-32 overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-center gap-2 text-purple-400 font-black uppercase tracking-[0.3em] text-[10px] mb-8">
            <Sparkles size={14} />
            Spotlight Selection
          </div>

          <h2 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-8">
            Masterpiece of <span className="premium-gradient italic">Design</span>
          </h2>

          <p className="text-gray-400 text-xl leading-relaxed mb-12 font-medium max-w-lg">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <ShieldCheck className="text-purple-400" size={20} />
              </div>
              <span className="text-sm font-bold text-gray-300">Certified Luxury</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Sparkles className="text-pink-400" size={20} />
              </div>
              <span className="text-sm font-bold text-gray-300">Limited Edition</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href={`/product/${product.slug}`}>
              <button className="bg-white text-black px-10 py-5 rounded-3xl font-black text-lg hover:scale-[1.05] active:scale-95 transition-all shadow-2xl">
                Explore Details
              </button>
            </Link>
            <div className="text-3xl font-black">{product.price}</div>
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-purple-600/20 blur-[120px] rounded-full group-hover:bg-purple-600/30 transition-all duration-1000"></div>
          
          <div className="relative glass p-4 rounded-[60px] border border-white/10 overflow-hidden bg-white/5 backdrop-blur-3xl">
            <img
              src={product.image}
              alt={product.title}
              className="relative z-10 rounded-[48px] w-full h-175 object-cover hover:scale-[1.02] transition-transform duration-1000"
            />
            
            <div className="absolute bottom-12 right-12 z-20">
              <div className="glass px-8 py-5 rounded-3xl border border-white/20 backdrop-blur-2xl">
                <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Affiliate Rating</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-black">4.9</div>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} size={12} className="fill-current" />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}