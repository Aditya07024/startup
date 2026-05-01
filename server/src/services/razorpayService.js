import crypto from "crypto";
import Razorpay from "razorpay";
import { env } from "../config/env.js";

export const razorpayClient =
  env.razorpayKeyId && env.razorpayKeySecret
    ? new Razorpay({
        key_id: env.razorpayKeyId,
        key_secret: env.razorpayKeySecret,
      })
    : null;

export const verifyRazorpaySignature = ({
  orderId,
  paymentId,
  signature,
}) => {
  const expected = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expected === signature;
};
