import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "5kb" }));
app.use(express.urlencoded({ extended: true, limit: "5kb" }));
app.use(cookieParser());

import { user } from "./routes/user.route.js";
import { triage } from "./routes/triage.route.js";
import { protocol } from "./routes/protocol.route.js";

app.use("/api/v1/user", user);
app.use("/api/v1/triage", triage);
app.use("/api/v1/protocol", protocol);

app.use(errorHandler);

export { app };
