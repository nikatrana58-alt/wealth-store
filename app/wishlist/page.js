"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

export default function WishlistPage() {

  const [wishlist, setWishlist] =
    useState([]);

  useEffect(() => {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "wishlist"
        ) || "[]"
      );

    setWishlist(saved);

  }, []);

  return (

    <main className="min-h-screen bg-[#020617] text-white px-6 py-20">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-6xl font-black mb-16">

          Your Wishlist ❤️

        </h1>

        {wishlist.length === 0 ? (

          <div className="text-gray-400 text-2xl">

            No saved products yet.

          </div>

        ) : (

          <div className="grid md:grid-cols-3 gap-10">

            {wishlist.map((product) => (

              <Link
                key={product.slug}
                href={`/product/${product.slug}`}
                className="glass rounded-[32px] overflow-hidden group"
              >

                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-[320px] object-cover group-hover:scale-105 transition duration-700"
                />

                <div className="p-6">

                  <h2 className="text-2xl font-bold">

                    {product.title}

                  </h2>

                  <p className="text-gray-400 mt-3">

                    {product.price}

                  </p>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </main>

  );

}