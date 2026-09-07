import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  allCondition,
  logTriageOutcome,
  triageIntake,
} from "../controllers/triage.controller.js";

const triage = express.Router();

triage.route("/all-condition").get(verifyJwt, allCondition);
triage.route("/intake").post(verifyJwt, triageIntake);
triage.route("/:id/outcome").post(logTriageOutcome);

export { triage };
