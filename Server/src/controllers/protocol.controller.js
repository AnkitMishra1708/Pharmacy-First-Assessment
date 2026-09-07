import { ApiResponse, ApiError, asyncHandler } from "../utils/index.js";
import { getProtocolByIdService } from "../services/protocol.service.js";

export const getProtocolById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || id.trim() === "") {
      return next(new ApiError(400, "Protocol ID is required."));
    }

    const protocolDetails = await getProtocolByIdService(id);

    return res.json(
      new ApiResponse(
        200,
        protocolDetails,
        "Protocol steps fetched successfully."
      )
    );
  } catch (error) {
    return next(new ApiError(500, "Internal error!!!", [error.message]));
  }
});
