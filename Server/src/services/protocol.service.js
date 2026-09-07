import { Protocol } from "../models/protocol.model.js";

export const getProtocolByIdService = async (protocolId) => {
  try {
    const protocol = await Protocol.findOne({ protocol_id: protocolId });

    return {
      protocol_id: protocol.protocol_id,
      condition_name: protocol.condition_name,
      steps: protocol.steps,
      escalation_criteria: protocol.escalation_criteria,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Something went wrong.", [error.message]);
  }
};
