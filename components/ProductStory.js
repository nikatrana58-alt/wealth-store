"use client";

export default function ProductStory() {

  return (
    <section className="max-w-7xl mx-auto px-5 py-32">

      <div className="glass rounded-[48px] overflow-hidden grid lg:grid-cols-2">

        {/* Left */}

        <div className="p-10 md:p-16 flex flex-col justify-center">

          <span className="bg-purple-500/20 text-purple-300 px-5 py-3 rounded-full w-fit">

            Modern Lifestyle

          </span>

          <h2 className="text-5xl md:text-7xl font-black leading-tight mt-8">

            Products That
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {" "}Inspire
            </span>

          </h2>

          <p className="text-gray-300 text-xl leading-relaxed mt-8">

            Every product is carefully selected to improve your setup, lifestyle, productivity, and aesthetic experience.

          </p>

        </div>

        {/* Right */}

        <img
          src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
          alt="Story"
          className="w-full h-full object-cover"
        />

      </div>

    </section>
  );
}