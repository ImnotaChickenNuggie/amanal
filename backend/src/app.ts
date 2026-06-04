import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import registerRoutes from "./routes/register.routes.js";

const app = express();

app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1", registerRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`[AMANAL API] http://localhost:${env.PORT}`);
});
