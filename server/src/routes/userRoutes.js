import express from "express";
import { getProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { refreshTrialStatus } from "../middleware/trialMiddleware.js";

const router = express.Router();

router.get("/profile", protect, refreshTrialStatus, getProfile);

export default router;
