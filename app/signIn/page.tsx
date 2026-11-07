
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Eye,
  EyeOff,
  BriefcaseBusiness,
  Loader2,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignInPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || "Invalid email or password");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setError("Google login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 py-12 text-white">

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/20 blur-[150px]" />

      {/* Sign In Card */}
      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6545ff]">
            <BriefcaseBusiness size={22} />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            Hire<span className="text-[#8065ff]">Loop</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#101010] p-6 shadow-2xl shadow-purple-950/20 sm:p-8">

          {/* Heading */}
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome Back!
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Sign in to find your dream job.
            </p>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="h-12 w-full border-white/10 bg-[#181818] text-white hover:bg-[#252525] hover:text-white"
          >
            <span className="mr-2 text-lg font-bold">G</span>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500">
              OR CONTINUE WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email Address
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="h-12 border-white/10 bg-[#181818] text-white placeholder:text-gray-500 focus-visible:ring-[#6545ff]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="h-12 border-white/10 bg-[#181818] pr-12 text-white placeholder:text-gray-500 focus-visible:ring-[#6545ff]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full bg-[#6545ff] text-base font-semibold text-white hover:bg-[#5435e8]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-7 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signUp"
              className="font-semibold text-[#9b87ff] hover:text-white"
            >
              Create Account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-600">
          © 2026 HireLoop. All rights reserved.
        </p>
      </div>
    </main>
  );
};

export default SignInPage;
