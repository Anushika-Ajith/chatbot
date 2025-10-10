import { AppointmentService } from "../services/appointment.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const createAppointment = async (req, res) => {
  try {
    const { userId, providerId, chatSessionId, startTime, endTime, metadata } = req.body;

    if (!userId || !providerId || !startTime || !endTime) {
      return errorResponse(res, "Missing required fields: userId, providerId, startTime, endTime");
    }

    const appointment = await AppointmentService.createAppointment({
      userId,
      providerId,
      chatSessionId,
      startTime,
      endTime,
      metadata,
    });

    return successResponse(res, "Appointment created successfully", appointment);
  } catch (error) {
    console.error("Error in createAppointment:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await AppointmentService.getAppointmentById(req.params.id);
    if (!appointment) return errorResponse(res, "Appointment not found", 404);
    return successResponse(res, "Appointment fetched successfully", appointment);
  } catch (error) {
    console.error("Error in getAppointmentById:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const getAppointmentsByUser = async (req, res) => {
  try {
    const appointments = await AppointmentService.getAppointmentsByUser(req.params.userId);
    return successResponse(res, "User appointments fetched successfully", appointments);
  } catch (error) {
    console.error("Error in getAppointmentsByUser:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const getAppointmentsByProvider = async (req, res) => {
  try {
    const appointments = await AppointmentService.getAppointmentsByProvider(req.params.providerId);
    return successResponse(res, "Provider appointments fetched successfully", appointments);
  } catch (error) {
    console.error("Error in getAppointmentsByProvider:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return errorResponse(res, "Status is required");

    const appointment = await AppointmentService.updateAppointmentStatus(req.params.id, status);
    return successResponse(res, "Appointment status updated", appointment);
  } catch (error) {
    console.error("Error in updateAppointmentStatus:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const deleted = await AppointmentService.softDeleteAppointment(req.params.id);
    return successResponse(res, "Appointment cancelled successfully", deleted);
  } catch (error) {
    console.error("Error in deleteAppointment:", error);
    return errorResponse(res, "Server error", 500);
  }
};
