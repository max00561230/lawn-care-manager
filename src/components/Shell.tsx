"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, User, QrCode } from "lucide-react";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { useAuth } from "@/lib/storage";
import { ReactNode } from "react";

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, owner } = useAuth();

  const displayName = owner?.businessName || "Business Owner";
  const displayEmail = owner?.email || "";

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar — lively like FV */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white z-50">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-gray-800">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl shadow-lg shadow-green-500/20">
            🌿
          </div>
          <div>
            <h1 className="text-lg font-extrabold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              {APP_NAME}
            </h1>
            <p className="text-xs text-gray-400 font-medium">Admin Panel</p>
          </div>
        </div>

        {/* Navigation — emoji icons matching FV */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href + "/" || pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href + "/"}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                    : "text-gray-400 hover:bg-gray-800/70 hover:text-white"
                }`}
              >
                <span className="text-base leading-none">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* QR Flyer link */}
        <div className="px-3 py-2">
          <Link
            href="/flyer/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800/70 hover:text-orange-400 transition-all duration-200"
          >
            <QrCode className="w-5 h-5" />
            QR Flyer
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-md shadow-green-500/20">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
            </div>
            <button
              onClick={() => { logout(); window.location.href = "/login/"; }}
              className="text-gray-500 hover:text-orange-400 transition-colors"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar — vibrant gradient header */}
      <header className="lg:hidden sticky top-0 z-40 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 backdrop-blur-md text-white border-b border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm shadow-md">
            🌿
          </div>
          <h1 className="text-base font-extrabold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            {APP_NAME}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/flyer/"
              className="text-gray-400 hover:text-orange-400 p-1"
              title="QR Flyer"
            >
              <QrCode className="w-5 h-5" />
            </Link>
            <span className="text-xs text-gray-400 hidden sm:inline">{displayName}</span>
            <button
              onClick={() => { logout(); window.location.href = "/login/"; }}
              className="text-gray-400 hover:text-white p-1"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Horizontal scroll nav — mobile, emoji icons */}
        <nav className="flex overflow-x-auto gap-1 px-3 pb-2.5 scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href + "/" || pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href + "/"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-sm leading-none">{item.icon}</span>
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