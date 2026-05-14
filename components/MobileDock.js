"use client";

import {
  House,
  Search,
  Heart,
  User
} from "lucide-react";

export default function MobileDock() {

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden">

      <div className="glass px-6 py-4 rounded-full flex items-center gap-8">

        <House />

        <Search />

        <Heart />

        <User />

      </div>

    </div>
  );
}