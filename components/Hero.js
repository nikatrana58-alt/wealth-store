"use client";

import { motion } from "framer-motion";
import { useStoredJson } from "@/lib/client-storage";
import MagneticButton from "./MagneticButton";

export default function Hero() {
  const user = useStoredJson("user", null);

  return (
    <section className="relative overflow-hidden pt-16">
      <div className="purple-glow floating-gradient top-0 left-0" />
      <div className="pink-glow floating-gradient bottom-0 right-0" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="glass relative overflow-hidden rounded-5xl p-10 md:p-16"
        >
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <span className="rounded-full border border-purple-400/20 bg-purple-500/20 px-5 py-3 text-sm font-medium text-purple-300">
              Discover Viral Internet Products
            </span>

            {user && (
              <p className="mb-6 text-lg text-purple-300">
                Welcome back, {user.name}.
              </p>
            )}

            <h1 className="mt-8 text-5xl font-black leading-tight md:text-8xl">
              Future Of
              <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                {" "}Online{" "}
              </span>
              Shopping
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
              Explore hand-picked viral Amazon finds loved by creators,
              gamers, influencers, and modern lifestyles.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <MagneticButton>Explore Products</MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
