"use client";

import { Children } from "react";

export default function MasonryGrid({
  children
}) {
  return (
    <div className="columns-1 gap-6 md:columns-2 xl:columns-3 2xl:columns-4">
      {Children.map(children, (child, index) => (
        <div
          key={index}
          className="mb-6 break-inside-avoid"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
