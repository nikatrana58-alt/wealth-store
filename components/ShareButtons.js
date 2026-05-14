"use client";

import {
  Share2
} from "lucide-react";

export default function ShareButtons({
  product
}) {

  const share = async () => {

    if (navigator.share) {

      await navigator.share({

        title: product.title,

        text: product.description,

        url: window.location.href

      });

    }

  };

  return (
    <button
      onClick={share}
      className="glass w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition"
    >

      <Share2 size={22} />

    </button>
  );
}