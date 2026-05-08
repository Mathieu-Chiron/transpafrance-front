import { useState, useEffect } from "react"
import { BORD_COULEUR, hoverBord } from "../bordCouleur"

const TYPES_MANDAT = [
  { id: "depute",   label: "Députés",   icon: "🏛️" },
  { id: "senateur", label: "Sénateurs", icon: "📜" },
  { id: "maire",    label: "Maires",    icon: "🎖️" },
  { id: "europeen", label: "Européens", icon: "🇪🇺" },
]


const FILTRES_BORD = [
  "Extrême gauche", "Gauche radicale", "Gauche", "Centre gauche",
  "Centre", "Centre droit", "Droite", "Droite nationale", "Extrême droite"
]

const BORD_CARRE = new Set(["Extrême gauche", "Extrême droite"])

function PastilleBord({ bord, size = 9 }) {
  const color = BORD_COULEUR[bord]
  if (!color) return null
  return (
    <span style={{
      display: "inline-block",
      width: size, height: size,
      borderRadius: BORD_CARRE.has(bord) ? 2 : "50%",
      background: color,
      flexShrink: 0,
    }} />
  )
}

function BadgeFonction({ type }) {
  const map = {
    depute:   { icon: "🏛️", label: "Député",    bg: "#EEF4FF", color: "#1a3a6b" },
    senateur: { icon: "📜", label: "Sénateur",  bg: "#F5F0FF", color: "#4a1a8b" },
    maire:    { icon: "🎖️", label: "Maire",     bg: "#FFF8EE", color: "#7a4a00" },
    europeen: { icon: "🇪🇺", label: "Européen", bg: "#EEF9F0", color: "#1a5c2a" },
  }
  const b = map[type] || { icon: "👤", label: type, bg: "#f4f4f2", color: "#555" }
  return (
    <span style={{
      fontSize: 11, padding: "2px 8px", borderRadius: 999,
      background: b.bg, color: b.color, display: "inline-flex", alignItems: "center", gap: 3
    }}>
      {b.icon} {b.label}
    </span>
  )
}

function BadgeCaracteristique({ type, count }) {
  const map = {
    condamne: { icon: "⚖️", bg: "#FCEBEB", color: "#791F1F" },
    cumul:    { icon: "🗂️", bg: "#FAEEDA", color: "#633806" },
    europeen: { icon: "🇪🇺", bg: "#EEF4FF", color: "#1a3a6b" },
  }
  const b = map[type]
  if (!b) return null
  return (
    <span style={{
      fontSize: 11, padding: "2px 8px", borderRadius: 999,
      background: b.bg, color: b.color, display: "inline-flex", alignItems: "center", gap: 3
    }}>
      {b.icon} {type === "condamne" ? `${count} condamnation${count > 1 ? "s" : ""}` : type === "cumul" ? "Cumul" : "Européen"}
    </span>
  )
}

