import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PoliticianDetail from "./components/PoliticianDetail"
import PoliticiansList from "./components/PoliticiansList"

const API = "https://web-production-6c245.up.railway.app"

const s = {
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 60, background: "#fff", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 10, fontFamily: "system-ui, sans-serif" },
  navLogo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textDecoration: "none" },
  navName: { fontSize: 16, fontWeight: 500, color: "#002395", letterSpacing: "-0.3px" },
  navLinks: { display: "flex", gap: 28 },
  navLink: { fontSize: 14, color: "#555", textDecoration: "none" },
  page: { fontFamily: "system-ui, sans-serif", background: "#fff", minHeight: "100vh" },
  body: { maxWidth: 900, margin: "0 auto", padding: "40px 24px" },
  searchCard: { background: "#f7f9ff", borderRadius: 24, padding: 24, marginBottom: 32, border: "1px solid #e8edf8" },
  searchModes: { display: "flex", gap: 4, marginBottom: 14 },
  searchRow: { display: "flex", gap: 8 },
  searchInput: { flex: 1, padding: "11px 16px", border: "1.5px solid #e8edf8", borderRadius: 14, fontSize: 14, outline: "none", color: "#0a0a0a", background: "#fff" },
  searchGo: { padding: "11px 22px", borderRadius: 14, background: "#002395", color: "#fff", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", whiteSpace: "nowrap" },
}

export default function App() {
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [activeTab, setActiveTab] = useState("condamnations")
  const [mode, setMode]           = useState("nom")
  const [query, setQuery]         = useState("")
  const [postal, setPostal]       = useState("")

  // Résultats code postal
  const [cpResult, setCpResult]   = useState(null)
  const [cpLoading, setCpLoading] = useState(false)

  const searchByName = async (name, pushState = true) => {
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setCpResult(null)
    setActiveTab("condamnations")
    if (pushState) {
      const url = new URL(window.location)
      url.searchParams.set("name", name)
      url.searchParams.delete("cp")
      window.history.pushState({}, "", url)
    }
    try {
      let res  = await fetch(`${API}/politician?name=${encodeURIComponent(name)}`)
      if (!res.ok) throw new Error("Erreur serveur")
      let data = await res.json()
      if (data.cache && (!data.resultats?.liens || !data.resultats?.score)) {
        res  = await fetch(`${API}/politician?name=${encodeURIComponent(name)}&refresh=true`)
        data = await res.json()
      }
      setResult(data)
    } catch {
      setError("Impossible de contacter l'API.")
    } finally {
      setLoading(false)
    }
  }

  const searchByPostal = async (cp, pushState = true) => {
    if (!cp.trim()) return
    setCpLoading(true)
    setError(null)
    setResult(null)
    setCpResult(null)
    if (pushState) {
      const url = new URL(window.location)
      url.searchParams.set("cp", cp)
      url.searchParams.delete("name")
      window.history.pushState({}, "", url)
    }
    try {
      const res  = await fetch(`${API}/elus/code-postal/${cp}`)
      const data = await res.json()
      if (!data.trouve) throw new Error(data.erreur || "Introuvable")
      setCpResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setCpLoading(false)
    }
  }

  const go = () => {
    if (mode === "nom" && query.trim())    searchByName(query.trim())
    if (mode === "postal" && postal.trim()) searchByPostal(postal.trim())
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const name   = params.get("name")
    const cp     = params.get("cp")
    if (name) { setQuery(name);  searchByName(name, false) }
    if (cp)   { setPostal(cp);   setMode("postal"); searchByPostal(cp, false) }
  }, [])

  useEffect(() => {
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search)
      const name   = params.get("name")
      const cp     = params.get("cp")
      if (name) searchByName(name, false)
      else if (cp) searchByPostal(cp, false)
      else { setResult(null); setCpResult(null) }
    }
    window.addEventListener("popstate", handlePop)
    return () => window.removeEventListener("popstate", handlePop)
  }, [])

  return (
    <div style={s.page}>

      {/* Nav */}
      <nav style={s.nav}>
        <Link to="/" style={s.navLogo}>
          <svg width="26" height="26" viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg">
            <polygon points="72,4 124,32 124,112 72,140 20,112 20,32" fill="#002395"/>
            <clipPath id="hx2"><polygon points="72,4 124,32 124,112 72,140 20,112 20,32"/></clipPath>
            <rect x="20" y="4" width="35" height="136" fill="#4a7fd4" clipPath="url(#hx2)" opacity="0.5"/>
            <rect x="55" y="4" width="34" height="136" fill="#fff" clipPath="url(#hx2)" opacity="0.25"/>
            <rect x="89" y="4" width="35" height="136" fill="#ED2939" clipPath="url(#hx2)" opacity="0.45"/>
            <path d="M38,72 Q72,48 106,72 Q72,96 38,72 Z" fill="#fff"/>
            <circle cx="72" cy="72" r="15" fill="#4a7fd4"/>
            <circle cx="72" cy="72" r="7" fill="#001a6e"/>
            <circle cx="77" cy="67" r="3.5" fill="#fff" opacity="0.9"/>
            <path d="M38,72 Q72,48 106,72 Q72,96 38,72 Z" fill="none" stroke="#fff" strokeWidth="2.5"/>
          </svg>
          <span style={s.navName}>TranspaFrance</span>
        </Link>
        <div style={s.navLinks}>
          <span style={s.navLink}>Les élus</span>
          <Link to="/affaires" style={s.navLink}>Affaires judiciaires</Link>
          <Link to="/sources" style={s.navLink}>Sources</Link>
        </div>
        <Link to="/" style={{ fontSize: 13, color: "#555", textDecoration: "none" }}>← Accueil</Link>
      </nav>

      <div style={s.body}>

        {/* Search card */}
        <div style={s.searchCard}>
          <div style={s.searchModes}>
            {[{ id: "nom", label: "Par nom" }, { id: "postal", label: "Par code postal" }].map(t => (
              <div key={t.id} onClick={() => setMode(t.id)} style={{
                fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 999, cursor: "pointer",
                background: mode === t.id ? "#002395" : "transparent",
                color: mode === t.id ? "#fff" : "#888",
                border: mode === t.id ? "1px solid #002395" : "1px solid transparent",
              }}>{t.label}</div>
            ))}
          </div>
          <div style={s.searchRow}>
            {mode === "nom" ? (
              <input style={s.searchInput} value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && go()}
                placeholder="Didier Justice..." />
            ) : (
              <input style={s.searchInput} value={postal}
                onChange={e => setPostal(e.target.value.replace(/\D/g, "").slice(0, 5))}
                onKeyDown={e => e.key === "Enter" && go()}
                placeholder="69, 75, 69001, 13008..." maxLength={5} />
            )}
            <button style={s.searchGo} onClick={go}>Rechercher</button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{ background: "#fff0f0", border: "1px solid #ffd0d0", borderRadius: 12, padding: "12px 16px", color: "#c0392b", fontSize: 14, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {(loading || cpLoading) && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#999", fontSize: 14 }}>
            Recherche en cours…
          </div>
        )}

        {/* Résultat fiche */}
        {result && !loading && (
          <PoliticianDetail result={result} activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {/* Résultats code postal */}
        {cpResult && !cpLoading && (
          <CpResults data={cpResult} onSelect={name => { setMode("nom"); setQuery(name); searchByName(name) }} />
        )}

        {/* Liste par défaut */}
        {!result && !cpResult && !loading && !cpLoading && !error && (
          <PoliticiansList onSelect={name => { setQuery(name); searchByName(name) }} />
        )}

      </div>
    </div>
  )
}

