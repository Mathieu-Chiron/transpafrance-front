import { useState, useRef } from "react"

const API = "https://web-production-6c245.up.railway.app"

export default function AutocompleteInput({ value, onChange, onSelect, onEnter, style, placeholder }) {
  const [suggestions, setSuggestions] = useState([])
  const [show, setShow]               = useState(false)
  const debounceRef                   = useRef(null)

  const handleChange = (val) => {
    onChange(val)
    setShow(false)
    clearTimeout(debounceRef.current)
    if (val.trim().length < 3) { setSuggestions([]); return }
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`${API}/search?q=${encodeURIComponent(val.trim())}`)
        const data = await res.json()
        setSuggestions(data.resultats || [])
        setShow(true)
      } catch { setSuggestions([]) }
    }, 350)
  }

  const select = (nom) => {
    setSuggestions([])
    setShow(false)
    onSelect(nom)
  }

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <input
        value={value}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") { setShow(false); onEnter?.() } if (e.key === "Escape") setShow(false) }}
        onBlur={() => setTimeout(() => setShow(false), 150)}
        onFocus={() => suggestions.length > 0 && setShow(true)}
        autoComplete="off"
        placeholder={placeholder || "Larcher, Macron..."}
        style={{ ...style, width: "100%", boxSizing: "border-box" }}
      />
      {show && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          background: "#fff", border: "1.5px solid #e8edf8", borderRadius: 14,
          boxShadow: "0 8px 24px rgba(0,35,149,0.1)", zIndex: 100, overflow: "hidden",
        }}>
          {suggestions.map((s, i) => (
            <div key={i} onMouseDown={() => select(s.nom)}
              style={{ padding: "10px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < suggestions.length - 1 ? "0.5px solid #f0f0f0" : "none", background: "#fff" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f7f9ff"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              <span style={{ fontSize: 14, color: "#0a0a0a" }}>{s.nom}</span>
              <span style={{ fontSize: 11, color: "#aaa", marginLeft: 12, whiteSpace: "nowrap" }}>
                {s.type_mandat}{s.departement ? ` · ${s.departement}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
