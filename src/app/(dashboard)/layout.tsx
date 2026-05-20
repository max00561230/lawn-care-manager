"use client";

import Shell from "@/components/Shell";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ensureSeeded } from "@/lib/storage";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, isSetupComplete } = useAuth();

  useEffect(() => {
    ensureSeeded();
    if (!isSetupComplete) {
      router.replace("/setup/");
    } else if (!isLoggedIn) {
      router.replace("/login/");
    }
  }, [isLoggedIn, isSetupComplete, router]);

  if (!isLoggedIn || !isSetupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img src="/jrt-logo.png" alt="JRT" className="w-16 h-16 mx-auto mb-4" />
          <p className="text-green-800">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <Shell>{children}</Shell>;
}