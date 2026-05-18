"use client";

import { useDeferredValue, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Clock3,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trophy,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Footer from "@/components/Footer";
import MasonryGrid from "@/components/MasonryGrid";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { ProductsProvider, useProducts } from "@/components/ProductsProvider";
import Reveal from "@/components/Reveal";
import ScrollProgress from "@/components/ScrollProgress";

const SORT_OPTIONS = [
  { id: "score", label: "Editorial score" },
  { id: "newest", label: "Newest arrivals" },
  { id: "rating", label: "Highest rated" },
];

const SIGNALS = [
  {
    icon: Trophy,
    label: "Curation standard",
    value: "Top shelf",
  },
  {
    icon: Clock3,
    label: "Catalog cadence",
    value: "Live",
  },
];

function getProductTime(product) {
  return product.createdAt?.seconds ?? product.createdAt?.toMillis?.() ?? 0;
}

function sortProducts(products, sortMode) {
  return [...products].sort((a, b) => {
    if (sortMode === "newest") {
      return getProductTime(b) - getProductTime(a);
    }

    if (sortMode === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }

    return (b.score || 0) - (a.score || 0);
  });
}

function HomeContent() {
  const { products, loading, error } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState("score");
  const deferredSearch = useDeferredValue(search);

  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((product) => product.category).filter(Boolean)),
    ),
  ];

  const filteredProducts = sortProducts(
    products.filter((product) => {
      const haystack = [
        product.title,
        product.category,
        product.badge,
        product.description,
        product.aiTag,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = haystack.includes(deferredSearch.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;

      return matchesSearch && matchesCategory;
    }),
    sortMode,
  );

  const spotlightProduct =
    filteredProducts[0] ||
    products[0] ||
    null;
  const averageScore = products.length
    ? Math.round(
        products.reduce((sum, product) => sum + (product.score || 0), 0) /
          products.length,
      )
    : 0;

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090b] text-white selection:bg-white selection:text-black">
      <ScrollProgress />
      <Navbar />

      <section className="relative px-5 pb-16 pt-28 md:pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.20),transparent_32%),linear-gradient(135deg,#08090b_0%,#111318_55%,#0b0b0c_100%)]" />
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-xs font-black uppercase text-amber-200">
              <Sparkles size={14} />
              Premium affiliate intelligence
            </div>
            <h1 className="max-w-4xl text-7xl font-black leading-[0.95] md:text-8xl">
              Wealth Store
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/62 md:text-xl">
              A sharper catalog for high-intent product discovery, with cloud-hosted product media, ranked inventory, and a cleaner buying path.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {SIGNALS.map((signal) => (
                <div
                  key={signal.label}
                  className="border border-white/10 bg-black/25 p-4"
                >
                  <signal.icon size={18} className="mb-4 text-amber-300" />
                  <p className="text-xs uppercase text-white/40">{signal.label}</p>
                  <p className="mt-1 text-lg font-black">{signal.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/40"
          >
            {spotlightProduct ? (
              <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
                <div className="aspect-[4/5] overflow-hidden bg-white/5">
                  <img
                    src={spotlightProduct.image}
                    alt={spotlightProduct.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between p-2">
                  <div>
                    <div className="mb-5 flex flex-wrap gap-2">
                      <span className="border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-black uppercase text-amber-200">
                        {spotlightProduct.category || "Featured"}
                      </span>
                      <span className="border border-white/10 bg-white/5 px-3 py-1 text-xs font-black uppercase text-white/70">
                        {spotlightProduct.aiTag || "Premium Pick"}
                      </span>
                    </div>
                    <h2 className="text-5xl font-black leading-tight">
                      {spotlightProduct.title}
                    </h2>
                    <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/58">
                      {spotlightProduct.description}
                    </p>
                  </div>
                  <a
                    href={`/product/${spotlightProduct.slug}`}
                    className="mt-8 inline-flex items-center justify-between bg-white px-5 py-4 text-sm font-black text-black"
                  >
                    Inspect Product
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex min-h-96 items-center justify-center text-white/45">
                Add products from the admin console to activate the showcase.
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/35 px-5 py-6">
        <div className="mx-auto grid max-w-[1440px] gap-4 md:grid-cols-4">
          {[
            ["Products", products.length],
            ["Visible now", filteredProducts.length],
            ["Avg. score", averageScore ? `${averageScore}%` : "0%"],
            ["Categories", Math.max(categories.length - 1, 0)],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-5 py-4">
              <span className="text-xs font-bold uppercase text-white/40">{label}</span>
              <span className="text-2xl font-black">{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16">
        <Reveal>
          <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-amber-200">
                <BarChart3 size={15} />
                Curated marketplace
              </div>
              <h2 className="text-5xl font-black md:text-6xl">Product Command Center</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(260px,1fr)_auto]">
              <label className="flex items-center gap-3 border border-white/10 bg-white/[0.04] px-4 py-3">
                <Search size={18} className="text-white/45" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products, tags, categories"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                />
              </label>

              <div className="flex items-center gap-2 border border-white/10 bg-white/[0.04] px-3 py-2">
                <SlidersHorizontal size={17} className="text-white/45" />
                <select
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value)}
                  className="bg-transparent text-sm font-bold outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id} className="bg-black">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mb-10 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 border px-5 py-3 text-sm font-black transition ${
                activeCategory === category
                  ? "border-white bg-white text-black"
                  : "border-white/10 bg-white/[0.03] text-white/55 hover:border-white/30 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {error ? (
          <div className="border border-red-400/30 bg-red-500/10 p-8 text-center text-red-100">
            <h3 className="text-2xl font-black">Could not load products</h3>
            <p className="mt-2 text-red-100/70">{error}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="skeleton h-[430px] border border-white/10 bg-white/[0.04]" />
                ))}
              </motion.div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-white/10 bg-white/[0.03] px-8 py-28 text-center"
              >
                <Filter className="mx-auto mb-6 text-white/30" size={38} />
                <h3 className="text-3xl font-black text-white/55">No matches found</h3>
                <p className="mt-3 text-white/35">
                  Adjust the search, sort mode, or category filter.
                </p>
              </motion.div>
            ) : (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MasonryGrid>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id || product.slug}
                      product={product}
                    />
                  ))}
                </MasonryGrid>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>

      <section className="border-t border-white/10 bg-[#10100f] px-5 py-16">
        <div className="mx-auto grid max-w-[1440px] gap-5 md:grid-cols-3">
          {[
            ["Cloud-first media", "Every uploaded product image is stored in Cloudinary with secure URLs and optimization metadata."],
            ["Sharper discovery", "Search, category segmentation, and ranking controls reduce visual clutter while making inventory easier to scan."],
            ["Buyer confidence", "The catalog now emphasizes product quality signals, verified imagery, and a faster route to each product page."],
          ].map(([title, description]) => (
            <div key={title} className="border border-white/10 bg-white/[0.03] p-6">
              <BadgeCheck className="mb-5 text-amber-300" size={22} />
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-white/50">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <>
      <ProductsProvider>
        <HomeContent />
      </ProductsProvider>
      <Footer />
    </>
  );
}
