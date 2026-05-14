"use client";

import {
  Sparkles
} from "lucide-react";

export default function FloatingActionButton() {

  return (
    <button className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-600 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/30 hover:scale-110 transition">

      <Sparkles size={26} />

    </button>
  );
}