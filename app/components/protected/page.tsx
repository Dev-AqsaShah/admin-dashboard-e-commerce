"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps ) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        router.replace("/admin");
      }
    }
  }, [router]);

  const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    return null; // Don't render children if not logged in
  }

  return <>{children}</>;
}
