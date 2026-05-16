"use client";

export default function FloatingSidebar({
  activeCategory,
  categories = [
    "All",
    "Luxury",
    "Smart Home",
    "Office",
    "Fitness",
    "Gadgets",
    "Gaming",
  ],
  setActiveCategory,
}) {

  return (
    <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-50">

      <div className="glass rounded-4xl p-4 flex flex-col gap-4">

        {categories.map((category) => (

          <button
            key={category}
            onClick={() =>
              setActiveCategory(category)
            }
            className={`px-5 py-3 rounded-2xl transition font-semibold ${
              activeCategory === category
                ? "bg-linear-to-r from-purple-600 to-pink-500"
                : "hover:bg-white/5"
            }`}
          >

            {category}

          </button>

        ))}

      </div>

    </div>
  );
}
