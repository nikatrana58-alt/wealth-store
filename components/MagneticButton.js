"use client";

import { useRef } from "react";

export default function MagneticButton({
  children
}) {

  const ref = useRef(null);

  const handleMouseMove = (e) => {

    if (!ref.current) return;

    const button = ref.current;

    const rect =
      button.getBoundingClientRect();

    const x =
      e.clientX -
      rect.left -
      rect.width / 2;

    const y =
      e.clientY -
      rect.top -
      rect.height / 2;

    button.style.transform =
      `translate(${x * 0.2}px, ${y * 0.2}px)`;

  };

  const reset = () => {

    if (!ref.current) return;

    ref.current.style.transform =
      "translate(0px, 0px)";

  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className="transition duration-200"
    >
      {children}
    </button>
  );
}