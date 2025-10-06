"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppointmentModal } from "@/components/appointment-modal"
import { apiRequest } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { Plus, Calendar, Clock, User, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  doctorName: string
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled" | "pending"
  reason?: string
}

const statusConfig = {
  scheduled: { label: "Scheduled", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-700 border-green-500/20" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" },
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const router = useRouter()

  const fetchAppointments = async () => {
    try {
      const data = await apiRequest<Appointment[]>("/api/appointments")
      setAppointments(data)
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
        {
          id: "3",
          doctorName: "Dr. Emily Rodriguez",
          date: "April 28, 2025",
          time: "11:00 AM",
          status: "completed",
          reason: "Vaccination",
        },
        {
          id: "4",
          doctorName: "Dr. James Wilson",
          date: "May 22, 2025",
          time: "3:00 PM",
          status: "pending",
          reason: "Consultation",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    fetchAppointments()
  }, [router])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mb-2 gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground text-balance">Appointments</h1>
          <p className="text-muted-foreground mt-1">View and manage your medical appointments</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Request Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const status = statusConfig[appointment.status]
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            {appointment.doctorName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {appointment.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {appointment.time}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{appointment.reason || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("border", status.className)}>
                            {status.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No appointments yet</h3>
              <p className="text-muted-foreground mb-4">Get started by requesting your first appointment</p>
              <Button onClick={() => setModalOpen(true)}>Request Appointment</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AppointmentModal open={modalOpen} onOpenChange={setModalOpen} onSuccess={fetchAppointments} />
    </div>
  )
}
