"use client";

import { products } from "@/data/products";

export default function DiscoverFeed() {

  return (
    <section className="max-w-7xl mx-auto px-5 py-32">

      <div className="mb-16">

        <span className="bg-purple-500/20 text-purple-300 px-5 py-3 rounded-full">

          Endless Discovery

        </span>

        <h2 className="text-5xl md:text-7xl font-black mt-8">

          Discover
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            {" "}More
          </span>

        </h2>

      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">

        {products.map((product) => (

          <div
            key={product.slug}
            className="glass rounded-[32px] overflow-hidden mb-8 break-inside-avoid group"
          >

            <img
              src={product.image}
              alt={product.title}
              className="w-full object-cover group-hover:scale-105 transition duration-700"
            />

            <div className="p-6">

              <div className="flex items-center justify-between">

                <h3 className="text-2xl font-bold">

                  {product.title}

                </h3>

                <span className="text-purple-400 font-bold">

                  {product.price}

                </span>

              </div>

              <p className="text-gray-400 mt-4">

                {product.description}

              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}