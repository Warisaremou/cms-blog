import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import { corsOptions } from "./config/cors.js";
import { connect } from "./config/database.js";
import { transport } from "./config/email.js";
import { hbsOptions } from "./config/hbs-options.js";
import { swaggerDocument } from "./config/swagger.js";
import authRouter from "./routes/auth.js";
import categoryRouter from "./routes/categories.js";
import commentRouter from "./routes/comments.js";
import indexRouter from "./routes/index.js";
import postRouter from "./routes/posts.js";

const app = express();
connect();

//EMAIL TEMPLATE CONFIG USING HANDLEBARS
transport.use("compile", hbs(hbsOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument, {
		explorer: true,
	})
);

/**
 * ROUTES
 */
app.use("/", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/comments", commentRouter);
app.use("/api/posts", postRouter);

export default app;
