"use client";

import { useState, useEffect } from "react";

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
import MobileDock from "@/components/MobileDock";
import GridBackground from "@/components/GridBackground";
import Marquee from "@/components/Marquee";
import Stats from "@/components/Stats";
import CursorGlow from "@/components/CursorGlow";

import { motion, AnimatePresence } from "framer-motion";

import MasonryGrid from "@/components/MasonryGrid";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";

import { getProducts } from "@/lib/getProducts";

const categories = [
  "All",
  "Tech",
  "Setup",
  "Gaming",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const p = await getProducts();
        setProducts(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase()) ||
        product.aiTag?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <>
      <main className="min-h-screen bg-[#020617] text-white overflow-hidden selection:bg-purple-500 selection:text-white">
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

        <section className="max-w-7xl mx-auto px-5 py-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            >
              <h2 className="text-5xl md:text-7xl font-black leading-tight">
                Curated
                <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent italic">
                  {" "}Excellence
                </span>
              </h2>
              <p className="text-gray-400 mt-4 text-xl max-w-lg">
                Hand-picked luxury items that redefine modern aesthetics.
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-8 py-4 rounded-2xl font-black transition-all duration-500 ${
                    activeCategory === category
                      ? "bg-white text-black scale-105"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="glass h-[400px] rounded-5xl skeleton" />
                ))}
              </motion.div>
            ) : filteredProducts.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-40 glass rounded-[60px]"
              >
                <h3 className="text-3xl font-black text-gray-500">No Treasures Found</h3>
                <p className="text-gray-600 mt-2">Try adjusting your filters for more luxury.</p>
              </motion.div>
            ) : (
              <motion.div key="grid">
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
        </section>
      </main>
      <Footer />
    </>
  );
}