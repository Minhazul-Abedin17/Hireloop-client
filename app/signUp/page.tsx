
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
  User,
  Image as ImageIcon,
  Users,
  ShieldCheck,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignUppage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"seeker" | "recruiter" | "admin">("seeker");

  const roles = [
    {
      value: "seeker" as const,
      title: "Job Seeker",
      description: "Find your dream job",
      icon: User,
    },
    {
      value: "recruiter" as const,
      title: "Recruiter",
      description: "Hire talented people",
      icon: Users,
    },
    {
      value: "admin" as const,
      title: "Admin",
      description: "Manage the platform",
      icon: ShieldCheck,
    },
  ];

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    // Admin cannot register through public signup
    // if (role === "admin") {
    //   setError(
    //     "Admin accounts can only be created by an authorized administrator."
    //   );
    //   setLoading(false);
    //   return;
    // }

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const image = formData.get("image") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
        role,
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || "Registration failed");
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
      setError("Google registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 py-10 text-white">

      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-700/20 blur-[150px]" />

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <Link href="/" className="mb-7 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6545ff]">
            <BriefcaseBusiness size={22} />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            Hire<span className="text-[#8065ff]">Loop</span>
          </span>
        </Link>

        {/* Sign Up Card */}
        <div className="rounded-2xl border border-white/10 bg-[#101010] p-6 shadow-2xl shadow-purple-950/20 sm:p-8">

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Join HireLoop and discover your next opportunity.
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6 space-y-3">
            <h2 className="text-sm font-medium text-gray-300">
              Choose your account type
            </h2>

            <div className="grid grid-cols-3 gap-2">

              {roles.map((item) => {
                const Icon = item.icon;
                const selected = role === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setRole(item.value);
                      setError("");
                    }}
                    className={`relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 ${
                      selected
                        ? "border-[#6545ff] bg-[#6545ff]/15 shadow-[0_0_15px_rgba(101,69,255,0.12)]"
                        : "border-white/10 bg-[#181818] hover:border-white/30"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#6545ff]">
                        <Check size={11} />
                      </span>
                    )}

                    <Icon
                      size={22}
                      className={
                        selected ? "text-[#9b87ff]" : "text-gray-400"
                      }
                    />

                    <span className="text-xs font-semibold text-white sm:text-sm">
                      {item.title}
                    </span>

                    <span className="text-[9px] leading-4 text-gray-500 sm:text-[10px]">
                      {item.description}
                    </span>
                  </button>
                );
              })}

            </div>

            <p className="text-xs text-gray-500">
              Selected:{" "}
              <span className="font-semibold capitalize text-[#9b87ff]">
                {role}
              </span>
            </p>
          </div>

          {/* Google Signup */}
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
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500">
              OR SIGN UP WITH EMAIL
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Username
              </label>

              <div className="relative">
                <User
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your username"
                  required
                  className="h-11 border-white/10 bg-[#181818] pl-10 text-white placeholder:text-gray-500 focus-visible:ring-[#6545ff]"
                />
              </div>
            </div>

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
                className="h-11 border-white/10 bg-[#181818] text-white placeholder:text-gray-500 focus-visible:ring-[#6545ff]"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium text-gray-300">
                Profile Image URL
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </label>

              <div className="relative">
                <ImageIcon
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="h-11 border-white/10 bg-[#181818] pl-10 text-white placeholder:text-gray-500 focus-visible:ring-[#6545ff]"
                />
              </div>
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
                  placeholder="Create a password"
                  required
                  minLength={8}
                  className="h-11 border-white/10 bg-[#181818] pr-12 text-white placeholder:text-gray-500 focus-visible:ring-[#6545ff]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Password must be at least 8 characters.
              </p>
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
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#9b87ff] hover:text-white"
            >
              Sign In
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

export default SignUppage;
