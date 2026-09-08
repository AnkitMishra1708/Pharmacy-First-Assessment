import { ApiResponse, ApiError, asyncHandler } from "../utils/index.js";
import { getProtocolByIdService } from "../services/protocol.service.js";

export const getProtocolById = asyncHandler(async (req, res, next) => {
  try {
    const { protocolId } = req.body;

    if (!protocolId || protocolId.trim() === "") {
      return next(new ApiError(400, "Protocol ID is required."));
    }

    const protocolDetails = await getProtocolByIdService(protocolId);

    return res.json(
      new ApiResponse(
        200,
        protocolDetails,
        "Protocol steps fetched successfully."
      )
    );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal error!!!", [error.message]));
  }
});
