"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/getProducts";
import { Search, X, Command as CommandIcon, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const p = await getProducts();
      setProducts(p);
    };
    load();

    const down = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  const filtered = products.filter((product) =>
    product.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-32 p-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative glass-dark rounded-5xl max-w-2xl w-full overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-5 px-8 py-6 border-b border-white/5">
              <Search size={24} className="text-gray-500" />
              <input
                autoFocus
                type="text"
                placeholder="Search the vault..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-xl font-medium text-white placeholder:text-gray-600"
              />
              <div className="flex items-center gap-2">
                <div className="glass px-2 py-1 rounded-lg text-[10px] font-black text-gray-500 border border-white/10">ESC</div>
              </div>
            </div>

            <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
              {filtered.length > 0 ? (
                <div className="p-4 space-y-2">
                  {filtered.map((product) => (
                    <Link
                      href={`/product/${product.slug}`}
                      key={product.id || product.slug}
                      onClick={() => setOpen(false)}
                    >
                      <div className="flex items-center gap-5 p-4 rounded-3xl hover:bg-white/5 transition group cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-black group-hover:text-purple-400 transition-colors">{product.title}</h3>
                          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{product.category} • {product.price}</p>
                        </div>
                        <ArrowRight size={18} className="text-gray-700 group-hover:text-white transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <CommandIcon size={40} className="mx-auto text-gray-800 mb-4" />
                  <p className="text-gray-600 font-bold">No results for &quot;{query}&quot;</p>
                </div>
              )}
            </div>

            <div className="bg-black/40 px-8 py-4 flex items-center justify-between border-t border-white/5">
              <div className="flex items-center gap-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-white/5 flex items-center justify-center border border-white/10">↑</div>
                  <div className="w-4 h-4 rounded-sm bg-white/5 flex items-center justify-center border border-white/10">↓</div>
                  Navigate
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-4 rounded-sm bg-white/5 flex items-center justify-center border border-white/10">ENTER</div>
                  Select
                </div>
              </div>
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">Wealth Store Search</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}