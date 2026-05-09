import { useState } from "react"
import SearchBar from "./components/SearchBar"
import PoliticianDetail from "./components/PoliticianDetail"
import PoliticiansList from "./components/PoliticiansList"
import Sources from "./components/Sources"

export default function App() {
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [activeTab, setActiveTab] = useState("condamnations")
  const [vue, setVue]             = useState("liste")

  const search = async (name) => {
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setActiveTab("condamnations")
    setVue("fiche")
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

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>

      {/* Header + navbar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>TranspaFrance</h1>
          <p style={{ fontSize: 14, color: "#666" }}>Base de données indépendante des représentants du peuple français</p>
        </div>
        <span
          onClick={() => {
            const next = vue === "sources" ? "liste" : "sources"
            setVue(next)
            window.history.pushState({}, "", next === "sources" ? "/sources" : "/")
          }}
          style={{
            padding: "8px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer",
            background: vue === "sources" ? "#1a1a1a" : "#f0f0ee",
            color: vue === "sources" ? "#fff" : "#555",
            fontWeight: 500, border: "0.5px solid #ddd",
            whiteSpace: "nowrap",
          }}
        >
          🔍 Sources
        </span>
      </div>

      {/* Barre de recherche */}
      <SearchBar onSearch={search} />

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

      {/* Vues */}
      {vue === "liste" && !loading && (
        <PoliticiansList onSelect={(nom) => search(nom)} />
      )}

      {vue === "fiche" && result && !loading && (
        <PoliticianDetail
          result={result}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {vue === "sources" && (
        <Sources />
      )}

    </div>
  )
}
