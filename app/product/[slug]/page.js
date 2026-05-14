import { products } from "@/data/products";

import Link from "next/link";

export default function ProductPage({
  params,
}) {

  const product =
    products.find(
      (p) =>
        p.slug === params.slug
    );

  if (!product) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center text-4xl">

        Product Not Found

      </div>

    );

  }

  return (

    <main className="min-h-screen bg-[#020617] text-white px-6 py-20">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

        <div>

          <img
            src={product.image}
            alt={product.title}
            className="w-full rounded-[32px] object-cover"
          />

        </div>

        <div>

          <Link
            href="/"
            className="text-purple-400"
          >
            ← Back
          </Link>

          <div className="mt-6">

            <div className="inline-block rounded-full bg-purple-500/20 px-4 py-2 text-sm">

              {product.badge}

            </div>

            <h1 className="mt-6 text-6xl font-black">

              {product.title}

            </h1>

            <p className="mt-6 text-gray-400 text-xl">

              {product.description}

            </p>

            <div className="mt-8 flex items-center gap-6">

              <span className="text-5xl font-black">

                {product.price}

              </span>

              <span className="text-yellow-400 text-xl">

                ⭐ {product.rating}

              </span>

            </div>

            <a
              href={product.affiliate}
              target="_blank"
              className="mt-10 inline-block rounded-3xl bg-gradient-to-r from-purple-600 to-pink-500 px-10 py-5 text-xl font-bold"
            >

              Buy On Amazon

            </a>

          </div>

        </div>

      </div>

    </main>

  );

}