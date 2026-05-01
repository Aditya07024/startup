"use client";

import { useEffect, useState } from "react";

const formatRemaining = (ms) => {
  if (!ms || ms <= 0) {
    return "Trial expired";
  }

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ${hours}h left`;
  }

  return `${hours}h ${minutes}m left`;
};

export function TrialBanner({ user }) {
  const [remainingMs, setRemainingMs] = useState(user.remainingTrialMs || 0);

  useEffect(() => {
    setRemainingMs(user.remainingTrialMs || 0);

    if (!user.trialEndDate) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      const next = new Date(user.trialEndDate).getTime() - Date.now();
      setRemainingMs(Math.max(next, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [user.remainingTrialMs, user.trialEndDate]);

  const expired = user.subscriptionStatus === "expired";
  const content = expired
    ? "Your premium trial has ended. Upgrade to continue using premium AI tools."
    : `Premium trial active: ${formatRemaining(remainingMs)}. All premium features are unlocked.`;

  return (
    <div
      className="card"
      style={{
        padding: 22,
        marginBottom: 20,
        borderColor: expired ? "rgba(177, 93, 100, 0.28)" : "rgba(53, 133, 142, 0.28)",
        background: expired
          ? "linear-gradient(180deg, rgba(255, 241, 238, 0.92), rgba(230, 238, 201, 0.9))"
          : "linear-gradient(180deg, rgba(194, 208, 153, 0.34), rgba(255, 255, 255, 0.82))",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div className="badge" style={{ background: expired ? "rgba(177,93,100,0.12)" : "rgba(53,133,142,0.12)" }}>
            {expired ? "Expired" : "Premium Trial"}
          </div>
          <p style={{ margin: "12px 0 0", color: "var(--muted)", maxWidth: 680 }}>{content}</p>
        </div>
        {expired ? (
          <a className="btn" href="/subscription">Upgrade</a>
        ) : (
          <div className="stat-box" style={{ minWidth: 200 }}>
            <div className="kicker">Trial Clock</div>
            <strong style={{ fontSize: 24 }}>{formatRemaining(remainingMs)}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
