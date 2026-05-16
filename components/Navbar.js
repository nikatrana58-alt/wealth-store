"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Heart,
  Search,
  ShoppingBag,
  Sparkles,
  Shield,
  LogOut
} from "lucide-react";
import AuthModal from "./AuthModal";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const SUPER_ADMIN_EMAIL = "nikatrana58@gmail.com";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [openAuth, setOpenAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  return (
    <>
      <AuthModal
        isOpen={openAuth}
        onClose={() => setOpenAuth(false)}
      />
      <header className="sticky top-0 z-50 px-5 pt-5">
        <div className="glass max-w-7xl mx-auto rounded-3xl px-8 py-5 flex items-center justify-between border border-white/10">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-4 cursor-pointer group">
              <div className="bg-white text-black p-3 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-xl">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h1 className="font-black text-2xl tracking-tighter">
                  WEALTH<span className="text-purple-500">STORE</span>
                </h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                  The Elite Collection
                </p>
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {["Home", "Collections", "Trending", "About"].map((item) => (
              <Link 
                key={item} 
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {isSuperAdmin && (
                  <Link href="/admin">
                    <button className="glass px-5 py-3 rounded-2xl flex items-center gap-2 text-purple-400 font-bold hover:bg-purple-500/10 transition">
                      <Shield size={18} />
                      Admin
                    </button>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="glass w-12 h-12 rounded-2xl flex items-center justify-center text-red-400 hover:bg-red-500/10 transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpenAuth(true)}
                className="glass px-6 py-3 rounded-2xl flex items-center gap-2 font-bold hover:bg-white/5 transition"
              >
                <User size={18} />
                Login
              </button>
            )}

            <Link href="/wishlist">
              <button className="glass w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-white/5 transition relative">
                <Heart size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full text-[10px] flex items-center justify-center font-bold">
                  0
                </span>
              </button>
            </Link>

            <button className="bg-white text-black px-8 py-3 rounded-2xl font-black hover:scale-105 active:scale-95 transition shadow-xl">
              Explore
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
