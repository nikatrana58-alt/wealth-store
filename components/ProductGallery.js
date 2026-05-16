"use client";

import { useState } from "react";

export default function ProductGallery({
  product,
}) {

  const [activeImage, setActiveImage] =
    useState(
      product.gallery?.[0] ||
      product.image
    );

  return (

    <div>

      <div className="overflow-hidden rounded-5xl border border-white/10">

        <img
          src={activeImage}
          alt={product.title}
          className="w-full h-175 object-cover hover:scale-105 transition duration-700"
        />

      </div>

      <div className="flex gap-5 mt-6">

        {(product.gallery || [product.image])
          .map((img, index) => (

            <button
              key={index}
              onClick={() =>
                setActiveImage(img)
              }
              className={`overflow-hidden rounded-3xl border-2 transition ${
                activeImage === img
                  ? "border-purple-500"
                  : "border-transparent"
              }`}
            >

              <img
                src={img}
                alt=""
                className="w-28 h-28 object-cover"
              />

            </button>

        ))}

      </div>

    </div>

  );

}