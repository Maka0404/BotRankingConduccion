const sevColor = { high: "#f87171", medium: "#fbbf24", low: "#34d399" };
const sevIcon  = { high: "⚠️", medium: "⚠️", low: "ℹ️" };

export default function AlertaCard({ alert, onViewDriver }) {
  const { title, driverName, severity, summary, createdAt } = alert;

  return (
    <article style={{ display: "grid", gap: 8 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>{sevIcon[severity] || "⚠️"}</span>
        <strong style={{ fontSize: 14 }}>{title}</strong>
      </div>

      {/* Conductor */}
      <div style={{ fontWeight: 600, fontSize: 13 }}>{driverName}</div>

      {/* Resumen */}
      <p
        style={{ margin: 0, whiteSpace: "pre-line", color: "#4B5563", fontSize: 13 }}
      >
        {summary}
      </p>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <small style={{ color: "#9CA3AF" }}>
          Creada: {new Date(createdAt).toLocaleDateString()}
        </small>

        <button
          onClick={() => onViewDriver?.(alert)}
          style={{
            padding: "6px 10px",
            border: "1px solid #D1D5DB",
            borderRadius: 6,
            background: "#F9FAFB",
          }}
        >
          Ver conductor
        </button>
      </div>

      {/* Indicador visual de severidad */}
      <div
        style={{
          width: 60,
          height: 6,
          borderRadius: 999,
          background: sevColor[severity] || "#9CA3AF",
          opacity: 0.25,
          marginTop: 6,
        }}
      />
    </article>
  );
}
