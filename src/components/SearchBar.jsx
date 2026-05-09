import { useState } from "react"

const FILTRES = [
  { id: "depute",   label: "Députés",   icon: "🏛️" },
  { id: "senateur", label: "Sénateurs", icon: "📜" },
  { id: "maire",    label: "Maires",    icon: "🎖️" },
  { id: "europeen", label: "Européens", icon: "🇪🇺" },
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
          placeholder="Recherchez un(e) élu(e)... ex : Alain Tègre"
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
        {FILTRES.map(f => {
          const isActif = actifs.includes(f.id)
          return (
            <span
              key={f.id}
              className="chip"
              onClick={() => toggleFiltre(f.id)}
              style={{
                padding: "4px 12px", borderRadius: 999, fontSize: 12,
                border: isActif ? "0.5px solid #378ADD" : "0.5px solid #ddd",
                background: isActif ? "#E6F1FB" : "#fff",
                color: isActif ? "#0C447C" : "#666",
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
