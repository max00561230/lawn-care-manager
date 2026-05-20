"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Calendar, Users, Clock, Scissors, FileText,
  CheckSquare, Bell, CreditCard, BarChart3, Settings, LogOut, User,
} from "lucide-react";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { useAuth } from "@/lib/storage";
import { ReactNode } from "react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Calendar, Users, Clock, Scissors, FileText,
  CheckSquare, Bell, CreditCard, BarChart3, Settings,
};

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-green-900 text-white">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-green-800">
          <img src="/jrt-logo.png" alt="JRT" className="w-10 h-10 rounded" />
          <div>
            <h1 className="text-lg font-bold text-yellow-400">{APP_NAME}</h1>
            <p className="text-xs text-green-300">Business Dashboard</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon] || LayoutDashboard;
            const active = pathname === item.href + "/" || pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href + "/"}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-green-700 text-yellow-400"
                    : "text-green-200 hover:bg-green-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center">
              <User className="w-5 h-5 text-green-200" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Business Owner</p>
              <p className="text-xs text-green-300 truncate">owner@jrtlawn.com</p>
            </div>
            <button onClick={() => { logout(); window.location.href = "/login/"; }} className="text-green-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-green-900 text-white">
        <div className="flex items-center gap-3 px-4 py-3">
          <img src="/jrt-logo.png" alt="JRT" className="w-8 h-8 rounded" />
          <h1 className="text-base font-bold text-yellow-400">{APP_NAME}</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => { logout(); window.location.href = "/login/"; }}
              className="text-green-300 hover:text-white p-1"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Horizontal scroll nav */}
        <nav className="flex overflow-x-auto gap-1 px-3 pb-2 scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon] || LayoutDashboard;
            const active = pathname === item.href + "/" || pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href + "/"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-yellow-400 text-green-900"
                    : "bg-green-800 text-green-200 hover:bg-green-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}