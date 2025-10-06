"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AppointmentCard, type Appointment } from "@/components/appointment-card"
import { apiRequest } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { Plus, Calendar, ArrowLeft } from "lucide-react"

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const fetchAppointments = async () => {
      try {
        const data = await apiRequest<Appointment[]>("/api/appointments")
        // Filter for upcoming appointments only
        const upcoming = data.filter((apt) => apt.status === "scheduled" || apt.status === "pending")
        setAppointments(upcoming.slice(0, 3))
      } catch (error) {
        console.error("[v0] Failed to fetch appointments:", error)
        // Mock data for development
        setAppointments([
          {
            id: "1",
            doctorName: "Dr. Sarah Johnson",
            date: "May 15, 2025",
            time: "10:00 AM",
            status: "scheduled",
            reason: "Annual checkup",
          },
          {
            id: "2",
            doctorName: "Dr. Michael Chen",
            date: "May 18, 2025",
            time: "2:30 PM",
            status: "scheduled",
            reason: "Follow-up consultation",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [router])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/login")} className="mb-2 gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground text-balance">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your upcoming appointments</p>
        </div>
        <Button onClick={() => router.push("/appointments")} className="gap-2">
          <Plus className="w-4 h-4" />
          Request Appointment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Appointments</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No upcoming appointments</h3>
            <p className="text-muted-foreground mb-4">Schedule your first appointment to get started</p>
            <Button onClick={() => router.push("/appointments")}>Request Appointment</Button>
          </div>
        )}
      </div>
    </div>
  )
}
