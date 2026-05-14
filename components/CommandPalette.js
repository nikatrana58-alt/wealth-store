"use client";

import {
  useEffect,
  useState
} from "react";

import { products } from "@/data/products";

import {
  Search,
  X
} from "lucide-react";

export default function CommandPalette() {

  const [open, setOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  useEffect(() => {

    const down = (e) => {

      if (
        (e.metaKey || e.ctrlKey) &&
        e.key === "k"
      ) {

        e.preventDefault();

        setOpen((open) => !open);

      }

    };

    window.addEventListener(
      "keydown",
      down
    );

    return () =>
      window.removeEventListener(
        "keydown",
        down
      );

  }, []);

  const filtered =
    products.filter((product) =>

      product.title
        .toLowerCase()
        .includes(
          query.toLowerCase()
        )
    );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-xl flex items-start justify-center pt-32 p-5">

      <div className="glass search-glow rounded-[40px] max-w-3xl w-full overflow-hidden">

        {/* Top */}

        <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5">

          <Search size={22} />

          <input
            autoFocus
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            className="bg-transparent outline-none w-full text-lg"
          />

          <button
            onClick={() =>
              setOpen(false)
            }
          >

            <X size={22} />

          </button>

        </div>

        {/* Results */}

        <div className="max-h-[500px] overflow-y-auto">

          {filtered.map((product) => (

            <div
              key={product.slug}
              className="flex items-center gap-5 p-5 hover:bg-white/5 transition cursor-pointer"
            >

              <img
                src={product.image}
                alt={product.title}
                className="w-20 h-20 rounded-2xl object-cover"
              />

              <div>

                <h3 className="text-2xl font-bold">

                  {product.title}

                </h3>

                <p className="text-gray-400 mt-2">

                  {product.price}

                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}