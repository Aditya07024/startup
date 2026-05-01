"use client";

import { useEffect, useState } from "react";
import { apiRequest, clearSession } from "../../lib/api";
import { TrialBanner } from "../../components/TrialBanner";
import { ToolCard } from "../../components/ToolCard";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest("/user/profile");
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, []);

  if (error) {
    return (
      <main className="shell" style={{ padding: "60px 0" }}>
        <div className="card" style={{ padding: 28 }}>
          <p>{error}</p>
          <a className="btn" href="/login">Login</a>
        </div>
      </main>
    );
  }

  if (!user) {
    return <main className="shell" style={{ padding: "60px 0" }}><p>Loading dashboard...</p></main>;
  }

  return (
    <main className="shell" style={{ padding: "28px 0 64px" }}>
      <div className="card surface hero-panel" style={{ marginBottom: 20 }}>
        <div className="nav-row">
          <div>
            <div className="badge">{user.subscriptionStatus === "expired" ? "Upgrade Required" : "Premium Access"}</div>
            <h1 className="section-title" style={{ fontSize: "clamp(34px, 5vw, 58px)", marginBottom: 10 }}>
              Welcome back, {user.name}
            </h1>
            <p className="section-copy" style={{ maxWidth: 620, margin: 0 }}>
              Generate hooks, captions, and hashtags with premium AI tools built for fast growth loops.
            </p>
          </div>
          <button
            className="btn secondary"
            onClick={() => {
              clearSession();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
        <div className="stats-grid" style={{ marginTop: 24 }}>
          <div className="stat-box">
            <div className="kicker">Status</div>
            <strong>{user.subscriptionStatus}</strong>
          </div>
          <div className="stat-box">
            <div className="kicker">Current Plan</div>
            <strong>{user.planType || "Trial"}</strong>
          </div>
          <div className="stat-box">
            <div className="kicker">AI Stack</div>
            <strong>3 tools</strong>
          </div>
          <div className="stat-box">
            <div className="kicker">Conversion Path</div>
            <strong>Upgrade Ready</strong>
          </div>
        </div>
      </div>

      <TrialBanner user={user} />

      <section className="tool-grid">
        <ToolCard title="Caption Generator" description="Write polished captions tailored to your topic." href="/ai-tool" icon="⚡" meta="Write a better caption" />
        <ToolCard title="Hashtag Generator" description="Get 10 targeted hashtags to expand discovery." href="/ai-tool" icon="#" meta="Build reach tags" />
        <ToolCard title="Content Generator" description="Generate a hook, caption, and hashtags in one request." href="/ai-tool" icon="✦" meta="Run full content pack" />
      </section>

      <section className="split-layout" style={{ marginTop: 22 }}>
        <div className="card surface">
          <div className="kicker">Growth Board</div>
          <h2 style={{ fontSize: 30, margin: "10px 0 12px" }}>Premium feature access is enforced server-side.</h2>
          <p className="section-copy" style={{ marginTop: 0 }}>
            Trial expiry is checked on authenticated requests, premium generation is blocked automatically after the countdown ends, and the upgrade route stays visible throughout the funnel.
          </p>
          <div className="list">
            <span>AI route protected by subscription middleware</span>
            <span>Trial countdown banner updates in real time</span>
            <span>Upgrade path stays one click away</span>
          </div>
        </div>
        <div className="card surface" style={{ background: "linear-gradient(180deg, rgba(53, 133, 142, 0.18), rgba(255, 255, 255, 0.82))" }}>
          <div className="kicker">Next Move</div>
          <h2 style={{ fontSize: 30, margin: "10px 0 12px" }}>Turn today’s topic into a publishable post.</h2>
          <p className="section-copy">
            Open the AI tool, enter a topic, and generate a hook, a caption, and a 10-hashtag set in one request.
          </p>
          <div style={{ marginTop: 20 }}>
            <a className="btn" href="/ai-tool">Open AI Tool</a>
          </div>
        </div>
      </section>
    </main>
  );
}
