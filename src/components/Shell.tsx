"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, QrCode } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { useAuth } from "@/lib/storage";
import { ReactNode } from "react";

function getInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, owner } = useAuth();

  const displayName = owner?.businessName || "Business Owner";
  const initials = owner?.businessName ? getInitials(owner.businessName) : "🌿";

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar — lively like FV */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white z-50">
        {/* Brand / Business Banner */}
        <div className="px-5 py-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-green-500/20 ring-2 ring-green-400/50">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold truncate">{displayName}</h2>
              <p className="text-xs text-gray-400">LCM Pro Admin</p>
            </div>
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
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800/70 hover:text-green-400 transition-all duration-200"
          >
            <QrCode className="w-5 h-5" />
            QR Flyer
          </Link>
        </div>

        {/* User / Lock */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-md shadow-green-500/20 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <button
              onClick={() => { logout(); window.location.href = "/login/"; }}
              className="text-gray-500 hover:text-orange-400 transition-colors"
              title="Lock & Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar — vibrant gradient header with business banner */}
      <header className="lg:hidden sticky top-0 z-40 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 backdrop-blur-md text-white border-b border-gray-800">
        {/* Business banner row */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center font-bold text-xs shadow-md ring-2 ring-green-400/50">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-extrabold truncate">{displayName}</h1>
          </div>
          <Link
            href="/flyer/"
            className="text-gray-400 hover:text-green-400 p-1"
            title="QR Flyer"
          >
            <QrCode className="w-4 h-4" />
          </Link>
          <button
            onClick={() => { logout(); window.location.href = "/login/"; }}
            className="text-gray-400 hover:text-white p-1"
            title="Lock & Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
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
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/25"
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