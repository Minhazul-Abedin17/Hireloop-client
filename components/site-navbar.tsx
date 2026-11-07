
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  ChevronRight,
  LogOut,
  Loader2,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";

const navLinks = [
  {
    label: "Browse Jobs",
    href: "/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Company",
    href: "/company",
    icon: Building2,
  },
  {
    label: "Pricing",
    href: "/pricing",
    icon: CreditCard,
  },
];

export function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      await signOut({
        fetchOptions: {
          onSuccess: () => {
            setMobileOpen(false);
            router.push("/signIn");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Main navigation">
          <div className="flex h-[76px] items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              aria-label="HireLoop home"
              onClick={() => setMobileOpen(false)}
              className="flex shrink-0 items-center"
            >
              <Image
                src="/images/logo.png"
                alt="HireLoop"
                width={154}
                height={44}
                priority
                className="h-9 w-auto object-contain sm:h-10"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-6 md:flex">
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "relative flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-violet-500/10 text-violet-300"
                            : "text-neutral-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {link.label}

                        {isActive && (
                          <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-violet-400" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Desktop Authentication */}
              {!isPending && (
                <div className="flex items-center gap-4 border-l border-white/10 pl-5">
                  {user ? (
                    <>
                      {/* User Profile */}
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-500 to-purple-700 text-sm font-bold text-white">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || "User"}
                              width={40}
                              height={40}
                              className="size-full object-cover"
                            />
                          ) : (
                            user.name?.charAt(0)?.toUpperCase() || "U"
                          )}
                        </div>

                        <div className="max-w-36">
                          <p className="truncate text-sm font-semibold text-white">
                            {user.name || "User"}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Sign Out */}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isSigningOut}
                        onClick={handleSignOut}
                        className="h-10 rounded-xl border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-neutral-300 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                      >
                        {isSigningOut ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          <LogOut className="mr-2 size-4" />
                        )}
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signIn"
                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:text-white"
                      >
                        Sign In
                      </Link>

                      <Link
                        href="/signUp"
                        className="inline-flex h-10 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-500"
                      >
                        Get Started
                        <ChevronRight className="ml-1 size-4" />
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="size-10 rounded-xl text-neutral-200 hover:bg-white/10 hover:text-white md:hidden"
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden",
              mobileOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="border-t border-white/10 pb-5 pt-3">
                {/* Mobile Links */}
                <ul className="space-y-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;

                    const isActive =
                      pathname === link.href ||
                      pathname.startsWith(`${link.href}/`);

                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-violet-500/10 text-violet-300"
                              : "text-neutral-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="size-[18px]" />
                            {link.label}
                          </span>

                          <ChevronRight className="size-4 opacity-50" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {/* Mobile Authentication */}
                {!isPending && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                    {user ? (
                      <div className="space-y-3">
                        {/* Mobile User Profile */}
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-500 to-purple-700 text-sm font-bold text-white">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name || "User"}
                                width={44}
                                height={44}
                                className="size-full object-cover"
                              />
                            ) : (
                              user.name?.charAt(0)?.toUpperCase() || "U"
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                              {user.name || "User"}
                            </p>
                            <p className="truncate text-xs text-neutral-500">
                              {user.email}
                            </p>
                          </div>

                          <UserRound className="size-5 shrink-0 text-violet-400" />
                        </div>

                        {/* Mobile Sign Out */}
                        <Button
                          type="button"
                          variant="outline"
                          disabled={isSigningOut}
                          onClick={handleSignOut}
                          className="h-11 w-full rounded-xl border-red-500/20 bg-red-500/[0.06] text-sm font-medium text-red-400 transition-all hover:bg-red-500/15 hover:text-red-300"
                        >
                          {isSigningOut ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                          ) : (
                            <LogOut className="mr-2 size-4" />
                          )}
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href="/signIn"
                          onClick={() => setMobileOpen(false)}
                          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-transparent text-sm font-medium text-neutral-200 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          Sign In
                        </Link>

                        <Link
                          href="/signUp"
                          onClick={() => setMobileOpen(false)}
                          className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                        >
                          Get Started
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
