
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Bookmark,
  FileText,
  CreditCard,
  Settings,
  Users,
  Building2,
  ClipboardList,
  BarChart3,
  Plus,
  LogOut,
  Loader2,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useSession, signOut } from "@/lib/auth-client";

type UserRole = "seeker" | "recruiter" | "admin";

const menuItemByRole = {
  seeker: [
    {
      name: "Dashboard",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      name: "Browse Jobs",
      url: "/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved-jobs",
      icon: Bookmark,
    },
    {
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      name: "Billing",
      url: "/dashboard/seeker/billing",
      icon: CreditCard,
    },
    {
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: Settings,
    },
  ],

  recruiter: [
    {
      name: "Dashboard",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: ClipboardList,
    },
    {
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],

  admin: [
    {
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      name: "Manage Jobs",
      url: "/dashboard/admin/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Applications",
      url: "/dashboard/admin/applications",
      icon: ClipboardList,
    },
    {
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building2,
    },
    {
      name: "Reports",
      url: "/dashboard/admin/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      url: "/dashboard/admin/settings",
      icon: Settings,
    },
  ],
};

export function DashboardSidebar() {
  const { data: session, isPending } = useSession();

  const pathname = usePathname();
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;

  const userRole: UserRole =
    user?.role === "admin" ||
    user?.role === "recruiter" ||
    user?.role === "seeker"
      ? user.role
      : "seeker";

  const menuItems = menuItemByRole[userRole];

  const roleLabel =
    userRole.charAt(0).toUpperCase() + userRole.slice(1);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      await signOut();

      router.push("/signIn");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isPending) {
    return (
      <Sidebar>
        <SidebarContent className="flex items-center justify-center bg-[#0b0b10]">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar className="border-r border-white/10 bg-[#0b0b10] text-white">

      {/* Header */}
      <SidebarHeader className="gap-0 border-b border-white/10 px-4 pb-5 pt-6">

        {/* Logo */}
        <Link
          href="/"
          className="mb-6 inline-flex w-fit items-center text-2xl font-bold tracking-tight"
        >
          <span className="text-white">hire</span>
          <span className="text-violet-500">loop</span>
          <span className="ml-1.5 h-2 w-2 rounded-full bg-violet-500" />
        </Link>

        {/* User Profile */}
        <div className="rounded-xl border border-white/10 bg-[#15151d] p-3">

          <div className="flex items-center gap-3">

            {/* Profile Image */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-purple-800 text-lg font-bold text-white">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            {/* User Details */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-white">
                {user?.name || "User"}
              </h3>

              <p className="mt-1 truncate text-xs text-neutral-400">
                {user?.email || "No email available"}
              </p>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-neutral-500" />
          </div>

          {/* User Role */}
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
            <span className="text-xs text-neutral-500">
              Account Type
            </span>

            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
              {roleLabel}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-[#0b0b10] px-3 py-5">

        <SidebarGroup>
          <SidebarGroupLabel className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[1.5px] text-neutral-500">
            Main Menu
          </SidebarGroupLabel>

          <SidebarMenu className="gap-1.5">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.url ||
                (item.url !== `/dashboard/${userRole}` &&
                  pathname.startsWith(item.url + "/"));

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    tooltip={item.name}
                    className={`h-11 rounded-lg px-3 transition-all ${
                      isActive
                        ? "bg-violet-600 text-white hover:bg-violet-700 hover:text-white"
                        : "text-neutral-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    <span className="text-sm font-medium">
                      {item.name}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/10 bg-[#0b0b10] p-3">

        {/* Seeker Button */}
        {userRole === "seeker" && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <Link href="/dashboard/seeker/resume" />
                }
                className="h-11 justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-700 hover:text-white"
              >
                <Plus className="h-4 w-4" />
                <span className="font-semibold">Post Resume</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        {/* Recruiter Button */}
        {userRole === "recruiter" && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <Link href="/dashboard/recruiter/jobs/new" />
                }
                className="h-11 justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-700 hover:text-white"
              >
                <Plus className="h-4 w-4" />
                <span className="font-semibold">Post a Job</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        {/* Logout */}
        <SidebarMenu className="mt-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="h-10 rounded-lg text-neutral-400 hover:bg-red-500/10 hover:text-red-400"
            >
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}

              <span className="text-sm font-medium">
                {isSigningOut ? "Signing out..." : "Logout"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <p className="mt-2 text-center text-[10px] text-neutral-600">
          © 2026 HireLoop. All rights reserved.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
