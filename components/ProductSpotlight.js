"use client";

import { products } from "@/data/products";

export default function ProductSpotlight() {

  const product = products[0];

  return (
    <section className="max-w-7xl mx-auto px-5 py-32">

      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* Left */}

        <div>

          <span className="bg-purple-500/20 text-purple-300 px-5 py-3 rounded-full">

            Featured Product

          </span>

          <h2 className="text-6xl md:text-7xl font-black leading-tight mt-8">

            {product.title}

          </h2>

          <p className="text-gray-300 text-xl leading-relaxed mt-8">

            {product.description}

          </p>

          <div className="flex items-center gap-5 mt-10">

            <button className="bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition">

              Buy Now

            </button>

            <button className="glass px-8 py-4 rounded-2xl font-semibold">

              Learn More

            </button>

          </div>

        </div>

        {/* Right */}

        <div className="relative">

          <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>

          <img
            src={product.image}
            alt={product.title}
            className="relative z-10 rounded-[40px] w-full h-[650px] object-cover hover:scale-[1.02] transition duration-700"
          />

        </div>

      </div>

    </section>
  );
}