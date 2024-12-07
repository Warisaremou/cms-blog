import cookieParser from "cookie-parser";
// import "dotenv/config";
import express from "express";
import logger from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connect } from "./config/database.js";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";
import categoryRouter from "./routes/categories.js";

const app = express();
connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 * ROUTES
 */
app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);

export default app;
