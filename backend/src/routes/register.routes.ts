import { Router } from "express";
import {
  createRegistration,
  getByUuidSchema,
  getRegistration,
  registerSchema,
} from "../controllers/register.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), createRegistration);
router.get("/register/:uuid", validate(getByUuidSchema), getRegistration);

export default router;
