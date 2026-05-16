"use client";

export default function CTASection() {

  return (
    <section className="max-w-7xl mx-auto px-5 py-32">
      <div className="relative overflow-hidden rounded-5xl glass p-12 md:p-20">


        {/* Glow */}

        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

        <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 text-center">

          <span className="bg-purple-500/20 text-purple-300 px-5 py-3 rounded-full">

            Discover The Future

          </span>

          <h2 className="text-5xl md:text-7xl font-black leading-tight mt-8">

            Upgrade Your
            <span className="bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {" "}Lifestyle
            </span>

          </h2>

          <p className="text-gray-300 text-xl max-w-2xl mx-auto mt-8">

            Explore premium internet finds curated for creators, gamers, and modern living.

          </p>

          <button className="mt-10 bg-linear-to-r from-purple-600 to-pink-500 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition">

            Explore Products

          </button>

        </div>

      </div>

    </section>
  );
}