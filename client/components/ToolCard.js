export function ToolCard({ title, description, href, icon, meta }) {
  return (
    <a
      href={href}
      className="card tool-card"
      style={{ display: "block" }}
    >
      <div className="tool-icon">{icon || "✦"}</div>
      <p style={{ fontSize: 24, fontWeight: 800, margin: "18px 0 10px" }}>{title}</p>
      <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>{description}</p>
      <div style={{ marginTop: 18, color: "var(--accent-2)", fontWeight: 700 }}>
        {meta || "Open tool"} →
      </div>
    </a>
  );
}
