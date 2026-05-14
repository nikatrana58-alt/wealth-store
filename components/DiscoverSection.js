"use client";

import { products } from "@/data/products";

export default function DiscoverSection() {

  return (
    <section className="max-w-7xl mx-auto px-5 py-32">

      <div className="flex items-center justify-between mb-16">

        <div>

          <span className="bg-purple-500/20 text-purple-300 px-5 py-3 rounded-full">

            Curated Discoveries

          </span>

          <h2 className="text-5xl md:text-7xl font-black mt-8">

            Explore
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {" "}Luxury Picks
            </span>

          </h2>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-10">

        {products.slice(0, 2).map((product) => (

          <div
            key={product.slug}
            className="glass rounded-[40px] overflow-hidden group"
          >

            <div className="overflow-hidden">

              <img
                src={product.image}
                alt={product.title}
                className="w-full h-[500px] object-cover group-hover:scale-105 transition duration-700"
              />

            </div>

            <div className="p-8">

              <div className="flex items-center justify-between">

                <h3 className="text-4xl font-black">

                  {product.title}

                </h3>

                <span className="text-purple-400 font-black text-2xl">

                  {product.price}

                </span>

              </div>

              <p className="text-gray-400 text-lg mt-6 leading-relaxed">

                {product.description}

              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}