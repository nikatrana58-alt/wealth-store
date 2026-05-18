"use client";

export default function Footer() {

  return (
    <footer className="border-t border-white/10 py-20 mt-32">
      <div className="max-w-[1440px] mx-auto px-5">

        <div className="grid md:grid-cols-4 gap-10">

          <div>

            <h3 className="text-3xl font-black">

              WealthStore

            </h3>

            <p className="text-gray-400 mt-5 leading-relaxed">

              Discover premium internet finds curated for modern lifestyles.

            </p>

          </div>

          <div>

            <h4 className="font-bold text-xl mb-5">

              Explore

            </h4>

            <div className="space-y-3 text-gray-400">

              <p>Trending</p>
              <p>Luxury</p>
              <p>Gaming</p>

            </div>

          </div>

          <div>

            <h4 className="font-bold text-xl mb-5">

              Company

            </h4>

            <div className="space-y-3 text-gray-400">

              <p>About</p>
              <p>Contact</p>
              <p>Privacy</p>

            </div>

          </div>

          <div>

            <h4 className="font-bold text-xl mb-5">

              Newsletter

            </h4>

            <input
              type="text"
              placeholder="Enter email"
              className="w-full glass rounded-2xl px-5 py-4 outline-none"
            />

            <button className="mt-5 w-full bg-linear-to-r from-purple-600 to-pink-500 py-4 rounded-2xl font-bold">

              Subscribe

            </button>

          </div>

        </div>

      </div>

    </footer>
  );
}