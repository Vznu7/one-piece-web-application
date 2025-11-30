"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
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
    <div className="w-full max-w-md space-y-8 animate-fade-up">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900">Welcome back</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Sign in to your One More Piece account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-neutral-200 bg-white p-8">
        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-900">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-brand-accent focus:ring-brand-accent"
            />
            <span className="ml-2 text-neutral-600">Remember me</span>
          </label>
          <Link href="/auth/forgot-password" className="text-brand-accent hover:text-brand-dark">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-neutral-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-brand-accent hover:text-brand-dark">
            Sign up
          </Link>
        </p>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-neutral-500">Demo Accounts</span>
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 p-4 text-xs text-neutral-600 space-y-1">
          <p><strong>User:</strong> user@example.com / password123</p>
          <p><strong>Admin:</strong> admin@onemorepiece.com / admin123</p>
          <p className="pt-2 text-neutral-500">Or use any email/password to create a demo account</p>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="w-full max-w-md animate-pulse"><div className="h-96 bg-neutral-100 rounded-2xl"></div></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
