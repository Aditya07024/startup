"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";

export default function AiToolPage() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/ai/generate", {
        method: "POST",
        body: JSON.stringify({ topic }),
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="shell" style={{ padding: "40px 0 60px" }}>
      <div className="split-layout">
        <div className="card surface hero-panel">
          <div className="badge">Premium AI Tool</div>
          <h1 className="section-title" style={{ fontSize: "clamp(34px, 5vw, 58px)" }}>AI Content Generator</h1>
          <p className="section-copy">Enter a topic and generate one hook, one caption, and 10 hashtags.</p>
          <form onSubmit={handleGenerate} className="grid" style={{ marginTop: 20 }}>
            <input className="input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Motivational fitness reel" />
            <button className="btn" type="submit" disabled={loading}>{loading ? "Generating..." : "Generate Content"}</button>
            {error ? (
              <div className="card" style={{ padding: 18, borderColor: "rgba(177,93,100,0.28)" }}>
                <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p>
                {error.includes("Upgrade") ? <a className="btn" style={{ display: "inline-block", marginTop: 12 }} href="/subscription">Upgrade to continue</a> : null}
              </div>
            ) : null}
          </form>
          <div className="stats-grid" style={{ marginTop: 24 }}>
            <div className="stat-box">
              <div className="kicker">Output</div>
              <strong>Hook</strong>
            </div>
            <div className="stat-box">
              <div className="kicker">Output</div>
              <strong>Caption</strong>
            </div>
            <div className="stat-box">
              <div className="kicker">Output</div>
              <strong>10 Tags</strong>
            </div>
          </div>
        </div>

        <div className="grid" style={{ gap: 16 }}>
          <div className="card result-panel">
            <div className="kicker">Hook</div>
            <p style={{ fontSize: 26, fontWeight: 800, margin: "8px 0 0" }}>{result?.hook || "Your hook will appear here."}</p>
          </div>
          <div className="card result-panel">
            <div className="kicker">Caption</div>
            <p style={{ margin: "8px 0 0", color: result?.caption ? "var(--text)" : "var(--muted)", lineHeight: 1.7 }}>
              {result?.caption || "Your caption will appear here after generation."}
            </p>
          </div>
          <div className="card result-panel">
            <div className="kicker">Hashtags</div>
            <p style={{ margin: "8px 0 0", color: result?.hashtags ? "var(--text)" : "var(--muted)", lineHeight: 1.9 }}>
              {Array.isArray(result?.hashtags) ? result.hashtags.join(" ") : "Your hashtag set will appear here after generation."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
