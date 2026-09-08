import api from "../lib/axios.js";

export const allConditionApi = () => {
    return api.get("/triage/all-condition");
};

export const intakeApi = (payload) => {
    return api.post("/triage/intake", payload);
};

export const getAllTriageApi = () => {
    return api.get("/triage/sessions");
}

export const fetchProtocolsApi = (payload) => {
    return api.post("/protocol/triageApproved", payload);
}

export const logTriageOutcomeApi = (triageId, payload) => {
    return api.post(`/triage/${triageId}/outcome`, payload);
};

export const getTriageByPatientIdApi = (id) => {
    return api.get(`/triage/patient/${id}`);
}