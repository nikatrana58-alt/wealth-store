"use client";

import { products } from "@/data/products";

export default function AIRecommendations() {

  return (
    <section className="max-w-7xl mx-auto px-5 py-24">

      <div className="flex items-center justify-between mb-12">

        <div>

          <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full">

            AI Powered

          </span>

          <h2 className="text-5xl font-black mt-6">

            Recommended
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {" "}For You
            </span>

          </h2>

        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {products.slice(0, 3).map((product) => (

          <div
            key={product.slug}
            className="glass rounded-[32px] overflow-hidden group"
          >

            <div className="overflow-hidden">

              <img
                src={product.image}
                alt={product.title}
                className="w-full h-80 object-cover group-hover:scale-110 transition duration-700"
              />

            </div>

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

              <button className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-500 py-4 rounded-2xl font-bold hover:scale-[1.02] transition">

                Explore Product

              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}