import mongoose from "mongoose";

const stepSchema = new mongoose.Schema(
  {
    step_number: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instruction: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const escalationCriteriaSchema = new mongoose.Schema(
  {
    max_temperature_c: {
      type: Number,
      required: true,
    },
    red_flag_symptoms: {
      type: [String],
      required: true,
    },
  },
  { _id: false }
);

const protocolSchema = new mongoose.Schema(
  {
    protocol_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    condition_name: {
      type: String,
      required: true,
      trim: true,
    },
    all_symptoms: {
      type: [String],
      required: true,
    },
    escalation_criteria: {
      type: escalationCriteriaSchema,
      required: true,
    },
    steps: {
      type: [stepSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Protocol = mongoose.model("Protocol", protocolSchema);
