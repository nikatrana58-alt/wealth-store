"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Star, X } from "lucide-react";
import {
  readStoredJson,
  writeStoredJson,
} from "@/lib/client-storage";
import ShareButtons from "./ShareButtons";
import WishlistButton from "./WishlistButton";

export default function QuickView({
  product,
  onClose,
}) {
  useEffect(() => {
    if (!product) {
      return;
    }

    const viewed = readStoredJson(
      "recentlyViewed",
      []
    );
    const exists = viewed.some(
      (item) => item.slug === product.slug
    );

    if (!exists) {
      writeStoredJson(
        "recentlyViewed",
        [product, ...viewed].slice(0, 6)
      );
    }
  }, [product]);

  if (!product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-black/80 backdrop-blur-2xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex min-h-screen items-center justify-center p-5"
      >
        <div className="glass relative w-full max-w-7xl overflow-hidden rounded-[48px]">
          <button
            onClick={onClose}
            className="glass absolute top-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full hover:scale-110"
          >
            <X size={24} />
          </button>

          <div className="grid lg:grid-cols-2">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent" />

              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>

            <div className="flex flex-col justify-center p-10 md:p-16">
              <div className="mb-8 flex items-center gap-4">
                <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 font-bold">
                  {product.badge}
                </span>

                <span className="glass flex items-center gap-2 rounded-full px-5 py-2">
                  <Star
                    size={16}
                    className="text-yellow-400"
                  />
                  {product.rating}
                </span>
              </div>

              <h1 className="text-5xl font-black leading-tight md:text-7xl">
                {product.title}
              </h1>

              <p className="mt-8 text-xl leading-relaxed text-gray-300">
                {product.description}
              </p>

              <div className="mt-10 flex items-center gap-5">
                <span className="text-5xl font-black">
                  {product.price}
                </span>

                <span className="glass rounded-full px-5 py-2">
                  {product.category}
                </span>
              </div>

              <div className="mt-12 flex flex-wrap gap-5">
                <a
                  href={product.affiliate}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-10 py-5 font-black shadow-2xl shadow-purple-500/30 transition hover:scale-105"
                >
                  Buy Now
                </a>

                <div className="glass flex items-center gap-4 rounded-2xl px-6 py-5">
                  <WishlistButton product={product} />
                  <ShareButtons product={product} />
                  <span className="font-semibold">
                    Save Product
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
