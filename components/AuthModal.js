"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { writeStoredJson } from "@/lib/client-storage";

import {
  X
} from "lucide-react";

export default function AuthModal({
  isOpen,
  onClose
}) {

  const [name, setName] =
    useState("");

  if (!isOpen) return null;

  const login = () => {

    const user = {
      name
    };

    writeStoredJson("user", user);

    onClose();

  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-5">

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        className="glass rounded-[40px] p-10 max-w-lg w-full relative"
      >

        {/* Close */}

        <button
          onClick={onClose}
          className="absolute top-5 right-5 glass w-12 h-12 rounded-full flex items-center justify-center"
        >

          <X size={20} />

        </button>

        <h2 className="text-5xl font-black">

          Welcome Back

        </h2>

        <p className="text-gray-400 mt-4">

          Sign in to continue your luxury shopping experience.

        </p>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          className="w-full glass rounded-2xl px-5 py-4 mt-10 outline-none"
        />

        <button
          onClick={login}
          className="mt-8 w-full bg-gradient-to-r from-purple-600 to-pink-500 py-4 rounded-2xl font-black hover:scale-[1.02] transition"
        >

          Continue

        </button>

      </motion.div>

    </div>
  );
}
