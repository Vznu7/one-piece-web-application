"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-950/80 p-6 space-y-6 animate-fade-up">
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-[0.35em] uppercase text-neutral-400">
          One More Piece
        </p>
        <h1 className="text-xl font-semibold text-neutral-50">Admin sign in</h1>
        <p className="text-xs text-neutral-400">
          Access the One More Piece store dashboard. For store owners only.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-900/30 border border-red-800 p-3 text-xs text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div className="space-y-1">
          <label className="text-xs text-neutral-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="admin@onemorepiece.com"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-neutral-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-neutral-50 px-4 py-2 text-xs font-medium text-neutral-900 hover:bg-white transition-colors disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="rounded-xl bg-neutral-800/50 p-3 text-xs text-neutral-400 space-y-1">
        <p className="font-medium text-neutral-300">Demo Admin Account:</p>
        <p>Email: admin@onemorepiece.com</p>
        <p>Password: admin123</p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-50">
      <Suspense fallback={<div className="w-full max-w-sm animate-pulse"><div className="h-80 bg-neutral-800 rounded-2xl"></div></div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
