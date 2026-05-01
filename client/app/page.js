export default function LandingPage() {
  const features = [
    { title: "Caption Generator", copy: "Turn a raw idea into a polished post in seconds." },
    { title: "Hashtag Engine", copy: "Get discovery-focused tags tuned for reach and relevance." },
    { title: "Content Lab", copy: "Generate hook, caption, and hashtags in a single pass." },
    { title: "Premium Trial", copy: "Every new account unlocks everything for 2 full days." },
  ];

  return (
    <main style={{ padding: "26px 0 72px" }}>
      <section className="shell">
        <div className="card hero-panel surface" style={{ overflow: "hidden" }}>
          <div className="nav-row" style={{ marginBottom: 24 }}>
            <div className="eyebrow">ViralBoost AI</div>
            <div className="pill-row">
              <a className="btn ghost" href="/login">Login</a>
              <a className="btn" href="/signup">Start Free Trial</a>
            </div>
          </div>
          <div className="split-layout" style={{ alignItems: "center" }}>
            <div>
              <div className="badge">Premium AI Suite</div>
              <h1 className="section-title">
                Viral social content with a premium trial that starts the moment users sign up.
              </h1>
              <p className="section-copy" style={{ maxWidth: 610 }}>
                Hooks, captions, and hashtags in seconds. New users get full premium access automatically for 2 days after signup.
              </p>
              <div style={{ display: "flex", gap: 14, marginTop: 28, flexWrap: "wrap" }}>
                <a className="btn" href="/signup">Start Free Trial</a>
                <a className="btn secondary" href="/subscription">View Plans</a>
              </div>
              <div className="stats-grid" style={{ marginTop: 30 }}>
                <div className="stat-box">
                  <div className="kicker">Trial Window</div>
                  <strong>48h</strong>
                </div>
                <div className="stat-box">
                  <div className="kicker">Output Pack</div>
                  <strong>1 + 1 + 10</strong>
                </div>
                <div className="stat-box">
                  <div className="kicker">Plans</div>
                  <strong>₹499+</strong>
                </div>
              </div>
            </div>
            <div className="card surface" style={{ background: "linear-gradient(180deg, rgba(125, 167, 140, 0.24), rgba(255, 255, 255, 0.86))" }}>
              <div style={{ display: "grid", gap: 14 }}>
                <div className="card" style={{ padding: 18, borderRadius: 22 }}>
                  <div className="kicker">Live Preview</div>
                  <p style={{ fontSize: 24, fontWeight: 800, margin: "8px 0 14px" }}>Content cockpit built to convert trial users.</p>
                  <div className="list">
                    <span>Premium AI tools unlocked during trial</span>
                    <span>Server-side access checks on every request</span>
                    <span>Instant upgrade path after expiry</span>
                  </div>
                </div>
                <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                  {features.map((item, index) => (
                    <div key={item.title} className="card" style={{ padding: 16, borderRadius: 22 }}>
                      <div className="kicker">0{index + 1}</div>
                      <div style={{ fontWeight: 800, margin: "8px 0 6px" }}>{item.title}</div>
                      <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{item.copy}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tool-grid" style={{ marginTop: 24 }}>
          {[
            { icon: "⚡", title: "Caption Generator", description: "Write polished captions with a sharper emotional angle.", meta: "Launch captions" },
            { icon: "#", title: "Hashtag Generator", description: "Generate 10 reach-oriented hashtags for every post idea.", meta: "Build hashtag set" },
            { icon: "✦", title: "Content Generator", description: "Create the full content pack from a single topic prompt.", meta: "Generate content" },
          ].map((feature) => (
            <div key={feature.title} className="card tool-card">
              <div className="tool-icon">{feature.icon}</div>
              <p style={{ fontSize: 24, fontWeight: 800, margin: "18px 0 10px" }}>{feature.title}</p>
              <p style={{ color: "var(--muted)", margin: 0, lineHeight: 1.7 }}>{feature.description}</p>
              <div style={{ marginTop: 18, color: "var(--accent-2)", fontWeight: 700 }}>{feature.meta}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
