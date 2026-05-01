import { PLAN_PRICES, SUBSCRIPTION_STATUS } from "../constants/subscription.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";
import {
  razorpayClient,
  verifyRazorpaySignature,
} from "../services/razorpayService.js";

export const createOrder = async (req, res) => {
  const { planType } = req.body;
  const amount = PLAN_PRICES[planType];

  if (!amount) {
    return res.status(400).json({ message: "Invalid plan selected" });
  }

  if (!razorpayClient) {
    const mockOrderId = `mock_order_${Date.now()}`;
    const payment = await Payment.create({
      userId: req.user._id,
      amount,
      planType,
      status: "created",
      razorpayOrderId: mockOrderId,
    });

    return res.json({
      orderId: mockOrderId,
      amount,
      currency: "INR",
      paymentId: payment._id,
      mockMode: true,
    });
  }

  const order = await razorpayClient.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  const payment = await Payment.create({
    userId: req.user._id,
    amount,
    planType,
    status: "created",
    razorpayOrderId: order.id,
  });

  res.json({
    orderId: order.id,
    amount,
    currency: order.currency,
    paymentId: payment._id,
    mockMode: false,
  });
};

export const verifyPayment = async (req, res) => {
  const {
    planType,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  const payment = await Payment.findOne({
    userId: req.user._id,
    razorpayOrderId,
  });

  if (!payment) {
    return res.status(404).json({ message: "Payment record not found" });
  }

  const isValid =
    razorpayOrderId.startsWith("mock_order_") ||
    verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

  if (!isValid) {
    payment.status = "failed";
    await payment.save();
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  payment.status = "paid";
  payment.planType = planType;
  payment.razorpayPaymentId = razorpayPaymentId;
  payment.razorpaySignature = razorpaySignature;
  await payment.save();

  await User.findByIdAndUpdate(req.user._id, {
    subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
    trialEndDate: null,
    planType,
  });

  res.json({ message: "Payment verified and subscription activated" });
};
