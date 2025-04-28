"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast, Toaster } from "react-hot-toast"; // For notifications
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const SignInPage = () => {
  const [formData, setFormData] = useState({
    identifier: "", // email or username
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/sign-in", formData);

      if (response.data.success) {
        toast.success("Login successful!");
        router.push("/transactions"); // Redirect to a dashboard or homepage after login
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <Card className="p-8 w-full max-w-md bg-[#1c1c1c] rounded-lg border border-white/30 max-sm:scale-90">
        <h2 className="text-2xl text-center font-bold text-purple-600 mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier" className="text-white">Email or Username</Label>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              value={formData.identifier}
              onChange={handleChange}
              required
              className="w-full border border-white/25 text-white"
              placeholder="Email or Username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-white/25 text-white"
              placeholder="Password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-purple-600 text-white hover:bg-purple-700"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="text-white" style={{ textAlign: "center" }}>
          Already have an account?{" "}
          <span
            className="text-purple-600 cursor-pointer"
            onClick={() => router.push("/signup")}
          >Sign up
          </span>
        </div>
      </Card>
      <Toaster />
    </div>
  );
};

export default SignInPage;
