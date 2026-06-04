import "dotenv/config";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import healthRoutes from "./routes/health.routes.js";
import registerRoutes from "./routes/register.routes.js";

const app = express();

app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

app.use("/api/v1", healthRoutes);
app.use("/api/v1", registerRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`[AMANAL API] http://localhost:${env.PORT}`);
});
