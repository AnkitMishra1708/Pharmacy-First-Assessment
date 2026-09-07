import mongoose from "mongoose";

const outcomeDetailsSchema = new mongoose.Schema(
  {
    outcome: {
      type: String,
      enum: ["RESOLVED", "ESCALATED_MID_SESSION"],
      required: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    pharmacist_id: {
      type: String,
      default: "anonymous_pharmacist",
      trim: true,
    },
    logged_at: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const triageSchema = new mongoose.Schema(
  {
    patient_id: {
      type: String,
      required: true,
      trim: true,
    },
    protocol_id: {
      type: String,
      default: null,
      trim: true,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    classification: {
      type: String,
      enum: ["GREEN", "RED"],
      required: true,
    },
    outcome_details: {
      type: outcomeDetailsSchema,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "PENDING",
        "ROUTED_PHARMACIST",
        "ROUTED_DOCTOR",
        "RESOLVED",
        "ESCALATED",
      ],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

export const Triage = mongoose.model("Triage", triageSchema);
