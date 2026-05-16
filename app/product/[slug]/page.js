"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/getProducts";
import { ArrowLeft, ShoppingCart, Star, Eye, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const allProducts = await getProducts();
      const p = allProducts.find((item) => item.slug === params.slug);
      setProduct(p);
      setLoading(false);
    };
    fetchProduct();
  }, [params.slug]);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-7xl font-black">404</h1>
      <p className="text-xl text-gray-400">This luxury item is no longer in our vault.</p>
      <Link href="/" className="glass px-8 py-4 rounded-2xl font-bold hover:bg-white/5 transition">
        Return Home
      </Link>
    </div>
  );

  return (
    <div className="bg-[#020617] text-white selection:bg-purple-500">
      <Navbar />
      
      <main className="min-h-screen px-6 py-24 max-w-7xl mx-auto">
        <Link
          href="/"
          className="group flex items-center gap-2 text-gray-500 hover:text-white mb-12 transition-colors font-bold"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-[48px] overflow-hidden border border-white/5 bg-white/5 p-4">
              <img
                src={product.image}
                alt={product.title}
                className="rounded-[32px] w-full h-[600px] object-cover"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {(product.gallery || [product.image, product.image, product.image]).slice(0, 3).map((img, i) => (
                <div key={i} className="glass rounded-3xl overflow-hidden aspect-square p-2 bg-white/5 hover:border-purple-500/50 transition cursor-pointer">
                  <img src={img} className="w-full h-full object-cover rounded-2xl" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="bg-purple-600/20 text-purple-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                {product.category}
              </span>
              <span className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <Eye size={14} />
                {product.views} Views
              </span>
            </div>

            <h1 className="text-6xl font-black mb-8 leading-tight tracking-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-6 mb-12">
              <div className="text-5xl font-black bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                {product.price}
              </div>
              <div className="glass px-5 py-2.5 rounded-2xl flex items-center gap-2 border border-white/10">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <span className="font-black">{product.rating}</span>
                <span className="text-gray-500 font-bold ml-1 text-xs">/ 5.0</span>
              </div>
            </div>

            <p className="text-gray-400 text-xl leading-relaxed mb-12 font-medium">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-12">
              {[
                { icon: ShieldCheck, label: "Authentic Product", sub: "Verified Source" },
                { icon: Truck, label: "Express Shipping", sub: "Dispatched in 24h" },
                { icon: RotateCcw, label: "Luxury Support", sub: "24/7 Assistance" },
                { icon: Sparkles, label: "Exclusive Item", sub: "Limited Availability" },
              ].map((item, i) => (
                <div key={i} className="glass p-5 rounded-3xl flex items-center gap-4 border border-white/5 bg-white/[0.02]">
                  <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm">{item.label}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <a
                href={product.affiliate}
                target="_blank"
                className="w-full bg-white text-black py-6 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-white/5"
              >
                <ShoppingCart size={22} />
                Acquire Now
              </a>
              <p className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest mt-4">
                Secure transaction via official merchant
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}