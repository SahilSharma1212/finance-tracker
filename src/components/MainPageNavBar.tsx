// /app/main/layout.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // If you have a 'cn' utility for classNames merging
import { Toaster } from "react-hot-toast";

export default function MainAppLayout() {
  const pathname = usePathname();

  return (
    <div className="bg-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-center gap-8 p-6 border-b border-white/50 bg-[#ffffff08] max-sm:gap-3">
        <Link
          href="/transactions"
          className={cn(
            "text-lg font-semibold transition hover:text-purple-400",
            pathname === "/transactions" ? "text-purple-500 bg-purple-300/15 p-2 rounded-md" : "text-white/80"
          )}
        >
          Transactions
        </Link>
        <Link
          href="/dashboard"
          className={cn(
            "text-lg font-semibold transition hover:text-purple-400",
            pathname === "/dashboard" ? "text-purple-500 bg-purple-300/15 p-2 rounded-md" : "text-white/80"
          )}
        >
          Dashboard
        </Link>
      </nav>

      {/* Content */}

      <Toaster />
    </div>
  );
}
