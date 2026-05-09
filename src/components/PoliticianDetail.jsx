import { BORD_COULEUR } from "../bordCouleur"

const TABS = [
  { id: "condamnations", label: "Condamnations" },
  { id: "votes",         label: "Votes" },
  { id: "mandats",       label: "Mandats" },
  { id: "indemnites",    label: "Indemnités" },
  { id: "actualites",    label: "Actualités" },
]

function Initiales({ nom }) {
  const parts = (nom || "?").split(" ")
  const ini = parts.map(p => p[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: 64, height: 64, borderRadius: "50%",
      background: "#E6F1FB", display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 20, fontWeight: 500,
      color: "#185FA5", flexShrink: 0
    }}>{ini}</div>
  )
}

function Badge({ label, type }) {
  const styles = {
    condamne: { background: "#FCEBEB", color: "#791F1F" },
    parti:    { background: "#E6F1FB", color: "#0C447C" },
    cumul:    { background: "#FAEEDA", color: "#633806" },
    default:  { background: "#F1EFE8", color: "#5F5E5A" },
  }
  const s = styles[type] || styles.default
  return (
    <span style={{
      fontSize: 11, padding: "2px 8px", borderRadius: 999,
      background: s.background, color: s.color, display: "inline-block"
    }}>{label}</span>
  )
}

function Condamnation({ texte }) {
  const t = texte.toLowerCase()
  const isDefinitif = t.includes("définitif") || t.includes("cassation") || (!t.includes("appel") && !t.includes("instance") && !t.includes("cours"))
  const isAppel     = t.includes("appel")
  const isInstance  = t.includes("instance") || t.includes("cours")

  let bg, titreColor, detailColor, badgeStyle, badgeLabel
  if (isAppel) {
    bg = "#FCEBEB"; titreColor = "#791F1F"; detailColor = "#A32D2D"
    badgeStyle = { background: "#F7C1C1", color: "#791F1F" }
    badgeLabel = "En appel"
  } else if (isInstance) {
    bg = "#FAEEDA"; titreColor = "#412402"; detailColor = "#854F0B"
    badgeStyle = { background: "#FAC775", color: "#633806" }
    badgeLabel = "1re instance"
  } else {
    bg = "#1a1a1a"; titreColor = "#ffffff"; detailColor = "#aaaaaa"
    badgeStyle = { background: "#333", color: "#fff" }
    badgeLabel = "Définitif"
  }

  return (
    <div style={{ background: bg, borderRadius: 8, padding: "12px 14px", marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: titreColor, marginBottom: 4 }}>
        {texte.split("|")[0]}
      </div>
      <div style={{ fontSize: 12, color: detailColor }}>
        {texte.split("|").slice(1).join(" · ")}
      </div>
      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, display: "inline-block", marginTop: 6, ...badgeStyle }}>
        {badgeLabel}
      </span>
    </div>
  )
}

function VoteRow({ vote }) {
  const isPour = vote.position === "pour"
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: "0.5px solid #eee", gap: 8 }}>
      <div style={{ fontSize: 12, flex: 1, color: "#333" }}>
        {vote.texte || "—"}
        {vote.date && <span style={{ color: "#999", marginLeft: 6 }}>{vote.date}</span>}
      </div>
      <span style={{
        fontSize: 11, padding: "2px 10px", borderRadius: 999, flexShrink: 0,
        background: isPour ? "#EAF3DE" : "#FCEBEB",
        color: isPour ? "#27500A" : "#791F1F"
      }}>
        {vote.position}
      </span>
    </div>
  )
}

