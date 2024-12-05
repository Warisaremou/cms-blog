import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import logger from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import "./config/database.js";
import authRouter from "./routes/auth.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * Routes are defined here.
 */
app.use("/api/auth", authRouter);

export default app;
