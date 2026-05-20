"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, ensureSeeded } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    ensureSeeded();
    if (isLoggedIn) {
      router.replace("/dashboard/");
    } else {
      router.replace("/login/");
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <img src="/jrt-logo.png" alt="JRT" className="w-16 h-16 mx-auto mb-4" />
        <p className="text-green-800 font-medium">Loading...</p>
      </div>
    </div>
  );
}