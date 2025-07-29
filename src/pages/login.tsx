"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateEmail = (value: string) => {
    if (!value) setError("Email is required.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      setError("Invalid email format.");
    else setError("");
    setEmail(value);
  };

  const validatePassword = (value: string) => {
    if (!value) setError("Password is required.");
    else setError("");
    setPassword(value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (error || !email || !password) {
      setError("Please fill all required fields correctly.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/crm/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store email in localStorage
      localStorage.setItem("userEmail", email);
      router.push("/user-profile");
    } catch (err: any) {
      setError(err.message || "Login failed");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <form onSubmit={handleLogin} className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-emerald-600">
            Login
          </h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <Link
              href="/signup"
              className="text-emerald-600 font-medium hover:text-emerald-700"
            >
              Don’t have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
