import { useState, useEffect } from "react"

const TYPES_MANDAT = [
  { id: "depute",   label: "Députés",   icon: "🏛️" },
  { id: "senateur", label: "Sénateurs", icon: "📜" },
  { id: "maire",    label: "Maires",    icon: "🎖️" },
]

const FILTRES_BORD = [
  "Gauche radicale", "Gauche", "Centre gauche",
  "Centre", "Centre droit", "Droite", "Extrême droite"
]

function BadgeFonction({ type }) {
  const map = {
    depute:   { icon: "🏛️", label: "Député",   bg: "#EEF4FF", color: "#1a3a6b" },
    senateur: { icon: "📜", label: "Sénateur", bg: "#F5F0FF", color: "#4a1a8b" },
    maire:    { icon: "🎖️", label: "Maire",    bg: "#FFF8EE", color: "#7a4a00" },
  }
  const b = map[type] || { icon: "👤", label: type, bg: "#f0f0ee", color: "#555" }
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

export default function PoliticiansList({ onSelect }) {
  const [elus, setElus]                     = useState([])
  const [loading, setLoading]               = useState(false)
  const [typeMandat, setTypeMandat]         = useState("depute")
  const [filtreBord, setFiltreBord]         = useState("")
  const [filtreCondamne, setFiltreCondamne] = useState(false)
  const [page, setPage]                     = useState(1)

  const PAGE_SIZE = 50

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

  const elusFiltres = filtreCondamne ? elus.filter(e => e.condamne) : elus

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
              onClick={() => { setTypeMandat(m.id); setPage(1) }}
              style={{
                padding: "6px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
                background: typeMandat === m.id ? "#1a1a1a" : "#f0f0ee",
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
            onClick={() => setFiltreCondamne(!filtreCondamne)}
            style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
              background: filtreCondamne ? "#FCEBEB" : "#f0f0ee",
              color: filtreCondamne ? "#791F1F" : "#555",
              border: filtreCondamne ? "0.5px solid #E24B4A" : "0.5px solid transparent",
              display: "inline-flex", alignItems: "center", gap: 5,
            }}
          >
            ⚖️ Condamnés
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
            onClick={() => setFiltreBord("")}
            style={{
              padding: "4px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer",
              background: !filtreBord ? "#1a1a1a" : "#f0f0ee",
              color: !filtreBord ? "#fff" : "#555",
            }}
          >
            Tous
          </span>
          {FILTRES_BORD.map(b => (
            <span
              key={b}
              onClick={() => setFiltreBord(filtreBord === b ? "" : b)}
              style={{
                padding: "4px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer",
                background: filtreBord === b ? "#E6F1FB" : "#f0f0ee",
                color: filtreBord === b ? "#0C447C" : "#555",
                border: filtreBord === b ? "0.5px solid #378ADD" : "0.5px solid transparent",
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Compteur */}
      <div style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>
        {loading ? "Chargement..." : `${elusFiltres.length} élu${elusFiltres.length > 1 ? "s" : ""} affiché${elusFiltres.length > 1 ? "s" : ""}`}
        {filtreCondamne && <span style={{ color: "#A32D2D", marginLeft: 8 }}>⚖️ filtre condamnés actif</span>}
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

            {/* Département */}
            <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>
              {elu.departement}
              {elu.bord && <span style={{ marginLeft: 6 }}>· {elu.bord}</span>}
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              <BadgeFonction type={elu.type_mandat} />
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
