import { useState } from "react"

const MOYENNES = {
  semaines_presence:       3.34,
  hemicycle_interventions: 16.84,
  amendements_proposes:    22.66,
  questions_ecrites:       2.86,
}

const STATUT_COLOR = {
  success: { text: "#27500A", bar: "#3aad5a" },
  warning: { text: "#854F0B", bar: "#e8a020" },
  danger:  { text: "#A32D2D", bar: "#ED2939" },
  normal:  { text: "#002395", bar: "#002395" },
  blue:    { text: "#002395", bar: "#4a7fd4" },
}

function BarreScore({ pct, couleur }) {
  return (
    <div style={{ height: 7, background: "#e8edf8", borderRadius: 999, overflow: "hidden", flex: 1 }}>
      <div style={{ height: "100%", width: `${Math.min(pct || 0, 100)}%`, background: couleur, borderRadius: 999, transition: "width 0.4s ease" }} />
    </div>
  )
}

function CritRow({ label, valeur, unite, moyenne, pct, pts, ptsMax, barColor, textColor, note, disponible }) {
  const indisponible = disponible === false
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "180px 1fr 72px",
      alignItems: "center", gap: 12, padding: "11px 0",
      borderBottom: "0.5px solid #f0f0ee",
      opacity: indisponible ? 0.55 : 1,
    }}>
      <div>
        <div style={{ fontSize: 13, color: "#1a1a1a", marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 11 }}>
          {indisponible ? (
            <span style={{ color: "#b35c00", fontStyle: "italic" }}>En attente — 17e législature</span>
          ) : valeur !== null && valeur !== undefined ? (
            <>
              <span style={{ fontWeight: 600, color: textColor }}>
                {typeof valeur === "number" ? valeur.toFixed(1) : valeur}
                {unite ? ` ${unite}` : ""}
              </span>
              {moyenne !== undefined && (
                <span style={{ color: "#aaa" }}> · moy. {moyenne}</span>
              )}
              {note && (
                <span style={{ color: "#aaa" }}> · {note}</span>
              )}
            </>
          ) : (
            <span style={{ color: "#bbb" }}>Données non disponibles</span>
          )}
        </div>
      </div>
      <BarreScore pct={pct} couleur={barColor} />
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>
          {pts !== null && pts !== undefined ? pts : "—"}
        </div>
        <div style={{ fontSize: 11, color: "#aaa" }}>/ {ptsMax} pts</div>
      </div>
    </div>
  )
}

