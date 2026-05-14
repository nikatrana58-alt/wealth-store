"use client";

const brands = [
  "APPLE",
  "SONY",
  "ASUS",
  "NIKE",
  "SAMSUNG",
  "RAZER",
  "LOGITECH",
  "BOSE"
];

export default function BrandMarquee() {

  return (
    <section className="py-20 overflow-hidden border-y border-white/10">

      <div className="flex gap-20 whitespace-nowrap animate-marquee text-5xl font-black text-white/10">

        {brands.map((brand, index) => (

          <span key={index}>

            {brand}

          </span>

        ))}

      </div>

    </section>
  );
}