export default function PoliticiansList({ onSelect, filtresActifs = [] }) {
  const [elus, setElus]                     = useState([])
  const [loading, setLoading]               = useState(false)
  const [typeMandat, setTypeMandat]         = useState("depute")
  const [filtreBord, setFiltreBord]         = useState("")
  const [filtreCondamne, setFiltreCondamne] = useState(false)
  const [page, setPage]                     = useState(1)

  const PAGE_SIZE = 50

  // Sync depuis les filtres de la SearchBar
  useEffect(() => {
    const types = ["depute", "senateur", "maire"]
    const type  = filtresActifs.find(f => types.includes(f))
    if (type) setTypeMandat(type)
    setFiltreCondamne(filtresActifs.includes("condamne"))
    setPage(1)
  }, [filtresActifs])

  const charger = async () => {
    setLoading(true)
    try {
      let url = `http://localhost:8000/politicians?type_mandat=${typeMandat}&page=${page}&page_size=${PAGE_SIZE}`
      if (filtreBord) url += `&bord=${encodeURIComponent(filtreBord)}`
      const res  = await fetch(url)
      const data = await res.json()
      setElus(data.elus || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { charger() }, [typeMandat, filtreBord, page])

  const [filtreCumul, setFiltreCumul] = useState(false)

  const elusFiltres = elus
    .filter(e => !filtreCondamne || e.condamne)
    .filter(e => !filtreCumul   || (e.type_mandats || []).length > 1)

  return (
    <div>

      {/* Filtres fonction */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
          Fonction
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TYPES_MANDAT.map(m => (
            <span
              key={m.id}
              className="chip"
              onClick={() => { setTypeMandat(m.id); setPage(1) }}
              style={{
                padding: "6px 14px", borderRadius: 999, fontSize: 13,
                background: typeMandat === m.id ? "#0055A4" : "#f4f4f2",
                color: typeMandat === m.id ? "#fff" : "#555",
                fontWeight: typeMandat === m.id ? 500 : 400,
                display: "inline-flex", alignItems: "center", gap: 5,
              }}
            >
              {m.icon} {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* Filtres caractéristiques */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
          Caractéristiques
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span
            className="chip"
            onClick={() => { setFiltreCondamne(!filtreCondamne); setPage(1) }}
            style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 13,
              background: filtreCondamne ? "#FCEBEB" : "#f4f4f2",
              color: filtreCondamne ? "#791F1F" : "#555",
              border: filtreCondamne ? "0.5px solid #E24B4A" : "0.5px solid transparent",
              display: "inline-flex", alignItems: "center", gap: 5,
              "--hover-bg": "#fde8e8",
            }}
          >
            ⚖️ Condamnés
          </span>
          <span
            className="chip"
            onClick={() => { setFiltreCumul(!filtreCumul); setPage(1) }}
            style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 13,
              background: filtreCumul ? "#FAEEDA" : "#f4f4f2",
              color: filtreCumul ? "#633806" : "#555",
              border: filtreCumul ? "0.5px solid #E8A838" : "0.5px solid transparent",
              display: "inline-flex", alignItems: "center", gap: 5,
              "--hover-bg": "#faeedd",
            }}
          >
            🗂️ Cumul de mandats
          </span>
        </div>
      </div>

      {/* Filtres bord politique */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
          Bord politique
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span
            className="chip"
            onClick={() => { setFiltreBord(""); setPage(1) }}
            style={{
              padding: "4px 12px", borderRadius: 999, fontSize: 12,
              background: !filtreBord ? "#0055A4" : "#f4f4f2",
              color: !filtreBord ? "#fff" : "#555",
            }}
          >
            Tous
          </span>
          {FILTRES_BORD.map(b => (
            <span
              key={b}
              className="chip"
              onClick={() => { setFiltreBord(filtreBord === b ? "" : b); setPage(1) }}
              style={{
                padding: "4px 12px", borderRadius: 999, fontSize: 12,
                background: filtreBord === b ? "#E6F1FB" : "#f4f4f2",
                color: filtreBord === b ? "#0C447C" : "#555",
                border: filtreBord === b ? "0.5px solid #378ADD" : "0.5px solid transparent",
                display: "inline-flex", alignItems: "center", gap: 5,
                "--hover-bg": hoverBord(BORD_COULEUR[b]),
              }}
            >
              <PastilleBord bord={b} size={8} />
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Compteur */}
      <div style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>
        {loading ? "Chargement..." : `${elusFiltres.length} élu${elusFiltres.length > 1 ? "s" : ""} affiché${elusFiltres.length > 1 ? "s" : ""}`}
        {filtreCondamne && <span style={{ color: "#A32D2D", marginLeft: 8 }}>⚖️ filtre condamnés actif</span>}
        {filtreCumul    && <span style={{ color: "#633806", marginLeft: 8 }}>🗂️ filtre cumul actif</span>}
      </div>

      {/* Grille */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10 }}>
        {elusFiltres.map((elu, i) => (
          <div
            key={i}
            onClick={() => onSelect(elu.nom)}
            style={{
              background: "#fff",
              border: elu.condamne ? "0.5px solid #E24B4A" : "0.5px solid #e5e5e5",
              borderLeft: elu.condamne ? "3px solid #E24B4A" : "3px solid transparent",
              borderRadius: 8,
              padding: "10px 12px",
              cursor: "pointer",
              transition: "border-color 0.15s",
            }}
          >
            {/* Nom */}
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
              {elu.prenom} {elu.nom_famille}
            </div>

            {/* Localisation */}
            <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>
              {elu.commune ? `${elu.commune}${elu.departement ? ` (${elu.departement})` : ""}` : elu.departement}
            </div>

            {/* Bord politique */}
            {elu.bord && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "#666", marginBottom: 8 }}>
                <PastilleBord bord={elu.bord} size={8} />
                {elu.bord}
              </div>
            )}

            {/* Badges */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {(elu.type_mandats || [elu.type_mandat]).map(t => (
                <BadgeFonction key={t} type={t} />
              ))}
              {elu.condamne && <BadgeCaracteristique type="condamne" count={elu.nb_condamnations} />}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20 }}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ padding: "6px 14px", borderRadius: 6, border: "0.5px solid #ddd", cursor: "pointer", background: "#fff" }}
        >
          ← Précédent
        </button>
        <span style={{ padding: "6px 14px", fontSize: 13, color: "#666" }}>Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={elusFiltres.length < PAGE_SIZE}
          style={{ padding: "6px 14px", borderRadius: 6, border: "0.5px solid #ddd", cursor: "pointer", background: "#fff" }}
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
