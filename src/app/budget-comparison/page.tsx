"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Category {
  category: string;
  amount: number;
}

interface Transaction {
  category: string;
  amount: number;
  createdAt: string; // The date when the transaction was created
}

interface BudgetType {
  _id: string;
  timeframe: "week" | "month";
  startDate: string;
  categories: Category[];
}

export default function BudgetComparisonPage() {
  const [budget, setBudget] = useState<BudgetType | null>(null);
  const [expenses, setExpenses] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const budgetId = searchParams.get('budgetId'); // Get budgetId from URL params

  const fetchBudget = async () => {
    try {
      if (!budgetId) {
        toast.error("Budget ID is missing.");
        return;
      }

      // Fetch all budgets
      const res = await axios.get("/api/get-budgets");
      
      if (res.data.success) {
        // Find the budget that matches the budgetId from the URL
        const matchedBudget = res.data.budgets.find((budget: BudgetType) => budget._id === budgetId);
        
        if (matchedBudget) {
          setBudget(matchedBudget);
        } else {
          toast.error("No budget found with this ID.");
        }
      } else {
        toast.error("Failed to fetch budgets.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching budgets.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/get-transactions");

      if (res.data.success) {
        const transactions: Transaction[] = res.data.transactions;
        
        // Filter transactions based on the budget timeframe and createdAt date
        const filteredTransactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          const budgetStartDate = new Date(budget?.startDate || "");
          const timeframe = budget?.timeframe === "month" ? 30 : 7; // Week or month

          // Check if transaction is after budget start date and within the timeframe (week/month)
          return (
            transactionDate >= budgetStartDate &&
            transactionDate <= new Date(budgetStartDate.getTime() + timeframe * 24 * 60 * 60 * 1000)
          );
        });

        // Sum expenses by category
        const categoryExpenses: { [key: string]: number } = {};
        filteredTransactions.forEach((transaction) => {
          if (categoryExpenses[transaction.category]) {
            categoryExpenses[transaction.category] += transaction.amount;
          } else {
            categoryExpenses[transaction.category] = transaction.amount;
          }
        });

        // Set expenses in the state
        setExpenses(categoryExpenses);
      } else {
        toast.error("Failed to fetch transactions.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching transactions.");
    }
  };



  useEffect(() => {
    if (budgetId) {
      fetchBudget();
    }
  }, [budgetId]);

  useEffect(() => {
    if (budget) {
      fetchTransactions();
    }
  }, [budget]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Loader2 className="animate-spin text-purple-600" />
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="text-white">
        <p className="text-center">No budget data found for this comparison.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Compare Budget</h2>

      {/* Display Budget Information */}
      <div className="bg-[#1c1c1c] p-4 rounded-lg mb-6">
        <p className="font-semibold">Timeframe: {budget.timeframe.toUpperCase()}</p>
        <p className="text-sm text-gray-400">Start Date: {new Date(budget.startDate).toLocaleDateString()}</p>
        <p className="text-sm text-gray-400">Categories: {budget.categories.length}</p>
      </div>

      {/* Expense Input for Each Category */}
      <div >
        {budget.categories.map((category) => (
          <div key={category.category} className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Label htmlFor={category.category}>{category.category}</Label>
              <p className="text-white">{expenses[category.category] ? `₹${expenses[category.category]}` : "₹0"}</p>
            </div>
            <div className="w-1/3 text-center">
              <p className="text-sm text-gray-400">Allocated: ₹{category.amount}</p>
            </div>
          </div>
        ))}


      </div>

      {/* Display Comparison Results */}
      <div className="mt-8 space-y-6">
        {budget.categories.map((category) => {
          const spentAmount = expenses[category.category] || 0;
          const remainingAmount = category.amount - spentAmount;

          return (
            <div key={category.category} className="bg-[#2a2a2a] p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{category.category}</h3>
              <p className="text-sm text-gray-400">Allocated: ₹{category.amount}</p>
              <p className="text-sm text-gray-400">Spent: ₹{spentAmount}</p>
              <p className="text-sm text-gray-400">Remaining: ₹{remainingAmount}</p>
            </div>
          );
        })}
      </div>

      <Toaster />
    </div>
  );
}
