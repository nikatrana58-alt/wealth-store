"use client";

import { products } from "@/data/products";

export default function TrendingSlider() {

  return (
    <section className="py-20 overflow-hidden">

      <div className="flex gap-6 overflow-x-auto scrollbar-hide px-5">

        {products.map((product) => (

          <div
            key={product.slug}
            className="min-w-[320px] glass rounded-[32px] overflow-hidden"
          >

            <img
              src={product.image}
              alt={product.title}
              className="w-full h-56 object-cover"
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

              <p className="text-gray-400 mt-3">

                {product.description}

              </p>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}