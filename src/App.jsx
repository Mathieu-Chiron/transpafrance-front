import { useState, useEffect } from "react"
import SearchBar from "./components/SearchBar"
import PoliticianDetail from "./components/PoliticianDetail"
import PoliticiansList from "./components/PoliticiansList"

export default function App() {
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [activeTab, setActiveTab] = useState("condamnations")
  const [vue, setVue]             = useState("liste")
  const [filtres, setFiltres]     = useState([])

  const search = async (name, pushState = true) => {
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setActiveTab("condamnations")
    setVue("fiche")
    if (pushState) {
      window.history.pushState({name}, "", `?name=${encodeURIComponent(name)}`)
    }
    try {
      const res  = await fetch(`http://localhost:8000/politician?name=${encodeURIComponent(name)}`)
      if (!res.ok) throw new Error("Erreur serveur")
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError("Impossible de contacter l'API. Vérifiez que le serveur FastAPI tourne.")
    } finally {
      setLoading(false)
    }
  }

  // Charge depuis l'URL au démarrage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const name   = params.get("name")
    if (name) search(name, false)
  }, [])

  // Gère le bouton retour du navigateur
  useEffect(() => {
    const onPop = (e) => {
      const params = new URLSearchParams(window.location.search)
      const name   = params.get("name")
      if (name) search(name, false)
      else { setResult(null); setVue("liste") }
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          {/* Tricolore vertical */}
          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#0055A4" }} />
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#DDDDDD" }} />
            <div style={{ width: 4, height: 32, borderRadius: 2, background: "#EF4135" }} />
          </div>
          <div>
            <h1
            onClick={() => { setResult(null); setVue("liste"); window.history.pushState({}, "", "/") }}
            style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.1, cursor: "pointer" }}
          >Transpafrance</h1>
            <p style={{ fontSize: 13, color: "#888", marginTop: 2 }}>Base de données des représentants du peuple français</p>
          </div>
        </div>
      </div>

      {/* Barre de recherche */}
      <SearchBar onSearch={search} onFilterChange={setFiltres} />

      {/* Erreur */}
      {error && (
        <div style={{ background: "#FCEBEB", border: "0.5px solid #E24B4A", borderRadius: 8, padding: "12px 16px", color: "#791F1F", fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          Recherche en cours...
        </div>
      )}

      {/* Vue liste */}
      {vue === "liste" && !loading && (
        <PoliticiansList onSelect={(nom) => search(nom)} filtresActifs={filtres} />
      )}

      {/* Vue fiche */}
      {vue === "fiche" && result && !loading && (
        <PoliticianDetail
          result={result}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  )
}
