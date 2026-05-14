"use client";

export default function Marquee() {

  return (
    <div className="overflow-hidden py-10 border-y border-white/10">

      <div className="flex gap-16 whitespace-nowrap animate-marquee text-4xl font-black text-white/10">

        <span>VIRAL PRODUCTS</span>

        <span>AMAZON FINDS</span>

        <span>TECH GADGETS</span>

        <span>MODERN LIFESTYLE</span>

        <span>GAMING SETUPS</span>

        <span>AI SHOPPING</span>

      </div>

    </div>
  );
}