// Authentication utilities for managing JWT tokens and user sessions

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  preferredDoctor?: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token)
}

export function removeToken(): void {
  localStorage.removeItem("auth_token")
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  return userStr ? JSON.parse(userStr) : null
}

export function setUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user))
}

export function removeUser(): void {
  localStorage.removeItem("user")
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock successful login
  const mockUser: User = {
    id: "1",
    email: email,
    name: email.split("@")[0],
    phone: "+1 (555) 123-4567",
  }

  const mockResponse: AuthResponse = {
    accessToken: "mock-jwt-token-" + Date.now(),
    user: mockUser,
  }

  return mockResponse
}

export function logout(): void {
  removeToken()
  removeUser()
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
