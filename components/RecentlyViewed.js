"use client";

import { useStoredJson } from "@/lib/client-storage";

export default function RecentlyViewed() {
  const products = useStoredJson(
    "recentlyViewed",
    []
  );

  if (products.length === 0)
    return null;

  return (
    <section className="max-w-7xl mx-auto px-5 py-24">

      <div className="flex items-center justify-between mb-12">

        <div>

          <span className="bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full">

            Personalized

          </span>

          <h2 className="text-5xl font-black mt-6">

            Recently
            <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {" "}Viewed
            </span>

          </h2>

        </div>

      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {products.map((product) => (

          <div
            key={product.slug}
            className="glass rounded-4xl overflow-hidden"
          >

            <img
              src={product.image}
              alt={product.title}
              className="w-full h-72 object-cover"
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
