import { Router } from "express";
import {
  createRegistration,
  getByUuidSchema,
  getRegistration,
  registerSchema,
  searchByEmail,
  searchByEmailSchema,
} from "../controllers/register.controller.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), createRegistration);
router.get("/register/search", validate(searchByEmailSchema), searchByEmail);
router.get("/register/:uuid", validate(getByUuidSchema), getRegistration);

export default router;
