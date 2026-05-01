import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { refreshTrialStatus } from "../middleware/trialMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, refreshTrialStatus, createOrder);
router.post("/verify", protect, refreshTrialStatus, verifyPayment);

export default router;
