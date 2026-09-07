import api from "../lib/axios.js";

export const allConditionApi = () => {
    return api.get("/triage/all-condition");
};

export const intakeApi = (payload) => {
    return api.post("/triage/intake", payload);
};