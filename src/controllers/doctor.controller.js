import { DoctorService } from "../services/doctor.service.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorService.getAllDoctors();
    return successResponse(res, "Doctors fetched successfully", doctors);
  } catch (error) {
    console.error("Error in getAllDoctors:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await DoctorService.getDoctorById(req.params.id);
    if (!doctor) return errorResponse(res, "Doctor not found", 404);
    return successResponse(res, "Doctor fetched successfully", doctor);
  } catch (error) {
    console.error("Error in getDoctorById:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const getAvailabilityByDoctorId = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const slots = await DoctorService.getAvailabilityByDoctorId(doctorId);
    return successResponse(res, "Availability fetched successfully", slots);
  } catch (error) {
    console.error("Error in getAvailabilityByDoctorId:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const addAvailability = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const slots = req.body.slots;

    if (!Array.isArray(slots) || slots.length === 0) {
      return errorResponse(res, "Slots must be a non-empty array");
    }

    const newSlots = await DoctorService.addAvailability(doctorId, slots);
    return successResponse(res, "Availability added successfully", newSlots);
  } catch (error) {
    console.error("Error in addAvailability:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const deleteAvailability = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const availabilityId = req.params.availabilityId;

    const deleted = await DoctorService.deleteAvailability(doctorId, availabilityId);
    if (!deleted) return errorResponse(res, "Availability not found or unauthorized", 404);

    return successResponse(res, "Availability deleted successfully", { id: deleted });
  } catch (error) {
    console.error("Error in deleteAvailability:", error);
    return errorResponse(res, "Server error", 500);
  }
};
