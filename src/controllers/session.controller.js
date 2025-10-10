import { successResponse, errorResponse } from "../utils/apiResponse.js";
import { SessionService } from "../services/sessions.service.js";

export const createOrResumeSession = async (req, res) => {
  try {
    const { userId, metadata } = req.body;

    if (!userId) return errorResponse(res, "userId is required");

    const { session, resumed } = await SessionService.createOrResumeSession({
      userId,
      metadata,
    });

    const message = resumed
      ? "Existing session resumed successfully"
      : "New session created successfully";

    return successResponse(res, message, session);
  } catch (error) {
    console.error("Error in createOrResumeSession:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const getSessionById = async (req, res) => {
  try {
    const session = await SessionService.getSessionById(req.params.id);
    if (!session) return errorResponse(res, "Session not found", 404);
    return successResponse(res, "Session fetched successfully", session);
  } catch (error) {
    console.error("Error in getSessionById:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const getSessionsByUser = async (req, res) => {
  try {
    const sessions = await SessionService.getSessionsByUser(req.params.userId);
    return successResponse(res, "Sessions fetched successfully", sessions);
  } catch (error) {
    console.error("Error in getSessionsByUser:", error);
    return errorResponse(res, "Server error", 500);
  }
};

export const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return errorResponse(res, "Status is required");

    const updated = await SessionService.updateSessionStatus(req.params.id, status);
    return successResponse(res, "Session status updated successfully", updated);
  } catch (error) {
    console.error("Error in updateSessionStatus:", error);
    return errorResponse(res, "Server error", 500);
  }
};
