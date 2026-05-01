"use client";

import { useState } from "react";
import { apiRequest, storeSession } from "../../lib/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      storeSession(data);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="shell auth-shell">
      <div className="auth-layout">
        <div className="card auth-visual hero-panel">
          <div>
            <div className="eyebrow">ViralBoost AI</div>
            <h1 className="section-title" style={{ marginTop: 18 }}>Step back into your premium content workspace.</h1>
            <p className="section-copy">Pick up where you left off with AI tools for hooks, captions, and hashtags.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="kicker">Trial Engine</div>
              <strong>2 Days</strong>
            </div>
            <div className="stat-box">
              <div className="kicker">AI Output</div>
              <strong>1 + 1 + 10</strong>
            </div>
          </div>
        </div>
        <form className="card auth-form" onSubmit={handleSubmit}>
          <div className="badge">Login</div>
          <h1 style={{ fontSize: 40, marginBottom: 10 }}>Welcome back</h1>
          <p className="section-copy" style={{ marginTop: 0 }}>Enter your email and password to continue.</p>
          <div className="grid">
            <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            {error ? <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p> : null}
            <button className="btn" type="submit">Login</button>
            <a href="/signup" style={{ color: "var(--muted)" }}>Need an account? Start your free trial.</a>
          </div>
        </form>
      </div>
    </main>
  );
}
