"use client";

import {
  useEffect,
  useState
} from "react";

export default function ScrollProgress() {

  const [width, setWidth] =
    useState(0);

  useEffect(() => {

    const handleScroll = () => {

      const scrollTop =
        window.scrollY;

      const height =
        document.body.scrollHeight -
        window.innerHeight;

      setWidth(
        (scrollTop / height) * 100
      );

    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[4px] z-[99999] bg-white/5">

      <div
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
        style={{
          width: `${width}%`
        }}
      />

    </div>
  );
}