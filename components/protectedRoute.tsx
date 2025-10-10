"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/userSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!currentUser) {
      // No logged-in user → redirect to login
      router.replace("/login");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    // Optionally show loading / placeholder
    return <div className="p-6 text-center">Redirecting...</div>;
  }

  return <>{children}</>;
}
