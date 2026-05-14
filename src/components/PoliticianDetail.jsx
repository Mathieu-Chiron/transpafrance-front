import { useState } from "react"
import { BORD_COULEUR } from "../bordCouleur"
import IndemnitesCard from "./IndemnitesCard"
import ScoreCard from "./ScoreCard"
import VoteHistory from "./VoteHistory"

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#aaa", textTransform: "uppercase", marginBottom: 16 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function MandatCard({ mandat, cumul }) {
  return (
    <div style={{
      background: cumul ? "#fffbf0" : "#f7f9ff",
      border: `1.5px solid ${cumul ? "#fde9b0" : "#e8edf8"}`,
      borderRadius: 14, padding: "14px 18px", marginBottom: 10,
    }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: "#0a0a0a" }}>
        {mandat.type}
        {mandat.departement && <span style={{ fontWeight: 400, color: "#888", marginLeft: 8 }}>— {mandat.departement}</span>}
      </div>
      {mandat.debut && (
        <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
          Depuis le {mandat.debut}
          <span style={{ marginLeft: 10, fontSize: 11, background: "#d4edda", color: "#1a5c2a", padding: "1px 8px", borderRadius: 999 }}>Actif</span>
        </div>
      )}
    </div>
  )
}

function Condamnation({ affaire }) {
  const texte  = affaire.description || ""
  const statut = affaire.statut || ""
  const url    = affaire.url

  const isAppel    = statut === "en appel"     || texte.toLowerCase().includes("appel")
  const isInstance = statut === "1re instance" || texte.toLowerCase().includes("instance")

  let bg, color, badge
  if (isAppel)    { bg = "#fff0f0"; color = "#c0392b"; badge = { bg: "#ffd0d0", color: "#c0392b", label: "En appel" } }
  else if (isInstance) { bg = "#fffbf0"; color = "#7a4a00"; badge = { bg: "#fde9b0", color: "#7a4a00", label: "1re instance" } }
  else            { bg = "#1a1a1a"; color = "#fff";    badge = { bg: "#444",    color: "#fff",    label: "Définitif" } }

  const titre  = texte.split("|")[0]
  const detail = texte.split("|").slice(1).join(" · ")

  return (
    <div style={{ background: bg, borderRadius: 14, padding: "14px 18px", marginBottom: 10 }}>
      {url
        ? <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 500, color, marginBottom: 6, display: "block", textDecoration: "none" }}
             onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
             onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>{titre}</a>
        : <div style={{ fontSize: 14, fontWeight: 500, color, marginBottom: 6 }}>{titre}</div>
      }
      {detail && (
        <div style={{ fontSize: 12, color: isAppel ? "#a00" : isInstance ? "#7a4a00" : "#aaa", marginBottom: 4 }}>{detail}</div>
      )}
      {affaire.resume && (
        <div style={{ fontSize: 13, color: isAppel ? "#c0392b" : isInstance ? "#7a4a00" : "#ddd", lineHeight: 1.5, marginBottom: 8 }}>
          {affaire.resume}
        </div>
      )}
      <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 999, display: "inline-block", background: badge.bg, color: badge.color }}>
        {badge.label}
      </span>
    </div>
  )
}

