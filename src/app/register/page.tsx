"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Registration failed");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("An error occurred during registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <Link href="/">
            <img src="/logo.png" alt="Just Tech Logo" className="w-16 h-16 object-contain mb-4 hover:opacity-90 transition-opacity" />
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 font-heading tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Join Just Tech and start building
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm text-center font-medium animate-pulse">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all sm:text-sm bg-gray-50/50"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-[#0f4a8a] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all shadow-md active:scale-[0.98]"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm">
          <span className="text-gray-500">Already have an account?</span>{" "}
          <Link href="/login" className="font-bold text-[#0f4a8a] hover:text-blue-700 transition-colors underline-offset-4 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
