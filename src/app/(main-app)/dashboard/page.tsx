"use client";

import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

type Transaction = {
  _id: string;
  amount: number;
  category: string;
  createdAt: string; // assuming ISO date string
};

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("week");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<{ category: string; amount: number }[]>([]);

  useEffect(() => {
    // Fetch transactions on mount
    async function fetchTransactions() {
      try {
        const res = await axios.get("/api/get-transactions");
        setTransactions(res.data.transactions || []); // Ensure the transactions array is defined
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      }
    }

    fetchTransactions();
  }, []);

  useEffect(() => {
    // Whenever transactions or timeframe changes, update chart data
    if (transactions.length === 0) return; // Guard against empty transactions

    const now = new Date();
    let filtered: Transaction[] = [];

    // Filter transactions based on timeframe
    if (timeframe === "week") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      filtered = transactions.filter(txn => new Date(txn.createdAt) >= sevenDaysAgo);
    } else if (timeframe === "month") {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = transactions.filter(txn => new Date(txn.createdAt) >= firstDayOfMonth);
    }

    // Group by category and sum amounts
    const grouped: { [category: string]: number } = {};
    for (const txn of filtered) {
      if (!grouped[txn.category]) {
        grouped[txn.category] = 0;
      }
      grouped[txn.category] += txn.amount;
    }

    // Convert grouped data to an array for recharts
    const chartArray = Object.entries(grouped).map(([category, amount]) => ({
      category,
      amount,
    }));

    setChartData(chartArray);
  }, [transactions, timeframe]);

  return (
    <div className="p-6 text-white">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-purple-400 mb-6">Spending Summary</h2>

      {/* Timeframe Selector */}
      <div className="mb-8 w-[200px]">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="border-white/20 bg-[#1c1c1c] text-white">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent className="bg-[#1c1c1c] text-white border-white/20">
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="category" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1c1c1c", border: "1px solid #555", color: "#fff" }}
              cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
            />
            <Bar dataKey="amount" fill={"#8b5cf6"} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Total Spent */}
      <div className="mt-8 flex justify-end">
        <div className="bg-[#0e0e0e] border border-white/10 p-4 rounded-lg text-lg font-semibold">
          Total Spent: ₹
          {chartData.reduce((total, item) => total + item.amount, 0).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
