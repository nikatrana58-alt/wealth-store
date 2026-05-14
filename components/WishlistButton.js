"use client";

import {
  Heart
} from "lucide-react";
import {
  useStoredJson,
  writeStoredJson,
} from "@/lib/client-storage";

export default function WishlistButton({
  product
}) {
  const wishlist = useStoredJson(
    "wishlist",
    []
  );
  const saved = wishlist.some(
    (item) => item.slug === product.slug
  );

  const toggleWishlist = () => {
    if (saved) {

      const updated =
        wishlist.filter(
          (item) =>
            item.slug !== product.slug
        );

      writeStoredJson("wishlist", updated);

    } else {

      writeStoredJson(
        "wishlist",
        [...wishlist, product]
      );

    }

  };

  return (
    <button
      onClick={toggleWishlist}
      className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
        saved
          ? "bg-pink-500"
          : "glass"
      }`}
    >

      <Heart
        size={22}
        fill={saved ? "white" : "none"}
      />

    </button>
  );
}