export default function PoliticianDetail({ result }) {
  const [photoOk, setPhotoOk] = useState(true)
  const { resultats } = result
  const id  = resultats.identite
  const _nom = result.recherche || id?.nom || ""

  const _norm  = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, "").trim()
  const _parts = _norm(_nom).split(/\s+/)
  const _slug  = _parts.join("-")
  const _hatvpSlug = _parts.length >= 2 ? [_parts.slice(1).join("-"), _parts[0]].join("-") : _slug

  const liens = {
    wikipedia:  id?.source  || `https://fr.wikipedia.org/wiki/${_nom.replace(/ /g, "_")}`,
    nosdeputes: `https://www.nosdeputes.fr/${_slug}`,
    hatvp:      `https://www.hatvp.fr/fiche-nominative/?declarant=${_hatvpSlug}`,
    casier:     "https://casier-politique.fr",
    ...(resultats.liens || {}),
  }

  const md  = resultats.mandats
  const ap  = resultats.activite_parlementaire
  const co  = resultats.condamnations
  const ind = resultats.indemnites
  const sc  = resultats.score

  const nbCondamnations = co?.condamnations?.length || 0
  const hasCumul        = md?.cumul_mandats || (md?.nombre_mandats && md.nombre_mandats > 1)
  const scoreVal        = sc?.total ?? null

  const scoreColor = scoreVal === null ? "#aaa"
    : scoreVal >= 70 ? "#27a06b"
    : scoreVal >= 40 ? "#BA7517"
    : "#c0392b"

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "#f7f9ff", border: "1.5px solid #e8edf8", borderRadius: 24, padding: "28px 32px", marginBottom: 32, display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Photo */}
        <div style={{ flexShrink: 0 }}>
          {id.photo && photoOk
            ? <img src={id.photo} alt={id.nom} onError={() => setPhotoOk(false)}
                style={{ width: 113, height: 113, borderRadius: "50%", objectFit: "cover", border: "3px solid #fff", boxShadow: "0 2px 12px rgba(0,35,149,0.1)" }} />
            : <div style={{ width: 113, height: 113, borderRadius: "50%", background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 500, color: "#002395" }}>
                {(_nom || "?").split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase()}
              </div>
          }
        </div>

        {/* Infos */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: "#0a0a0a", margin: 0 }}>{id.nom}</h1>
            {nbCondamnations > 0 && (
              <span style={{ fontSize: 12, padding: "2px 10px", borderRadius: 999, background: "#fff0f0", color: "#c0392b", fontWeight: 500 }}>
                {nbCondamnations} condamnation{nbCondamnations > 1 ? "s" : ""}
              </span>
            )}
            {hasCumul && (
              <span style={{ fontSize: 12, padding: "2px 10px", borderRadius: 999, background: "#fffbf0", color: "#BA7517", fontWeight: 500 }}>
                Cumul de mandats
              </span>
            )}
          </div>

          <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>
            {id.naissance && `Né(e) le ${id.naissance}`}
            {id.naissance && id.profession && " · "}
            {id.profession}
          </div>

          {id.parti && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, padding: "4px 12px", borderRadius: 999, background: "#EEF4FF", color: "#002395" }}>
              {id.bord_politique && (
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: BORD_COULEUR[id.bord_politique] || "#999", flexShrink: 0 }} />
              )}
              {id.parti}
            </span>
          )}
        </div>

      </div>

      {/* Score de transparence — déplié juste sous le hero */}
      {sc && (
        <div style={{ marginBottom: nbCondamnations > 0 ? 0 : 32 }}>
          <ScoreCard score={sc} stats={ap} defaultOpen />
        </div>
      )}

      {/* Affaires judiciaires inline sous le score */}
      {nbCondamnations > 0 && (
        <div style={{ border: "1.5px solid #e8edf8", borderTop: "none", borderRadius: "0 0 16px 16px", padding: "12px 20px 16px", marginBottom: 32, background: "#fff" }}>
          <div style={{ fontSize: 11, letterSpacing: 1.2, color: "#aaa", textTransform: "uppercase", marginBottom: 10 }}>
            Affaires judiciaires
          </div>
          {co.condamnations.map((c, i) => {
            const statut = (c.statut || "").toLowerCase()
            const dot = statut === "en appel"      ? { color: "#7c3aed", label: "Appel" }
                      : statut === "en cassation"  ? { color: "#ea580c", label: "Cassation" }
                      :                              { color: "#1a1a1a", label: "Définitif" }
            const titre = (c.affaire || c.description || "").split("|")[0].replace(/\[.*?\]/g, "").trim()
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", borderBottom: i < co.condamnations.length - 1 ? "0.5px solid #f0f0ee" : "none" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot.color, flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  {c.url
                    ? <a href={c.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#1a1a1a", textDecoration: "none", fontWeight: 500 }}
                         onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                         onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>{titre}</a>
                    : <span style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>{titre}</span>
                  }
                  {c.infraction && <span style={{ fontSize: 11, color: "#aaa", marginLeft: 8 }}>{c.infraction}</span>}
                  {c.resume && <div style={{ fontSize: 12, color: "#666", marginTop: 3, lineHeight: 1.4 }}>{c.resume}</div>}
                </div>
                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: dot.color + "18", color: dot.color, flexShrink: 0, fontWeight: 500 }}>
                  {dot.label}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Mandats */}
      <Section title="Mandats">
        {md?.mandats_rne?.length > 0
          ? md.mandats_rne.map((m, i) => <MandatCard key={i} mandat={m} cumul={md.mandats_rne.length > 1} />)
          : <p style={{ fontSize: 13, color: "#aaa" }}>Aucun mandat en cours disponible</p>
        }
        {md?.anciens_mandats?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, color: "#ccc", marginBottom: 8 }}>Historique</div>
            {md.anciens_mandats.map((m, i) => (
              <div key={i} style={{ fontSize: 13, color: "#666", padding: "6px 0", borderBottom: "0.5px solid #f0f0f0" }}>{m}</div>
            ))}
          </div>
        )}
      </Section>

      {/* Indemnités */}
      <Section title="Indemnités & rémunération">
        <IndemnitesCard indemnites={ind} mandats={md} />
      </Section>

      {/* Condamnations */}
      <Section title={`Affaires judiciaires${nbCondamnations > 0 ? ` (${nbCondamnations})` : ""}`}>
        {nbCondamnations === 0
          ? <p style={{ fontSize: 13, color: "#aaa" }}>Aucune condamnation répertoriée sur casier-politique.fr</p>
          : co.condamnations.map((c, i) => <Condamnation key={i} affaire={c} />)
        }
        <div style={{ fontSize: 11, color: "#ccc", marginTop: 8 }}>
          Source : <a href={liens.casier} target="_blank" rel="noreferrer" style={{ color: "#aaa" }}>casier-politique.fr</a>
        </div>
      </Section>

      {/* Votes */}
      <Section title="Historique des votes">
        <VoteHistory name={_nom} typeMandat={ind?.type_mandat} />
      </Section>

      {/* Sources */}
      <div style={{ paddingTop: 24, borderTop: "1px solid #f0f0f0", fontSize: 11, color: "#ccc", display: "flex", gap: 14, flexWrap: "wrap" }}>
        <span>Sources :</span>
        {liens.wikipedia  && <a href={liens.wikipedia}  target="_blank" rel="noreferrer" style={{ color: "#aaa" }}>Wikipedia</a>}
        {liens.nosdeputes && <a href={liens.nosdeputes} target="_blank" rel="noreferrer" style={{ color: "#aaa" }}>NosDéputés.fr</a>}
        {liens.assemblee  && <a href={liens.assemblee}  target="_blank" rel="noreferrer" style={{ color: "#aaa" }}>Assemblée nationale</a>}
        {liens.hatvp      && <a href={liens.hatvp}      target="_blank" rel="noreferrer" style={{ color: "#aaa" }}>HATVP</a>}
        {liens.casier     && <a href={liens.casier}     target="_blank" rel="noreferrer" style={{ color: "#aaa" }}>Casier Politique</a>}
      </div>

    </div>
  )
}
