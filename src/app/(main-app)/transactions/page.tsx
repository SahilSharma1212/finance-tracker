"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { Edit, Loader2, Trash } from "lucide-react";
import { TransactionType } from "@/types";

export default function TransactionPage() {
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    description: "",
    category: "",
    transactionId: "", // To track the transaction being edited
  });

  const [loading, setLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<TransactionType[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const apiUrl = formData.transactionId ? "/api/edit-transaction" : "/api/create-transaction";
    const method = formData.transactionId ? "PUT" : "POST";

    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: formData,
      });

      if (response.data.success) {
        toast.success(formData.transactionId ? "Transaction updated successfully!" : "Transaction created successfully!");
        setFormData({ amount: "", date: "", description: "", category: "", transactionId: "" }); // Clear form
        fetchRecentTransactions(); // Refresh recent transactions
      } else {
        toast.error(response.data.message || "Failed to create/update transaction.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Internal server error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get("/api/get-transactions");

      if (response.data.success) {
        setRecentTransactions(response.data.transactions); // All transactions in one list
      } else {
        toast.error("Failed to fetch transactions.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching transactions.");
    }
  };

  const handleEdit = (transaction: TransactionType) => {
    setFormData({
      amount: transaction.amount.toString(),
      date: `${Date.now}`,
      description: transaction.description,
      category: transaction.category,
      transactionId: transaction._id,
    });
  };

  const handleDelete = async (transactionId: string) => {
    try {
      const response = await axios.delete("/api/delete-transaction", { data: { transactionId } });

      if (response.data.success) {
        toast.success("Transaction deleted successfully!");
        fetchRecentTransactions(); // Refresh recent transactions
      } else {
        toast.error(response.data.message || "Failed to delete transaction.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting transaction.");
    }
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  // Calculate the total amount
  const totalAmount = recentTransactions.reduce((total, transaction) => total + transaction.amount, 0);

  return (
    <div className="p-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1c1c1c] border border-white/20 rounded-lg p-6 flex flex-wrap gap-4 items-end"
      >
        <h2 className="w-full text-2xl font-bold text-purple-400 mb-4">{formData.transactionId ? "Edit Transaction" : "Create New Transaction"}</h2>

        {/* Amount Field */}
        <div className="flex flex-col gap-2 min-w-[150px] flex-1">
          <Label htmlFor="amount">Amount</Label>
          <Input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter amount"
            className="border-white/20 text-white"
          />
        </div>

        {/* Date Field */}
        <div className="flex flex-col gap-2 min-w-[150px] flex-1">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="border-white/20 text-white"
          />
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-2 min-w-[150px] flex-1">
          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter description"
            className="border-white/20 text-white"
          />
        </div>

        {/* Category Field */}
        <div className="flex flex-col gap-2 min-w-[150px] flex-1">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="border border-white/20 bg-[#1c1c1c] rounded-lg p-2 text-white"
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-2 min-w-[150px]">
          <Button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full"
          >
            {loading ? <Loader2 className="animate-spin" /> : formData.transactionId ? "Update" : "Create"}
          </Button>
        </div>
      </form>

      <div className="mt-10 w-full space-y-8">
        {/* All Transactions */}
        <div>
          <h3 className="text-xl font-semibold text-purple-400 mb-4">All Transactions</h3>
          <div className="flex flex-col gap-3 max-sm:scale-95">
            {recentTransactions.map((transaction) => (
              <div key={transaction._id} className="border border-white/20 rounded-lg p-4 bg-[#2a2a2a] flex justify-between flex-wrap items-center">
                <div>
                  <p className="font-medium text-wrap">{transaction.description}</p>
                  <p className="text-sm text-gray-400">
                    ₹{transaction.amount} • {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3 my-1">
                  <Edit onClick={() => handleEdit(transaction)} className="cursor-pointer text-blue-600" />
                  <Trash onClick={() => handleDelete(transaction._id)} className="cursor-pointer text-red-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount */}
        <div className="mt-4 text-lg font-semibold text-white">
          <h4>Total Amount: ₹{totalAmount.toFixed(2)}</h4>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
