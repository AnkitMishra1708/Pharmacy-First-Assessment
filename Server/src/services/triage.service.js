import { Protocol } from "../models/protocol.model.js";
import { Triage } from "../models/triage.model.js";

export const allConditionService = async () => {
  try {
    const protocols = await Protocol.find(
      {},
      "protocol_id condition_name all_symptoms"
    );

    const conditions = protocols.map((p) => ({
      protocol_id: p.protocol_id,
      display_name: p.condition_name,
      all_symptoms: p.all_symptoms,
    }));

    return conditions;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong.", [error.message]);
  }
};

export const processTriageIntakeService = async (intakeData) => {
  const { patient_id, condition_key, answers } = intakeData;

  const protocol = await Protocol.findOne({ protocol_id: condition_key });

  let classification = "GREEN";
  const { max_temperature_c, red_flag_symptoms } = protocol.escalation_criteria;

  if (answers?.temperature_c > max_temperature_c) {
    classification = "RED";
  }

  if (Array.isArray(answers?.symptoms)) {
    const hasRedFlag = answers.symptoms.some((symptom) =>
      red_flag_symptoms
        .map((rf) => rf.toLowerCase())
        .includes(symptom.toLowerCase())
    );
    if (hasRedFlag) {
      classification = "RED";
    }
  }

  if (condition_key === "cold_cough_v1" && answers?.duration_days > 7) {
    classification = "RED";
  }

  const triage = await Triage.create({
    patient_id,
    answers,
    classification,
    protocol_id: classification === "GREEN" ? protocol.protocol_id : null,
    status: classification === "GREEN" ? "ROUTED_PHARMACIST" : "ROUTED_DOCTOR",
  });

  return {
    session_id: triage._id,
    classification,
    protocol_id: triage.protocol_id,
    condition_name: protocol.condition_name,
    routed_to: classification === "GREEN" ? "Pharmacist" : "Doctor",
    message:
      classification === "GREEN"
        ? "Patient is stable. Routed to partner pharmacist."
        : "Red flag criteria met. Escalating to paid doctor teleconsult.",
  };
};

export const logTriageOutcomeService = async (triageId, outcomeData) => {
  try {
    const { outcome, notes, pharmacist_id } = outcomeData;

    const newStatus = outcome === "RESOLVED" ? "RESOLVED" : "ESCALATED";

    const updatedSession = await Triage.findOneAndUpdate(
      { _id: triageId },
      {
        $set: {
          status: newStatus,
          outcome_details: {
            outcome,
            notes: notes || "",
            pharmacist_id: pharmacist_id || "anonymous_pharmacist",
            logged_at: new Date(),
          },
        },
      },
      { returnDocument: "after" }
    );

    if (!updatedSession) {
      throw new Error("Triage not found.");
    }

    return {
      session_id: updatedSession._id,
      status: updatedSession.status,
      outcome_details: updatedSession.outcome_details,
      message:
        outcome === "RESOLVED"
          ? "Session successfully resolved by pharmacist."
          : "Session escalated mid-session to doctor teleconsult.",
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong.", [error.message]);
  }
};
