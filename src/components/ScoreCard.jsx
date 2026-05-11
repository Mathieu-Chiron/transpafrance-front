import { useState } from "react"

export default function ScoreCard({ score }) {
  if (!score) return null

  const { score: total, pts_obtenus, pts_max, partiel, details, explication, source_moyennes, periode_moyennes } = score

  const scoreColor = total >= 70 ? "#1a7a3c" : total >= 40 ? "#b35c00" : "#c0392b"
  const scoreBg    = total >= 70 ? "#e6f4ec" : total >= 40 ? "#fdf3e3" : "#fdecea"

  const ICONS = {
    presence:      "🏛️",
    initiative:    "📜",
    engagement:    "🎤",
    condamnations: "⚖️",
    cumul:         "🔗",
    hatvp:         "📋",
  }

  const STATUT_COND = {
    aucune:   { label: "Aucune condamnation", color: "#1a7a3c", bg: "#e6f4ec" },
    definitif: { label: "Condamnation définitive", color: "#791F1F", bg: "#FCEBEB" },
    appel:    { label: "En appel", color: "#7a4a00", bg: "#fdf3e3" },
    instance: { label: "En 1re instance", color: "#b35c00", bg: "#fdf3e3" },
  }

  const STATUT_CUMUL = {
    unique:   "Mandat unique",
    double:   "Double mandat",
    multiple: "Triple mandat ou plus",
  }

  const [showExplication, setShowExplication] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Score global */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20,
        background: scoreBg, borderRadius: 12, padding: "20px 24px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: scoreColor, lineHeight: 1 }}>{total}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>/100</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>
            Score de Transparence
            {partiel && <span style={{ fontSize: 11, background: "#f0f0ee", color: "#888", padding: "2px 7px", borderRadius: 999, marginLeft: 8, fontWeight: 400 }}>Partiel</span>}
          </div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
            {pts_obtenus} pts obtenus sur {pts_max} pts disponibles
          </div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 6 }}>{periode_moyennes}</div>
        </div>
      </div>

      {/* Détails par critère */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.entries(details).map(([key, d]) => {
          const icon = ICONS[key] || "•"
          const hasPct = d.pct != null

          let rightContent = null
          if (key === "condamnations") {
            const s = STATUT_COND[d.statut] || STATUT_COND.aucune
            rightContent = (
              <span style={{ fontSize: 11, background: s.bg, color: s.color, padding: "2px 8px", borderRadius: 999 }}>
                {s.label}
              </span>
            )
          } else if (key === "cumul") {
            rightContent = (
              <span style={{ fontSize: 11, color: "#666" }}>
                {STATUT_CUMUL[d.statut] || d.statut} ({d.nb_mandats})
              </span>
            )
          } else if (key === "hatvp") {
            rightContent = d.hatvp_ok && d.url ? (
              <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#1a7a3c", textDecoration: "underline" }}>
                Déclaration trouvée
              </a>
            ) : (
              <span style={{ fontSize: 11, color: "#c0392b" }}>Non trouvée</span>
            )
          } else if (hasPct) {
            rightContent = (
              <span style={{ fontSize: 11, color: "#666" }}>
                {d.valeur} {d.unite} (moy. {d.moyenne_nat})
              </span>
            )
          }

          const ptsColor = d.pts === d.pts_max ? "#1a7a3c" : d.pts > 0 ? "#b35c00" : "#c0392b"

          return (
            <div key={key} style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#fafaf8", borderRadius: 8, padding: "10px 14px",
              border: "0.5px solid #eee",
            }}>
              <span style={{ fontSize: 16, width: 22, textAlign: "center" }}>{icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{d.label}</div>
                {rightContent && <div style={{ marginTop: 2 }}>{rightContent}</div>}
              </div>
              {hasPct && (
                <div style={{ width: 80, height: 5, background: "#e8e8e4", borderRadius: 99, flexShrink: 0 }}>
                  <div style={{
                    width: `${Math.min(d.pct, 100)}%`, height: "100%",
                    background: scoreColor, borderRadius: 99, transition: "width 0.4s"
                  }} />
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: ptsColor, minWidth: 42, textAlign: "right" }}>
                {d.pts ?? "—"}/{d.pts_max}
              </div>
            </div>
          )
        })}
      </div>

      {/* Explication */}
      <div>
        <button
          onClick={() => setShowExplication(v => !v)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 12, color: "#888", padding: 0, display: "flex", alignItems: "center", gap: 4,
          }}
        >
          {showExplication ? "▲" : "▼"} Méthodologie
        </button>
        {showExplication && (
          <pre style={{
            marginTop: 10, fontSize: 11, color: "#555", background: "#f7f7f5",
            borderRadius: 8, padding: "12px 14px", whiteSpace: "pre-wrap",
            fontFamily: "system-ui, sans-serif", lineHeight: 1.6, border: "0.5px solid #eee",
          }}>
            {explication}
            {"\n\nSource des moyennes : " + source_moyennes}
          </pre>
        )}
      </div>

    </div>
  )
}
