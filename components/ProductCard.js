"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Star, Eye, Zap } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.slug}`}>
      <motion.div
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
          event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
        }}
        whileHover={{ y: -12 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="group spotlight relative cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-[40px] bg-gradient-to-r from-purple-600/20 to-pink-500/20 opacity-0 blur-3xl transition duration-700 group-hover:opacity-100" />

        <div className="glass relative overflow-hidden rounded-[40px] border border-white/5 bg-black/20 backdrop-blur-3xl">
          {/* Badge & Stats Overlay */}
          <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
            {product.badge && (
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-md px-4 py-1.5 self-start">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  {product.badge}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-full border border-white/5 bg-black/40 backdrop-blur-md px-4 py-1.5 self-start">
              <Zap size={12} className="text-purple-400" />
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">
                {product.aiTag || "Premium Pick"}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="absolute top-6 right-6 z-20">
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
              <ArrowUpRight size={20} />
            </div>
          </div>

          {/* Image Section */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition duration-1000 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-1">
                  {product.category}
                </p>
                <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-purple-400 transition-colors">
                  {product.title}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-white">{product.price}</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm line-clamp-2 mb-6 font-medium leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Eye size={14} className="text-gray-400" />
                </div>
                <span className="text-xs font-bold text-gray-400">{product.views} Views</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${product.score}%` }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                  />
                </div>
                <span className="text-[10px] font-black text-white">{product.score}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}