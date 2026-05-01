import { User } from "../models/User.js";
import { signToken } from "../utils/token.js";
import { addDays } from "../utils/date.js";
import {
  SUBSCRIPTION_STATUS,
  TRIAL_DURATION_DAYS,
} from "../constants/subscription.js";
import { computeSubscriptionStatus } from "../middleware/trialMiddleware.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  subscriptionStatus: user.subscriptionStatus,
  trialStartDate: user.trialStartDate,
  trialEndDate: user.trialEndDate,
  planType: user.planType,
});

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const trialStartDate = new Date();
  const user = await User.create({
    name,
    email,
    password,
    subscriptionStatus: SUBSCRIPTION_STATUS.TRIAL,
    trialStartDate,
    trialEndDate: addDays(trialStartDate, TRIAL_DURATION_DAYS),
  });

  res.status(201).json({
    token: signToken(user._id),
    user: sanitizeUser(user),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const nextStatus = computeSubscriptionStatus(user);
  if (user.subscriptionStatus !== nextStatus) {
    user.subscriptionStatus = nextStatus;
    await user.save();
  }

  res.json({
    token: signToken(user._id),
    user: sanitizeUser(user),
  });
};

export const me = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};
