"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowUpRight,
  Star,
} from "lucide-react";

export default function ProductCard({
  product,
}) {

  return (

    <Link
      href={`/product/${product.slug}`}
    >

      <motion.div

        onMouseMove={(event) => {

          const rect =
            event.currentTarget.getBoundingClientRect();

          event.currentTarget.style.setProperty(
            "--x",
            `${event.clientX - rect.left}px`
          );

          event.currentTarget.style.setProperty(
            "--y",
            `${event.clientY - rect.top}px`
          );

        }}

        whileHover={{
          y: -12,
          rotateX: 4,
          rotateY: -4,
        }}

        transition={{
          duration: 0.4,
        }}

        className="group spotlight card-depth relative cursor-pointer"

        style={{
          transformStyle: "preserve-3d",
        }}

      >

        <div className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 blur-2xl transition duration-500 group-hover:opacity-30" />

        <div className="glass relative overflow-hidden rounded-[32px] border border-white/10">

          <div className="absolute top-5 left-5 z-20 space-y-3">

            <div className="rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm">

              Hot: {product.stock}

            </div>

            <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm">

              Views: {product.views}

            </div>

            <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm">

              AI: {product.aiTag}

            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2">

              <Star
                size={14}
                className="text-yellow-400"
              />

              <span className="text-sm font-medium">

                {product.badge}

              </span>

            </div>

          </div>

          <div className="absolute top-5 right-5 z-20">

            <div className="glass flex h-12 w-12 items-center justify-center rounded-full opacity-0 transition duration-300 group-hover:opacity-100">

              <ArrowUpRight size={18} />

            </div>

          </div>

          <div className="overflow-hidden">

            <img
              src={product.image}
              alt={product.title}
              className={`w-full object-cover transition duration-700 group-hover:scale-110 ${
                (product.id?.charCodeAt(0) || 0) % 2 === 0
                  ? "h-[420px]"
                  : "h-[320px]"
              }`}
            />

          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          <div className="absolute bottom-0 left-0 z-10 w-full p-6">

            <div className="glass rounded-3xl p-5">

              <div className="mb-4 flex items-center justify-between gap-4">

                <div className="mb-5 flex flex-1 items-center gap-3">

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">

                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{
                        width: `${product.score}%`,
                      }}
                    />

                  </div>

                  <span className="text-sm text-gray-300">

                    {product.score}%

                  </span>

                </div>

                <span className="text-3xl font-black">

                  {product.price}

                </span>

                <span className="glass rounded-full px-3 py-1 text-sm">

                  Rating: {product.rating}

                </span>

              </div>

              <h3 className="text-2xl font-bold">

                {product.title}

              </h3>

              <p className="mt-3 line-clamp-2 text-gray-300">

                {product.description}

              </p>

              <button className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 py-4 font-bold transition hover:scale-[1.02]">

                View Product

              </button>

            </div>

          </div>

        </div>

      </motion.div>

    </Link>

  );

}