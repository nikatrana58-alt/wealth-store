"use client";

const collections = [

  {
    title: "Gaming Essentials",

    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420"
  },

  {
    title: "Modern Workspace",

    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"
  },

  {
    title: "Luxury Lifestyle",

    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  }

];

export default function Collections() {

  return (
    <section className="max-w-7xl mx-auto px-5 py-32">

      <div className="mb-16">

        <span className="bg-purple-500/20 text-purple-300 px-5 py-3 rounded-full">

          Featured Collections

        </span>

        <h2 className="text-5xl md:text-7xl font-black mt-8">

          Explore By
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            {" "}Collections
          </span>

        </h2>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {collections.map((collection) => (

          <div
            key={collection.title}
            className="relative overflow-hidden rounded-[40px] h-[500px] group"
          >

            <img
              src={collection.image}
              alt={collection.title}
              className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute bottom-0 left-0 p-8">

              <h3 className="text-4xl font-black">

                {collection.title}

              </h3>

              <button className="mt-5 glass px-6 py-3 rounded-2xl hover:scale-105 transition">

                Explore Collection

              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}