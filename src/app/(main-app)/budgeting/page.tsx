"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Category {
  category: string;
  amount: number;
}

interface BudgetType {
  _id: string;
  timeframe: "week" | "month";
  startDate: string;
  categories: Category[];
}

export default function BudgetPage() {
  const [formData, setFormData] = useState({
    timeframe: "month",
    food: "",
    entertainment: "",
    transport: "",
    shopping: "",
  });

  const [loading, setLoading] = useState(false);
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/create-budget", {
        timeframe: formData.timeframe,
        startDate: Date.now(), // server will properly handle date
        categories: [
          { category: "Food", amount: Number(formData.food) },
          { category: "Entertainment", amount: Number(formData.entertainment) },
          { category: "Transport", amount: Number(formData.transport) },
          { category: "Shopping", amount: Number(formData.shopping) },
        ],
      });

      if (res.data.success) {
        toast.success("Budget created successfully!");
        fetchBudgets();
        setFormData({ timeframe: "month", food: "", entertainment: "", transport: "", shopping: "" });
      } else {
        toast.error(res.data.message || "Failed to create budget.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Internal server error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await axios.get("/api/get-budgets");
      if (res.data.success) {
        setBudgets(res.data.budgets);
      } else {
        toast.error("Failed to fetch budgets.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching budgets.");
    }
  };

  const handleDelete = async (budgetId: string) => {
    try {
      const res = await axios.post(`/api/delete-budget`,{budgetId:budgetId});
      if (res.data.success) {
        toast.success("Budget deleted successfully!");
        fetchBudgets();
      } else {
        toast.error(res.data.message || "Failed to delete budget.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting budget.");
    }
  };

  const handleCompare = (budgetId: string) => {
    router.push(`/budget-comparison?budgetId=${budgetId}`);
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="p-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1c1c1c] border border-white/20 rounded-lg p-6 flex flex-wrap gap-4 items-end"
      >
        <h2 className="w-full text-2xl font-bold text-purple-600 mb-4">Create New Budget</h2>

        {/* Timeframe */}
        <div className="flex flex-col gap-2 min-w-[150px] flex-1">
          <Label htmlFor="timeframe">Timeframe</Label>
          <select
            id="timeframe"
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            required
            className="border border-white/20 bg-[#1c1c1c] rounded-lg p-2 text-white"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>

        {/* Food */}
        <div className="flex flex-col gap-2 min-w-[150px] flex-1">
          <Label htmlFor="food">Food Budget</Label>
          <Input
            type="number"
            id="food"
            name="food"
            value={formData.food}
            onChange={handleChange}
            required
            placeholder="₹"
            className="border-white/20 text-white"
          />
        </div>

        {/* Entertainment */}
        <div className="flex flex-col gap-2 min-w-[150px] flex-1">
          <Label htmlFor="entertainment">Entertainment Budget</Label>
          <Input
            type="number"
            id="entertainment"
            name="entertainment"
            value={formData.entertainment}
            onChange={handleChange}
            required
            placeholder="₹"
            className="border-white/20 text-white"
          />
        </div>

        {/* Transport */}
        <div className="flex flex-col gap-2 min-w-[150px] flex-1">
          <Label htmlFor="transport">Transport Budget</Label>
          <Input
            type="number"
            id="transport"
            name="transport"
            value={formData.transport}
            onChange={handleChange}
            required
            placeholder="₹"
            className="border-white/20 text-white"
          />
        </div>

        {/* Shopping */}
        <div className="flex flex-col gap-2 min-w-[150px] flex-1">
          <Label htmlFor="shopping">Shopping Budget</Label>
          <Input
            type="number"
            id="shopping"
            name="shopping"
            value={formData.shopping}
            onChange={handleChange}
            required
            placeholder="₹"
            className="border-white/20 text-white"
          />
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-2 min-w-[150px]">
          <Button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Budget"}
          </Button>
        </div>
      </form>

      {/* All Budgets */}
      <div className="mt-10 w-full space-y-8">
        <h3 className="text-xl font-semibold text-purple-600 mb-4">All Budgets</h3>
        <div className="flex flex-col gap-3 max-sm:scale-95">
          {budgets.map((budget) => (
            <div
              key={budget._id}
              className="border border-white/20 rounded-lg p-4 bg-[#2a2a2a] flex justify-between items-center cursor-pointer hover:bg-[#333]"
              onClick={() => handleCompare(budget._id)}
            >
              <div>
                <p className="font-medium">Timeframe: {budget.timeframe.toUpperCase()}</p>
                <p className="text-sm text-gray-400">
                  Start Date: {new Date(budget.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400">
                  Categories: {budget.categories.length}
                </p>
              </div>
              <Trash
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(budget._id);
                }}
                className="cursor-pointer text-red-500"
              />
            </div>
          ))}
        </div>
      </div>

      <Toaster />
    </div>
  );
}
