"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {

  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });

  useEffect(() => {

    const moveCursor = (e) => {

      setPosition({
        x: e.clientX,
        y: e.clientY
      });

    };

    window.addEventListener(
      "mousemove",
      moveCursor
    );

    return () =>
      window.removeEventListener(
        "mousemove",
        moveCursor
      );

  }, []);

  return (
    <div
      className="fixed pointer-events-none z-[9999] w-[400px] h-[400px] rounded-full bg-purple-500/20 blur-3xl transition-all duration-300"
      style={{
        left: position.x - 200,
        top: position.y - 200
      }}
    />
  );
}