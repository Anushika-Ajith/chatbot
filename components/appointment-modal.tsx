"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/api"

interface Doctor {
  id: string
  name: string
  specialty: string
}

interface AppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AppointmentModal({ open, onOpenChange, onSuccess }: AppointmentModalProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await apiRequest<Doctor[]>("/api/doctors")
        setDoctors(data)
      } catch (error) {
        console.error("[v0] Failed to fetch doctors:", error)
        setDoctors([
          { id: "1", name: "Dr. Sarah Johnson", specialty: "General Practice" },
          { id: "2", name: "Dr. Michael Chen", specialty: "Cardiology" },
          { id: "3", name: "Dr. Emily Rodriguez", specialty: "Pediatrics" },
          { id: "4", name: "Dr. James Wilson", specialty: "Orthopedics" },
        ])
      }
    }

    if (open) {
      fetchDoctors()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await apiRequest("/api/appointments", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      toast({
        title: "Appointment requested",
        description: "Your appointment request has been submitted successfully.",
      })

      setFormData({ doctorId: "", date: "", time: "", reason: "" })
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Request failed",
        description: "Failed to submit appointment request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl">Request Appointment</DialogTitle>
          <DialogDescription className="text-sm">
            Fill in the details to request a new appointment with your doctor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 md:space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doctor" className="text-sm">
                Doctor
              </Label>
              <Select
                value={formData.doctorId}
                onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
              >
                <SelectTrigger id="doctor">
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm">
                Reason for Visit
              </Label>
              <Textarea
                id="reason"
                placeholder="Describe your symptoms or reason for the appointment..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={4}
                required
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
