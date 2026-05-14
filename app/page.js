"use client";

import { useState } from "react";

import FloatingSearch from "@/components/FloatingSearch";
import CommandPalette from "@/components/CommandPalette";
import Footer from "@/components/Footer";
import DiscoverFeed from "@/components/DiscoverFeed";
import SmartFilters from "@/components/SmartFilters";
import BrandMarquee from "@/components/BrandMarquee";
import Collections from "@/components/Collections";
import DiscoverSection from "@/components/DiscoverSection";
import ScrollProgress from "@/components/ScrollProgress";
import RecentlyViewed from "@/components/RecentlyViewed";
import ProductStory from "@/components/ProductStory";
import FloatingActionButton from "@/components/FloatingActionButton";
import ProductSpotlight from "@/components/ProductSpotlight";
import FloatingParticles from "@/components/FloatingParticles";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import AIRecommendations from "@/components/AIRecommendations";
import FloatingSidebar from "@/components/FloatingSidebar";
import TrendingSlider from "@/components/TrendingSlider";
import QuickView from "@/components/QuickView";
import MobileDock from "@/components/MobileDock";
import GridBackground from "@/components/GridBackground";
import Marquee from "@/components/Marquee";
import Stats from "@/components/Stats";
import CursorGlow from "@/components/CursorGlow";

import { motion } from "framer-motion";

import MasonryGrid from "@/components/MasonryGrid";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";

import { products } from "@/data/products";

const categories = [
  "All",
  "Tech",
  "Setup",
  "Gaming",
];

export default function Home() {

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const filteredProducts = products

    .filter((product) => {

      const matchesSearch =

        product.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        product.category
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        product.aiTag
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =

        activeCategory === "All" ||

        product.category ===
          activeCategory;

      return (
        matchesSearch &&
        matchesCategory
      );

    })

    .sort(
      (a, b) => b.score - a.score
    );

  return (

    <>

      <main className="min-h-screen bg-[#0f172a] text-white overflow-hidden">

        <ScrollProgress />

        <CommandPalette />

        <MobileDock />

        <FloatingActionButton />

        <FloatingSearch />

        <GridBackground />

        <FloatingParticles />

        <CursorGlow />

        <FloatingSidebar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <Navbar />

        <Hero />

        <Reveal>
          <SmartFilters />
        </Reveal>

        <Reveal>
          <ProductSpotlight />
        </Reveal>

        <Reveal>
          <Stats />
        </Reveal>

        <Reveal>
          <Marquee />
        </Reveal>

        <Reveal>
          <TrendingSlider />
        </Reveal>

        <Reveal>
          <AIRecommendations />
        </Reveal>

        <Reveal>
          <RecentlyViewed />
        </Reveal>

        <Reveal>
          <DiscoverSection />
        </Reveal>

        <Reveal>
          <Collections />
        </Reveal>

        <Reveal>
          <BrandMarquee />
        </Reveal>

        <Reveal>
          <DiscoverFeed />
        </Reveal>

        <Reveal>
          <CTASection />
        </Reveal>

        <Reveal>
          <ProductStory />
        </Reveal>

        <section className="max-w-7xl mx-auto px-5 py-24">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">

            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
              }}
            >

              <h2 className="text-3xl md:text-4xl font-bold">

                Trending

                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">

                  {" "}Products

                </span>

              </h2>

              <p className="text-gray-400 mt-2">

                Discover the most viral products on the internet.

              </p>

            </motion.div>

            <div className="flex flex-wrap gap-4 mt-8">

              {categories.map((category) => (

                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  className={`px-5 py-3 rounded-2xl font-semibold transition ${
                    activeCategory === category
                      ? "bg-purple-600"
                      : "bg-[#1e293b]"
                  }`}
                >

                  {category}

                </button>

              ))}

              <div className="relative">

                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="bg-[#111827] border border-white/10 rounded-2xl px-5 py-4 outline-none md:w-[350px]"
                />

                {search && (

                  <div className="absolute top-full left-0 mt-3 w-full glass rounded-2xl overflow-hidden z-50">

                    {filteredProducts
                      .slice(0, 5)
                      .map((product) => (

                        <div
                          key={product.slug}
                          className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer transition"
                        >

                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-14 h-14 rounded-xl object-cover"
                          />

                          <div>

                            <h4 className="font-semibold">

                              {product.title}

                            </h4>

                            <p className="text-sm text-gray-400">

                              {product.price}

                            </p>

                          </div>

                        </div>

                    ))}

                  </div>

                )}

              </div>

            </div>

          </div>

          {filteredProducts.length === 0 ? (

            <div className="text-center py-20 text-gray-400 text-xl">

              No products found.

            </div>

          ) : (

            <MasonryGrid>

              {filteredProducts.map((product) => (

                <ProductCard
                  key={product.slug}
                  product={product}
                />

              ))}

            </MasonryGrid>

          )}

        </section>

      </main>

      <Footer />

    </>

  );

}