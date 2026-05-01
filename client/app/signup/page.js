"use client";

import { useState } from "react";
import { apiRequest, storeSession } from "../../lib/api";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await apiRequest("/auth/signup", {
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
            <div className="eyebrow">2-Day Premium Trial</div>
            <h1 className="section-title" style={{ marginTop: 18 }}>Launch with full premium access from day one.</h1>
            <p className="section-copy">Every new signup unlocks the full AI suite automatically for the first 48 hours.</p>
          </div>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="kicker">Includes</div>
              <strong>All Tools</strong>
            </div>
            <div className="stat-box">
              <div className="kicker">After Trial</div>
              <strong>Upgrade Flow</strong>
            </div>
          </div>
        </div>
        <form className="card auth-form" onSubmit={handleSubmit}>
          <div className="badge">Start Free Trial</div>
          <h1 style={{ fontSize: 40, marginBottom: 10 }}>Create your account</h1>
          <p className="section-copy" style={{ marginTop: 0 }}>All premium AI tools unlock immediately for 2 days.</p>
          <div className="grid">
            <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            {error ? <p style={{ color: "var(--danger)", margin: 0 }}>{error}</p> : null}
            <button className="btn" type="submit">Start Free Trial</button>
            <a href="/login" style={{ color: "var(--muted)" }}>Already have an account? Login.</a>
          </div>
        </form>
      </div>
    </main>
  );
}
