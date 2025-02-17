"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Admin Credentials (Replace with secure authentication later)
    const adminEmail = "example@gmail.com";
    const adminPassword = "admin123"; // ⚠️ Change this to a secure backend authentication

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("isLoggedIn", "true"); // ✅ Store login state
      router.push("/admin/dashboard"); // ✅ Redirect to Admin Dashboard
    } else {
      setError("Invalid email or password"); // ❌ Show error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded mb-2"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded mb-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
