"use client";

import {
  Search
} from "lucide-react";

export default function FloatingSearch() {

  return (
    <button className="fixed bottom-28 right-8 z-50 glass w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 transition">

      <Search size={24} />

    </button>
  );
}