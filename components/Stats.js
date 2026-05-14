"use client";

import { motion } from "framer-motion";

const stats = [
  {
    number: "50K+",
    label: "Monthly Visitors"
  },
  {
    number: "10K+",
    label: "Products Viewed"
  },
  {
    number: "500+",
    label: "Viral Products"
  },
  {
    number: "99%",
    label: "Happy Users"
  }
];

export default function Stats() {

  return (
    <section className="max-w-7xl mx-auto px-5 py-20">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {stats.map((stat, index) => (

          <motion.div
            key={index}
            whileHover={{
              y: -10
            }}
            className="glass rounded-[32px] p-8 text-center"
          >

            <h3 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">

              {stat.number}

            </h3>

            <p className="text-gray-400 mt-3">
              {stat.label}
            </p>

          </motion.div>

        ))}

      </div>

    </section>
  );
}