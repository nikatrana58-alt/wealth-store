"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Heart,
  Search,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import AuthModal from "./AuthModal";
import {
  removeStoredValue,
  useStoredJson,
} from "@/lib/client-storage";

export default function Navbar() {
  const user = useStoredJson("user", null);
  const [openAuth, setOpenAuth] = useState(false);

  return (
    <>
      <AuthModal
        isOpen={openAuth}
        onClose={() =>
          setOpenAuth(false)
        }
      />
      <header className="sticky top-0 z-50 px-5 pt-5">

      <div className="glass max-w-7xl mx-auto rounded-3xl px-6 py-4 flex items-center justify-between">

        {/* Logo */}

        <Link href="/">

          <div className="flex items-center gap-4 cursor-pointer">

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-2xl shadow-lg shadow-purple-500/30">

              <ShoppingBag size={22} />

            </div>

            <div>

              <h1 className="font-black text-2xl">
                WealthStore
              </h1>

              <p className="text-sm text-gray-400">
                Viral Product Hub
              </p>

            </div>

          </div>

        </Link>

        {/* Search */}

        <div className="hidden md:flex items-center glass px-5 py-3 rounded-2xl w-[350px]">

          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none ml-3 w-full"
          />
          <div className="glass px-2 py-1 rounded-lg text-xs text-gray-400">

  CTRL K

</div>

        </div>

        {/* Buttons */}

        <div className="flex items-center gap-4">
<button
  onClick={() => {

    if (user) {

      removeStoredValue("user");

    } else {

      setOpenAuth(true);

    }

  }}
  className="glass px-5 py-3 rounded-2xl flex items-center gap-3 hover:scale-105 transition"
>

  <User size={18} />

  {user ? user.name : "Login"}

</button>
          <button className="hidden md:flex items-center gap-2 glass px-5 py-3 rounded-2xl font-medium hover:scale-105">

            <Sparkles size={18} />

            Trending

          </button>
<Link href="/wishlist">

  <button className="glass w-14 h-14 rounded-2xl flex items-center justify-center hover:scale-105">

    <Heart size={20} />

  </button>

</Link>
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 rounded-2xl font-bold hover:scale-105 shadow-lg shadow-purple-500/30">

            Explore

          </button>

        </div>

      </div>

    </header>
    </>
  );
}
