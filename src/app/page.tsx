"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Notebook } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      title: "Track Expenses",
      description: "Easily log and manage your daily transactions with a few clicks.",
    },
    {
      title: "Visualize Spending",
      description: "Interactive charts to help you understand where your money goes.",
    },
    {
      title: "Stay Organized",
      description: "Categorize your expenses and stay on top of your financial goals.",
    },
  ];

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 relative overflow-hidden
    bg-gradient-to-br from-black via-[#0e0e0e] to-black">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold text-center mb-12"
      >
        Manage Your Finances Effortlessly
      </motion.h1>

      {/* Features Floating Cards */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            className="bg-[#1c1c1c] border border-white/10 backdrop-blur-md rounded-2xl p-6 w-[280px] h-[220px] flex flex-col items-center justify-center text-center shadow-lg hover:shadow-purple-500/20 transition-all"
          >
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">{feature.title}</h2>
            <p className="text-white/70 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Get Started Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex gap-4"
      >
        <Button
          onClick={() => router.push("/signup")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-md"
        >
          Get Started
        </Button>
        <Button
          onClick={() => router.push("/signup")}
          className="border border-purple-600 hover:bg-purple-600 text-white px-8 py-4 text-lg rounded-md"
        >
          Sign in
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-wrap mt-3 gap-2 flex flex-wrap"
      >
      <Notebook/>{" "}
      <p>(Middleware is not implemented so you can navigate through pages , but signin signup is required)</p>
      </motion.div>
    </div>
  );
}
