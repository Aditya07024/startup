import { SUBSCRIPTION_STATUS } from "../constants/subscription.js";
import { User } from "../models/User.js";

export const computeSubscriptionStatus = (user) => {
  if (!user.trialEndDate) {
    return SUBSCRIPTION_STATUS.ACTIVE;
  }

  return new Date() > new Date(user.trialEndDate)
    ? SUBSCRIPTION_STATUS.EXPIRED
    : SUBSCRIPTION_STATUS.ACTIVE;
};

export const refreshTrialStatus = async (req, _res, next) => {
  if (!req.user) {
    return next();
  }

  const nextStatus = computeSubscriptionStatus(req.user);

  if (req.user.subscriptionStatus !== nextStatus) {
    req.user.subscriptionStatus = nextStatus;
    await User.findByIdAndUpdate(req.user._id, {
      subscriptionStatus: nextStatus,
    });
  }

  req.user.subscriptionStatus = nextStatus;
  next();
};

export const requireActiveSubscription = (req, res, next) => {
  if (req.user?.subscriptionStatus !== SUBSCRIPTION_STATUS.ACTIVE) {
    return res.status(403).json({
      message: "Upgrade to continue",
      subscriptionStatus: req.user?.subscriptionStatus,
    });
  }

  next();
};
