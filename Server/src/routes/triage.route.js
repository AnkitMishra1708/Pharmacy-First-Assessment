import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  allCondition,
  getAllGreenTriageSessions,
  logTriageOutcome,
  triageIntake,
  getTriageByPatientId,
} from "../controllers/triage.controller.js";

const triage = express.Router();

triage.route("/all-condition").get(verifyJwt, allCondition);
triage.route("/intake").post(verifyJwt, triageIntake);
triage.route("/:id/outcome").post(logTriageOutcome);
triage.route("/sessions").get(getAllGreenTriageSessions);
triage.route("/patient/:id").get(getTriageByPatientId);

export { triage };
