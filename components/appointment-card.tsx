import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Appointment {
  id: string
  doctorName: string
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled" | "pending"
  reason?: string
}

interface AppointmentCardProps {
  appointment: Appointment
}

const statusConfig = {
  scheduled: { label: "Scheduled", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Completed", className: "bg-green-500/10 text-green-700 border-green-500/20" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" },
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const status = statusConfig[appointment.status]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{appointment.doctorName}</h3>
              {appointment.reason && <p className="text-sm text-muted-foreground">{appointment.reason}</p>}
            </div>
          </div>
          <Badge variant="outline" className={cn("border", status.className)}>
            {status.label}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{appointment.time}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
