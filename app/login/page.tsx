"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { login, signup } from "@/lib/auth"
import { Activity } from "lucide-react"
import { useDispatch } from "react-redux"
import { setCredentials } from "@/store/userSlice"

interface AuthPageProps {
  mode: "login" | "signup"
}

export default function AuthPage({ mode }: AuthPageProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useDispatch()

  const isSignup = mode === "signup"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = isSignup 
        ? await signup(name, email, password)
        : await login(email, password)
      
      dispatch(setCredentials(response))

      toast({
        title: isSignup ? "Account created!" : "Welcome back!",
        description: isSignup 
          ? "Your account has been successfully created."
          : "You have successfully signed in.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: isSignup ? "Signup failed" : "Login failed",
        description: isSignup
          ? "Could not create account. Please try again."
          : "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/20 to-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-balance">HealthCare Portal</CardTitle>
            <CardDescription className="text-balance">
              {isSignup 
                ? "Create an account to get started with our services"
                : "Sign in to manage your appointments and chat with our AI assistant"
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading 
                ? (isSignup ? "Creating account..." : "Signing in...")
                : (isSignup ? "Create Account" : "Sign In")
              }
            </Button>
            {!isSignup && (
              <Button type="button" variant="link" className="w-full text-sm text-muted-foreground">
                Forgot Password?
              </Button>
            )}
            <div className="text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <Link 
                href={isSignup ? "/login" : "/signup"} 
                className="text-primary hover:underline font-medium"
              >
                {isSignup ? "Sign in" : "Sign up"}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}