function CpResults({ data, onSelect }) {
  const sections = [
    { label: "Maire",    elus: data.maires },
    { label: "Député",   elus: data.deputes },
    { label: "Sénateur", elus: data.senateurs },
  ].filter(s => s.elus?.length > 0)

  const colors = {
    "Député":   { bg: "#EEF4FF", color: "#002395" },
    "Sénateur": { bg: "#f5f0ff", color: "#4a1a8b" },
    "Maire":    { bg: "#FFF8EE", color: "#BA7517" },
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>
        {data.total} élu{data.total > 1 ? "s" : ""} trouvé{data.total > 1 ? "s" : ""} pour{" "}
        <strong style={{ color: "#0a0a0a" }}>{data.commune || `Département ${data.departement}`}</strong>
        {data.note && <span style={{ color: "#aaa", fontStyle: "italic" }}> — {data.note}</span>}
      </p>
      {sections.map(sec => (
        <div key={sec.label} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: "#aaa", marginBottom: 10, textTransform: "uppercase" }}>
            {sec.label}{sec.elus.length > 1 ? "s" : ""} ({sec.elus.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {sec.elus.map((elu, i) => {
              const c = colors[elu.type_mandat] || { bg: "#f5f5f5", color: "#555" }
              return (
                <div key={i} onClick={() => onSelect(elu.nom)}
                  style={{ background: "#fff", border: "1.5px solid #e8edf8", borderRadius: 14, padding: "10px 16px", cursor: "pointer", minWidth: 160 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f7f9ff"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#0a0a0a", marginBottom: 4 }}>
                    {elu.prenom} {elu.nom_famille}
                  </div>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: c.bg, color: c.color }}>
                    {elu.type_mandat}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