export default function ScoreCard({ score, stats, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  if (!score) return null

  const { score: val, partiel, details, pts_obtenus, pts_max: ptsMax, periode_moyennes } = score
  const d = details || {}

  const couleurScore = val >= 70 ? "#27500A" : val >= 40 ? "#854F0B" : "#A32D2D"
  const bgScore      = val >= 70 ? "#EAF3DE" : val >= 40 ? "#FAEEDA" : "#FCEBEB"
  const labelScore   = val >= 70 ? "Bonne transparence" : val >= 40 ? "Transparence partielle" : "Transparence insuffisante"

  const sm = stats?.stats_moyennes || {}

  const presencePct  = d.presence?.pct
  const presenceVal  = sm.semaines_presence ?? d.presence?.valeur
  const presenceStat = presencePct >= 60 ? "success" : presencePct >= 30 ? "warning" : "danger"

  const initPct  = d.initiative?.pct
  const initVal  = sm.amendements_proposes ?? d.initiative?.valeur
  const initStat = initPct >= 60 ? "success" : initPct >= 30 ? "warning" : "danger"

  const engPct  = d.engagement?.pct
  const engVal  = sm.hemicycle_interventions ?? d.engagement?.valeur
  const engStat = engPct >= 60 ? "success" : engPct >= 30 ? "warning" : "danger"

  return (
    <div style={{ border: "1.5px solid #e8edf8", borderRadius: 16, overflow: "hidden" }}>
      {/* Header toggle */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", cursor: "pointer",
          background: open ? "#f7f9ff" : "#fff",
          borderBottom: open ? "1.5px solid #e8edf8" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: bgScore, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
            border: `2px solid ${couleurScore}22`,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: couleurScore, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: 10, color: couleurScore, opacity: 0.6 }}>/100</div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0a0a0a", marginBottom: 2 }}>
              Indice de transparence
              {partiel && <span style={{ fontSize: 11, fontWeight: 400, color: "#b35c00", marginLeft: 8, background: "#fdf3e3", padding: "1px 7px", borderRadius: 999 }}>partiel · {pts_obtenus}/{ptsMax} pts</span>}
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: couleurScore }}>{labelScore}</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#aaa" }}>
          {open ? "▲ Réduire" : "▼ Voir le détail"}
        </div>
      </div>

      {open && (
        <div style={{ padding: "4px 20px 16px", background: "#fff" }}>

          <CritRow
            label="Présence"
            valeur={presenceVal}
            unite="sem./mois"
            moyenne={MOYENNES.semaines_presence}
            pct={presencePct}
            pts={d.presence?.pts}
            ptsMax={25}
            barColor={STATUT_COLOR[presenceStat].bar}
            textColor={STATUT_COLOR[presenceStat].text}
            disponible={d.presence?.disponible}
          />

          <CritRow
            label="Initiative législative"
            valeur={initVal}
            unite="amend./mois"
            moyenne={MOYENNES.amendements_proposes}
            pct={initPct}
            pts={d.initiative?.pts}
            ptsMax={20}
            barColor={STATUT_COLOR[initStat].bar}
            textColor={STATUT_COLOR[initStat].text}
            disponible={d.initiative?.disponible}
          />

          <CritRow
            label="Engagement"
            valeur={engVal}
            unite="interv./mois"
            moyenne={MOYENNES.hemicycle_interventions}
            pct={engPct}
            pts={d.engagement?.pts}
            ptsMax={15}
            barColor={STATUT_COLOR[engStat].bar}
            textColor={STATUT_COLOR[engStat].text}
            disponible={d.engagement?.disponible}
          />

          <CritRow
            label="Affaires judiciaires"
            valeur={d.condamnations?.nb === 0 ? "Aucune" : `${d.condamnations?.nb} procédure${d.condamnations?.nb > 1 ? "s" : ""}`}
            note={d.condamnations?.statut === "definitif" ? "dont définitif" : d.condamnations?.statut === "appel" ? "dont en appel" : null}
            pct={d.condamnations?.pts !== undefined ? (d.condamnations.pts / 20) * 100 : 100}
            pts={d.condamnations?.pts}
            ptsMax={20}
            barColor={d.condamnations?.nb === 0 ? STATUT_COLOR.success.bar : STATUT_COLOR.danger.bar}
            textColor={d.condamnations?.nb === 0 ? STATUT_COLOR.success.text : STATUT_COLOR.danger.text}
          />

          <CritRow
            label="Cumul de mandats"
            valeur={d.cumul?.nb_mandats === 1 ? "Mandat unique" : `${d.cumul?.nb_mandats} mandats`}
            pct={d.cumul?.pts !== undefined ? (d.cumul.pts / 10) * 100 : 100}
            pts={d.cumul?.pts}
            ptsMax={10}
            barColor={d.cumul?.statut === "unique" ? STATUT_COLOR.success.bar : STATUT_COLOR.warning.bar}
            textColor={d.cumul?.statut === "unique" ? STATUT_COLOR.success.text : STATUT_COLOR.warning.text}
          />

          {/* HATVP */}
          <div style={{
            display: "grid", gridTemplateColumns: "180px 1fr 72px",
            alignItems: "center", gap: 12, padding: "11px 0",
            borderBottom: "0.5px solid #f0f0ee",
          }}>
            <div>
              <div style={{ fontSize: 13, color: "#1a1a1a", marginBottom: 3 }}>Transparence HATVP</div>
              <div style={{ fontSize: 11 }}>
                <span style={{ fontWeight: 600, color: d.hatvp?.hatvp_ok ? STATUT_COLOR.success.text : STATUT_COLOR.danger.text }}>
                  {d.hatvp?.hatvp_ok ? "Déclaration disponible" : "Non trouvée"}
                </span>
              </div>
            </div>
            <BarreScore pct={d.hatvp?.hatvp_ok ? 100 : 0} couleur={d.hatvp?.hatvp_ok ? STATUT_COLOR.success.bar : STATUT_COLOR.danger.bar} />
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: d.hatvp?.hatvp_ok ? STATUT_COLOR.success.text : STATUT_COLOR.danger.text }}>
                {d.hatvp?.pts}
              </div>
              <div style={{ fontSize: 11, color: "#aaa" }}>/ 10 pts</div>
            </div>
          </div>

          <div style={{ paddingTop: 12 }}>
            <div style={{ background: "#fffbf0", borderRadius: 10, padding: "9px 12px", fontSize: 11, color: "#854F0B", lineHeight: 1.6, border: "0.5px solid #fde9b0" }}>
              {partiel && "⚠️ Score partiel — données d'activité issues de la 16e législature (2022–2024). "}
              Moyennes calculées sur ~580 députés actifs · {periode_moyennes || "16e législature"} · source{" "}
              <a href="https://www.nosdeputes.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#854F0B", fontWeight: 500 }}>NosDéputés.fr</a>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
