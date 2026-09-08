import { ApiResponse, ApiError, asyncHandler } from "../utils/index.js";
import {
  allConditionService,
  processTriageIntakeService,
  logTriageOutcomeService,
  getAllGreenTriageSessionsService,
  getTriageByPatientIdService,
} from "../services/triage.service.js";

export const allCondition = asyncHandler(async (req, res, next) => {
  try {
    const fetchCondition = await allConditionService();
    res.json(
      new ApiResponse(200, fetchCondition, "Conditions fetched successfully.")
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return next(new ApiError(500, "Internal error!!!", [error.message]));
  }
});

export const triageIntake = asyncHandler(async (req, res, next) => {
  try {
    const { patient_id, condition_key, answers } = req.body;

    if (!patient_id || !condition_key || !answers) {
      return next(
        new ApiError(
          400,
          "Missing required fields: patient_id, condition_key, or answers."
        )
      );
    }

    const result = await processTriageIntakeService({
      patient_id,
      condition_key,
      answers,
    });

    return res.json(
      new ApiResponse(201, result, "Triage evaluation completed successfully.")
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return next(new ApiError(500, "Internal error!!!", [error.message]));
  }
});

export const logTriageOutcome = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { outcome, notes, pharmacist_id } = req.body;

    if (!outcome) {
      return next(new ApiError(400, "Outcome field is required."));
    }

    const result = await logTriageOutcomeService(id, {
      outcome,
      notes,
      pharmacist_id,
    });

    return res.json(
      new ApiResponse(200, result, "Triage outcome logged successfully.")
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return next(new ApiError(500, "Internal error!!!", [error.message]));
  }
});

export const getAllGreenTriageSessions = asyncHandler(
  async (req, res, next) => {
    const tirage = await getAllGreenTriageSessionsService();

    return res.json(
      new ApiResponse(
        200,
        { count: tirage.length, tirage },
        "All triage sessions fetched successfully."
      )
    );
  }
);

export const getTriageByPatientId = asyncHandler(async (req, res, next) => {
  const { id: patientId } = req.params;

  if (!patientId || patientId.trim() === "") {
    throw new ApiError(400, "Patient ID is required.");
  }

  const sessions = await getTriageByPatientIdService(patientId);

  return res.json(
    new ApiResponse(
      200,
      { count: sessions.length, sessions },
      "Patient triage sessions fetched successfully."
    )
  );
});
