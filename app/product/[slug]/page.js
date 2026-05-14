import { products } from "@/data/products";
import Link from "next/link";

export default function ProductPage({ params }) {

  const product = products.find(
    (item) => item.slug === params.slug
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-5xl">
        Product Not Found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white px-6 py-20">

      <Link
        href="/"
        className="text-purple-400 mb-10 inline-block"
      >
        ← Back
      </Link>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        <img
          src={product.image}
          alt={product.title}
          className="rounded-3xl w-full"
        />

        <div>

          <div className="mb-4 text-pink-400">
            {product.category}
          </div>

          <h1 className="text-5xl font-black mb-6">
            {product.title}
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            {product.description}
          </p>

          <div className="flex gap-4 mb-6">
            <div className="glass px-4 py-2 rounded-full">
              ⭐ {product.rating}
            </div>

            <div className="glass px-4 py-2 rounded-full">
              👁 {product.views}
            </div>
          </div>

          <div className="text-4xl font-black mb-8">
            {product.price}
          </div>

          <a
            href={product.affiliate}
            target="_blank"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-4 rounded-2xl font-bold text-lg"
          >
            Buy On Amazon
          </a>

        </div>
      </div>
    </main>
  );
}