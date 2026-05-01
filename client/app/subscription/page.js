"use client";

import Script from "next/script";
import { useState } from "react";
import { apiRequest } from "../../lib/api";

const plans = [
  { id: "basic", name: "Basic", price: 499 },
  { id: "pro", name: "Pro", price: 999 },
  { id: "premium", name: "Premium", price: 1499 },
];

export default function SubscriptionPage() {
  const [message, setMessage] = useState("");
  const [loadingPlan, setLoadingPlan] = useState("");

  const handleSelect = async (planId) => {
    setLoadingPlan(planId);
    setMessage("");

    try {
      const order = await apiRequest("/payment/create-order", {
        method: "POST",
        body: JSON.stringify({ planType: planId }),
      });

      if (order.mockMode) {
        await apiRequest("/payment/verify", {
          method: "POST",
          body: JSON.stringify({
            planType: planId,
            razorpayOrderId: order.orderId,
            razorpayPaymentId: `mock_payment_${Date.now()}`,
            razorpaySignature: "mock_signature",
          }),
        });

        setMessage("Subscription activated in mock mode.");
        return;
      }

      const Razorpay = window.Razorpay;
      if (!Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      const instance = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount * 100,
        currency: order.currency,
        order_id: order.orderId,
        name: "ViralBoost AI",
        description: `${planId} subscription`,
        handler: async function handler(response) {
          await apiRequest("/payment/verify", {
            method: "POST",
            body: JSON.stringify({
              planType: planId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          setMessage("Subscription activated successfully.");
        },
      });

      instance.open();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingPlan("");
    }
  };

  return (
    <main className="shell" style={{ padding: "40px 0 60px" }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="card surface hero-panel" style={{ marginBottom: 24, textAlign: "center" }}>
        <div className="eyebrow">Upgrade to continue</div>
        <h1 className="section-title">Choose the plan that keeps premium AI unlocked.</h1>
        <p className="section-copy" style={{ maxWidth: 720, margin: "0 auto" }}>Unlock premium AI tools after your free trial ends.</p>
      </div>
      <section className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`card pricing-card${plan.id === "pro" ? " popular" : ""}`}>
            <p style={{ color: "var(--muted)" }}>{plan.name}</p>
            <h2 style={{ fontSize: 44, margin: "8px 0" }}>₹{plan.price}</h2>
            <p style={{ color: "var(--muted)", minHeight: 48 }}>Premium access to all AI content generation features.</p>
            <div className="list" style={{ marginBottom: 18 }}>
              <span>Premium AI content generation</span>
              <span>Full dashboard access</span>
              <span>Upgrade without losing momentum</span>
            </div>
            <button className="btn" onClick={() => handleSelect(plan.id)} disabled={loadingPlan === plan.id}>
              {loadingPlan === plan.id ? "Processing..." : "Choose Plan"}
            </button>
          </div>
        ))}
      </section>
      {message ? <p style={{ textAlign: "center", marginTop: 18, color: "var(--muted)" }}>{message}</p> : null}
    </main>
  );
}
