import express from "express";
import { getProtocolById } from "../controllers/protocol.controller.js";

const protocol = express.Router();

protocol.route("/triageApproved/:id").get(getProtocolById);

export { protocol };
    