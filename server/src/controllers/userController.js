import { getRemainingTrialMs } from "../utils/date.js";

export const getProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      subscriptionStatus: req.user.subscriptionStatus,
      trialStartDate: req.user.trialStartDate,
      trialEndDate: req.user.trialEndDate,
      planType: req.user.planType,
      remainingTrialMs: getRemainingTrialMs(req.user.trialEndDate),
    },
  });
};
