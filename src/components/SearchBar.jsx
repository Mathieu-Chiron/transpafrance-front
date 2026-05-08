import { useState } from "react"

const FILTRES = [
  { id: "depute",    label: "Députés",    icon: "🏛️", type: "fonction" },
  { id: "senateur",  label: "Sénateurs",  icon: "📜", type: "fonction" },
  { id: "maire",     label: "Maires",     icon: "🎖️", type: "fonction" },
  { id: "europeen",  label: "Européens",  icon: "🇪🇺", type: "fonction" },
  { id: "condamne",  label: "Condamnés",  icon: "⚖️", type: "caracteristique" },
  { id: "cumul",     label: "Cumul",      icon: "🗂️", type: "caracteristique" },
]

export default function SearchBar({ onSearch, onFilterChange }) {
  const [input, setInput]   = useState("")
  const [actifs, setActifs] = useState([])

  const toggleFiltre = (id) => {
    const next = actifs.includes(id) ? actifs.filter(x => x !== id) : [...actifs, id]
    setActifs(next)
    onFilterChange?.(next)
  }

  const handleKey = (e) => {
    if (e.key === "Enter") onSearch(input)
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Rechercher un élu... ex: Marine Le Pen"
          style={{
            flex: 1, padding: "10px 14px",
            border: "0.5px solid #ccc", borderRadius: 8,
            fontSize: 15, outline: "none"
          }}
        />
        <button
          onClick={() => onSearch(input)}
          style={{
            padding: "10px 20px", borderRadius: 8,
            border: "0.5px solid #ccc", background: "#fff",
            fontSize: 14, fontWeight: 500, cursor: "pointer"
          }}
        >
          Rechercher
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: 4 }}>Filtres</span>

        {/* Séparateur fonction */}
        <span style={{ fontSize: 10, color: "#bbb", marginRight: 2 }}>Fonction</span>
        {FILTRES.filter(f => f.type === "fonction").map(f => {
          const isActif = actifs.includes(f.id)
          return (
            <span
              key={f.id}
              onClick={() => toggleFiltre(f.id)}
              style={{
                padding: "4px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer",
                border: isActif ? "0.5px solid #378ADD" : "0.5px solid #ddd",
                background: isActif ? "#E6F1FB" : "#fff",
                color: isActif ? "#0C447C" : "#666",
                transition: "all 0.15s"
              }}
            >
              {f.icon} {f.label}
            </span>
          )
        })}

        {/* Séparateur caractéristiques */}
        <span style={{ fontSize: 10, color: "#bbb", marginLeft: 4, marginRight: 2 }}>Caractéristiques</span>
        {FILTRES.filter(f => f.type === "caracteristique").map(f => {
          const isActif = actifs.includes(f.id)
          return (
            <span
              key={f.id}
              onClick={() => toggleFiltre(f.id)}
              style={{
                padding: "4px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer",
                border: isActif ? "0.5px solid #E24B4A" : "0.5px solid #ddd",
                background: isActif ? "#FCEBEB" : "#fff",
                color: isActif ? "#791F1F" : "#666",
                transition: "all 0.15s"
              }}
            >
              {f.icon} {f.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
