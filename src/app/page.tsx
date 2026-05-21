"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ensureSeeded } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, isSetupComplete } = useAuth();

  useEffect(() => {
    ensureSeeded();
    if (isLoggedIn) {
      router.replace("/dashboard/");
    } else if (!isSetupComplete) {
      router.replace("/setup/");
    } else {
      router.replace("/login/");
    }
  }, [isLoggedIn, isSetupComplete, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <img src="/jrt-logo.png" alt="JRT" className="w-16 h-16 mx-auto mb-4" />
        <p className="text-gray-700 font-medium">Loading...</p>
      </div>
    </div>
  );
}