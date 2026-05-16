"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  X,
  Mail,
  Lock,
  Globe
} from "lucide-react";

export default function AuthModal({
  isOpen,
  onClose
}) {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isSignUp, setIsSignUp] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      if (isSignUp) {

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      } else {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      }

      onClose();

    } catch (err) {

      setError(err.message);

    }

  };

  const handleGoogleLogin = async () => {

    const provider =
      new GoogleAuthProvider();

    try {

      await signInWithPopup(
        auth,
        provider
      );

      onClose();

    } catch (err) {

      setError(err.message);

    }

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
        className="glass rounded-5xl p-10 max-w-lg w-full relative"
      >

        {/* Close */}

        <button
          onClick={onClose}
          className="absolute top-5 right-5 glass w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition cursor-pointer"
        >

          <X size={20} />

        </button>

        <h2 className="text-5xl font-black mb-2">

          {isSignUp ? "Join Us" : "Welcome Back"}

        </h2>

        <p className="text-gray-400">

          {isSignUp
            ? "Start your journey in the world of luxury."
            : "Sign in to continue your luxury shopping experience."}

        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-4"
        >

          <div className="relative">

            <Mail
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full glass rounded-2xl pl-14 pr-5 py-5 outline-none focus:border-purple-500 transition"
              required
            />

          </div>

          <div className="relative">

            <Lock
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full glass rounded-2xl pl-14 pr-5 py-5 outline-none focus:border-purple-500 transition"
              required
            />

          </div>

          {error && (

            <p className="text-red-400 text-sm ml-2">

              {error}

            </p>

          )}

          <button
            type="submit"
            className="w-full bg-linear-to-r from-purple-600 to-pink-500 py-5 rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition shadow-lg shadow-purple-500/20"
          >

            {isSignUp ? "Create Account" : "Sign In"}

          </button>

        </form>

        <div className="relative my-8">

          <div className="absolute inset-0 flex items-center">

            <div className="w-full border-t border-white/10"></div>

          </div>

          <div className="relative flex justify-center text-xs uppercase">

            <span className="bg-[#020617] px-4 text-gray-500 font-bold">

              Or continue with

            </span>

          </div>

        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full glass py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-white/5 transition"
        >

          <Globe size={20} />

          Google Account

        </button>


        <p className="text-center mt-8 text-gray-400">

          {isSignUp
            ? "Already have an account?"
            : "Don't have an account?"}{" "}

          <button
            onClick={() =>
              setIsSignUp(!isSignUp)
            }
            className="text-purple-400 font-bold hover:underline"
          >

            {isSignUp ? "Sign In" : "Sign Up"}

          </button>

        </p>

      </motion.div>

    </div>
  );
}