export default function PoliticianDetail({ result, activeTab, setActiveTab }) {
  const { resultats } = result
  const id    = resultats.identite
  const _nom  = result.recherche || id?.nom || ""
  const _slug = _nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  const liens = {
    wikipedia:  id?.source  || `https://fr.wikipedia.org/wiki/${_nom.replace(/ /g, "_")}`,
    nosdeputes: `https://www.nosdeputes.fr/${_slug}`,
    hatvp:      `https://www.hatvp.fr/consulter-les-declarations/?s=${encodeURIComponent(_nom)}`,
    casier:     "https://casier-politique.fr",
    ...(resultats.liens || {}),
  }
  const md    = resultats.mandats
  const ap    = resultats.activite_parlementaire
  const co    = resultats.condamnations
  const ac    = resultats.actualites_recentes
  const ind   = resultats.indemnites

  const nbCondamnations = co?.condamnations?.length || 0

  const isEuroDepute = [
    ...(md?.mandats_rne || []),
    ...(md?.mandats_en_cours || []),
    ...(md?.anciens_mandats || []),
    ...(md?.autres_mandats || []),
  ].some(m => {
    const s = (typeof m === "string" ? m : (m?.type || m?.organisme || "")).toLowerCase()
    return s.includes("européen") || s.includes("europeen") || s.includes("parlement eu")
  })

  const hasCumul = md?.cumul_mandats || (md?.nombre_mandats && md.nombre_mandats > 1)

  const icons = [
    nbCondamnations > 0 && { emoji: "⛓️", title: `${nbCondamnations} condamnation${nbCondamnations > 1 ? "s" : ""}` },
    isEuroDepute       && { emoji: "🇪🇺", title: "Député européen" },
  ].filter(Boolean)

  return (
    <div style={{ background: "#fff", border: "0.5px solid #ddd", borderRadius: 12, padding: "1.25rem", marginTop: "1.5rem", position: "relative" }}>

      {hasCumul && (
        <span title="Cumul de mandats" style={{
          position: "absolute", top: "1rem", right: "1rem",
          fontSize: 20, cursor: "default", lineHeight: 1,
        }}>🗂️</span>
      )}

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: "1.25rem", paddingBottom: "1rem", borderBottom: "0.5px solid #eee" }}>
        {id.photo
          ? <img src={id.photo} alt={id.nom} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover" }} />
          : <Initiales nom={id.nom} />
        }
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 500 }}>{id.nom}</span>
            {icons.map((ic, i) => (
              <span key={i} title={ic.title} style={{ fontSize: 18, cursor: "default" }}>{ic.emoji}</span>
            ))}
          </div>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 8 }}>
            {id.naissance && `né(e) le ${id.naissance}`}
            {id.naissance && id.profession && " · "}
            {id.profession}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {id.parti && (
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 999,
                background: "#E6F1FB", color: "#0C447C",
                display: "inline-flex", alignItems: "center", gap: 5,
              }}>
                {id.bord_politique && (
                  <span style={{
                    width: 7, height: 7, borderRadius: "50%", display: "inline-block", flexShrink: 0,
                    background: BORD_COULEUR[id.bord_politique] || "#999",
                  }} />
                )}
                {id.parti}
              </span>
            )}
            {id.groupe_parlementaire && id.groupe_parlementaire !== id.parti && (
              <Badge label={id.groupe_parlementaire} type="parti" />
            )}
            {nbCondamnations > 0 && <Badge label={`${nbCondamnations} condamnation${nbCondamnations > 1 ? "s" : ""}`} type="condamne" />}
            {md?.cumul_mandats && <Badge label="Cumul de mandats" type="cumul" />}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: "1.25rem" }}>
        {[
          { label: "Condamnations", value: nbCondamnations, color: nbCondamnations > 0 ? "#A32D2D" : "#333" },
          { label: "Mandats cumulés", value: md?.nombre_mandats ?? "—", color: "#854F0B" },
          { label: "Parti / Groupe", value: id.parti || id.groupe_parlementaire || "—", color: "#333", small: true },
        ].map(s => (
          <div key={s.label} style={{ background: "#fafaf8", borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: s.small ? 12 : 18, fontWeight: 500, color: s.color, lineHeight: 1.3 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", borderBottom: "0.5px solid #eee", marginBottom: "1.25rem", gap: 0 }}>
        {TABS.map(t => (
          <div
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "8px 14px", fontSize: 13, cursor: "pointer",
              color: activeTab === t.id ? "#1a1a1a" : "#888",
              borderBottom: activeTab === t.id ? "2px solid #378ADD" : "2px solid transparent",
              fontWeight: activeTab === t.id ? 500 : 400,
              marginBottom: -1,
            }}
          >
            {t.label}
            {t.id === "condamnations" && nbCondamnations > 0 &&
              <span style={{ marginLeft: 6, background: "#FCEBEB", color: "#791F1F", fontSize: 10, padding: "1px 6px", borderRadius: 999 }}>
                {nbCondamnations}
              </span>
            }
          </div>
        ))}
      </div>

      {activeTab === "condamnations" && (
        <div>
          {nbCondamnations === 0
            ? <p style={{ fontSize: 13, color: "#999" }}>Aucune condamnation répertoriée sur casier-politique.fr</p>
            : co.condamnations.map((c, i) => <Condamnation key={i} texte={c.description} />)
          }
          <div style={{ fontSize: 11, color: "#bbb", marginTop: 8 }}>Source : <a href={co.source_url} target="_blank" style={{ color: "#999" }}>casier-politique.fr</a></div>
        </div>
      )}

      {activeTab === "votes" && (
        <div>
          {ap?.votes?.length === 0
            ? <p style={{ fontSize: 13, color: "#999" }}>Aucun vote disponible</p>
            : ap?.votes?.map((v, i) => <VoteRow key={i} vote={v} />)
          }
          <div style={{ fontSize: 11, color: "#bbb", marginTop: 8 }}>Source : <a href={ap.source} target="_blank" style={{ color: "#999" }}>nosdeputes.fr</a></div>
        </div>
      )}

      {activeTab === "mandats" && (
        <div>
          {md?.mandats_en_cours?.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#999", marginBottom: 6 }}>En cours</div>
              {md.mandats_en_cours.map((m, i) => (
                <div key={i} style={{ fontSize: 13, padding: "6px 0", borderBottom: "0.5px solid #eee" }}>
                  {m.type || m.organisme} {m.role && `— ${m.role}`}
                  {m.debut && <span style={{ color: "#999", marginLeft: 6, fontSize: 12 }}>depuis {m.debut}</span>}
                </div>
              ))}
            </>
          )}
          {resultats.mandats?.anciens_mandats?.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#999", margin: "12px 0 6px" }}>Historique</div>
              {resultats.mandats.anciens_mandats?.map((m, i) => (
                <div key={i} style={{ fontSize: 13, color: "#555", padding: "4px 0", borderBottom: "0.5px solid #eee" }}>{m}</div>
              ))}
            </>
          )}
          {!md?.mandats_en_cours?.length && !resultats.mandats?.anciens_mandats?.length &&
            <p style={{ fontSize: 13, color: "#999" }}>Aucun mandat disponible</p>
          }
        </div>
      )}

      {activeTab === "indemnites" && (
        <div>
          <p style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
            Les déclarations d'intérêts et de patrimoine sont publiées par la HATVP.
          </p>
          <a href={ind.source} target="_blank" style={{
            display: "inline-block", padding: "8px 16px", borderRadius: 8,
            border: "0.5px solid #ccc", fontSize: 13, color: "#333", textDecoration: "none"
          }}>
            Voir la fiche HATVP
          </a>
        </div>
      )}

      {activeTab === "actualites" && (
        <div>
          {ac?.articles?.length === 0
            ? <p style={{ fontSize: 13, color: "#999" }}>Aucune actualité disponible (NewsAPI requis)</p>
            : ac?.articles?.map((a, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: "0.5px solid #eee" }}>
                <a href={a.url} target="_blank" style={{ fontSize: 13, color: "#1a1a1a", textDecoration: "none", fontWeight: 500 }}>{a.titre}</a>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{a.source} · {a.date}</div>
              </div>
            ))
          }
        </div>
      )}

      <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "0.5px solid #eee", fontSize: 11, color: "#bbb", display: "flex", gap: 12, flexWrap: "wrap" }}>
        <span>Sources :</span>
        {liens.wikipedia  && <a href={liens.wikipedia}  target="_blank" rel="noopener noreferrer" style={{ color: "#378ADD" }}>Wikipedia</a>}
        {liens.nosdeputes && <a href={liens.nosdeputes} target="_blank" rel="noopener noreferrer" style={{ color: "#378ADD" }}>NosDéputés.fr</a>}
        {liens.assemblee  && <a href={liens.assemblee}  target="_blank" rel="noopener noreferrer" style={{ color: "#378ADD" }}>Assemblée nationale</a>}
        {liens.hatvp      && <a href={liens.hatvp}      target="_blank" rel="noopener noreferrer" style={{ color: "#378ADD" }}>HATVP</a>}
        {liens.casier     && <a href={liens.casier}     target="_blank" rel="noopener noreferrer" style={{ color: "#378ADD" }}>Casier Politique</a>}
      </div>
    </div>
  )
}
