"use client"
import { selectCurrentUser } from "@/store/userSlice";
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function HomePage() {
    const router = useRouter();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
  }, [currentUser, router]);

  if (!currentUser) return <div>Redirecting...</div>;
  redirect("/login")
}
