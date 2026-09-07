import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  register,
  login,
  logoutUser,
  deleteUser,
  getCurrentUser,
  refreshAccessToken,
} from "../controllers/user.controller.js";

const user = express.Router();

user.route("/register").post(register);
user.route("/login").post(login);
user.route("/logout-user").post(verifyJwt, logoutUser);
user.route("/delete-user").post(verifyJwt, deleteUser);
user.route("/get-current-user").get(verifyJwt, getCurrentUser);
user.route("/refresh-access-token").post(refreshAccessToken);

export { user };
