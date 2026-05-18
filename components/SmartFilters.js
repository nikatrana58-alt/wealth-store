"use client";

const filters = [
  "🔥 Viral",
  "🎮 Gaming",
  "✨ Luxury",
  "💻 Tech",
  "🪑 Setup",
  "📈 Trending"
];

export default function SmartFilters() {

  return (
    <section className="max-w-[1440px] mx-auto px-5 py-10 overflow-x-auto">

      <div className="flex gap-4 min-w-max">

        {filters.map((filter) => (

          <button
            key={filter}
            className="glass px-6 py-3 rounded-full hover:scale-105 transition whitespace-nowrap"
          >

            {filter}

          </button>

        ))}

      </div>

    </section>
  );
}