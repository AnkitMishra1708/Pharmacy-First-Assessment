import "dotenv/config";
import mongoose from "mongoose";
import { Protocol } from "../models/protocol.model.js";

const protocolsData = [
  {
    protocol_id: "cold_cough_v1",
    condition_name: "Cold, Cough & Flu Symptoms",
    all_symptoms: [
      "runny nose",
      "mild cough",
      "sneezing",
      "sore throat",
      "shortness of breath",
      "chest pain",
      "persistent confusion",
      "blood in sputum",
    ],
    escalation_criteria: {
      max_temperature_c: 38.6,
      red_flag_symptoms: [
        "shortness of breath",
        "chest pain",
        "persistent confusion",
        "blood in sputum",
      ],
    },
    steps: [
      {
        step_number: 1,
        title: "Check Duration",
        instruction:
          "Confirm if symptoms have lasted less than 7 days. If longer, escalate to doctor.",
      },
      {
        step_number: 2,
        title: "Evaluate Breathing and Fever",
        instruction: "Check for wheezing or high fever over 38.6°C.",
      },
      {
        step_number: 3,
        title: "OTC Recommendation",
        instruction:
          "Recommend saline nasal drops, warm salt-water gargle, and throat lozenges.",
      },
    ],
  },
  {
    protocol_id: "sore_throat_v1",
    condition_name: "Sore Throat & Painful Swallowing",
    all_symptoms: [
      "scratchy throat",
      "mild pain when swallowing",
      "difficulty swallowing saliva",
      "drooling",
      "muffled voice",
      "white patches on tonsils with high fever",
    ],
    escalation_criteria: {
      max_temperature_c: 38.9,
      red_flag_symptoms: [
        "difficulty swallowing saliva",
        "drooling",
        "muffled voice",
        "white patches on tonsils with high fever",
      ],
    },
    steps: [
      {
        step_number: 1,
        title: "Visual Inspection",
        instruction:
          "Ask patient if they notice any severe swelling, pus, or white exudate on the tonsils.",
      },
      {
        step_number: 2,
        title: "Check Swallowing",
        instruction:
          "Confirm patient can swallow liquids comfortably. Inability to swallow indicates red flag.",
      },
      {
        step_number: 3,
        title: "OTC Recommendation",
        instruction:
          "Suggest antiseptic throat sprays or medicated lozenges and adequate hydration.",
      },
    ],
  },
  {
    protocol_id: "fever_bodyache_v1",
    condition_name: "Fever & General Body Ache",
    all_symptoms: [
      "mild chills",
      "muscle fatigue",
      "low-grade headache",
      "stiff neck",
      "confusion or disorientation",
      "persistent vomiting",
      "difficulty breathing",
    ],
    escalation_criteria: {
      max_temperature_c: 39.0,
      red_flag_symptoms: [
        "stiff neck",
        "confusion or disorientation",
        "persistent vomiting",
        "difficulty breathing",
      ],
    },
    steps: [
      {
        step_number: 1,
        title: "Check Duration & Severity",
        instruction:
          "Assess how many days the fever has lasted and check response to paracetamol.",
      },
      {
        step_number: 2,
        title: "Neurological & Respiratory Check",
        instruction:
          "Screen for neurological signs like a stiff neck or confusion, and check for breathing difficulty.",
      },
      {
        step_number: 3,
        title: "OTC Recommendation",
        instruction:
          "Recommend paracetamol for fever management, oral rehydration solutions, and strict rest.",
      },
    ],
  },
  {
    protocol_id: "skin_irritation_v1",
    condition_name: "Skin Rashes, Itching & Irritation",
    all_symptoms: [
      "mild redness",
      "itching",
      "localized dry skin",
      "blistering over a large area",
      "rapidly spreading redness",
      "signs of infection like pus or warmth",
      "facial swelling",
    ],
    escalation_criteria: {
      max_temperature_c: 37.8,
      red_flag_symptoms: [
        "blistering over a large area",
        "rapidly spreading redness",
        "signs of infection like pus or warmth",
        "facial swelling",
      ],
    },
    steps: [
      {
        step_number: 1,
        title: "Assess Spread and Pain",
        instruction:
          "Check if the rash is localized or spreading fast, and whether it is intensely painful.",
      },
      {
        step_number: 2,
        title: "Allergy History",
        instruction:
          "Ask if a new soap, detergent, or food was introduced recently.",
      },
      {
        step_number: 3,
        title: "OTC Recommendation",
        instruction:
          "Recommend calamine lotion or mild over-the-counter hydrocortisone cream for localized contact dermatitis.",
      },
    ],
  },
  {
    protocol_id: "acid_reflux_v1",
    condition_name: "Heartburn, Indigestion & Acid Reflux",
    all_symptoms: [
      "mild heartburn",
      "sour taste in mouth",
      "bloating after heavy meals",
      "radiating chest pain to jaw or arm",
      "difficulty swallowing food",
      "black or bloody stools",
      "unexplained weight loss",
    ],
    escalation_criteria: {
      max_temperature_c: 37.2,
      red_flag_symptoms: [
        "radiating chest pain to jaw or arm",
        "difficulty swallowing food",
        "black or bloody stools",
        "unexplained weight loss",
      ],
    },
    steps: [
      {
        step_number: 1,
        title: "Rule Out Cardiac Signs",
        instruction:
          "Ensure chest discomfort is a burning sensation rather than pressure or tightness radiating to the arm/jaw.",
      },
      {
        step_number: 2,
        title: "Frequency Check",
        instruction:
          "Confirm if symptoms occur only after heavy/spicy meals and happen less than twice a week.",
      },
      {
        step_number: 3,
        title: "OTC Recommendation",
        instruction:
          "Recommend standard over-the-counter antacids and advise avoiding heavy meals before lying down.",
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is not defined in the environment variables."
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);
    await Protocol.deleteMany({});
    await Protocol.insertMany(protocolsData);
    await mongoose.connection.close();

    console.log("Seed its done bro.");
    process.exit(0);
  } catch (error) {
    console.error("Error while seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
