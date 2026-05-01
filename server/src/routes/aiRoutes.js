import express from "express";
import { generateAiContent } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  refreshTrialStatus,
  requireActiveSubscription,
} from "../middleware/trialMiddleware.js";

const router = express.Router();

router.post("/generate", protect, refreshTrialStatus, requireActiveSubscription, generateAiContent);

export default router;
