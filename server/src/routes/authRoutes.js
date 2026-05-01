import express from "express";
import { login, me, signup } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { refreshTrialStatus } from "../middleware/trialMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, refreshTrialStatus, me);

export default router;
