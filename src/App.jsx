import { useState, useEffect } from "react"
import SearchBar from "./components/SearchBar"
import PoliticianDetail from "./components/PoliticianDetail"
import PoliticiansList from "./components/PoliticiansList"
import Sources from "./components/Sources"
import Header from "./components/Header"

export default function App() {
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [activeTab, setActiveTab] = useState("condamnations")
  const [vue, setVue]             = useState("liste")

  const search = async (name, pushState = true) => {
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setActiveTab("condamnations")
    setVue("fiche")

    // Met à jour l'URL
    if (pushState) {
      const url = new URL(window.location)
      url.searchParams.set("name", name)
      window.history.pushState({}, "", url)
    }

    try {
      let res  = await fetch(`https://web-production-6c245.up.railway.app/politician?name=${encodeURIComponent(name)}`)
      if (!res.ok) throw new Error("Erreur serveur")
      let data = await res.json()
      // Si la réponse vient du cache ancien (sans liens), on force un refresh
      if (data.cache && !data.resultats?.liens) {
        res  = await fetch(`https://web-production-6c245.up.railway.app/politician?name=${encodeURIComponent(name)}&refresh=true`)
        data = await res.json()
      }
      setResult(data)
    } catch (e) {
      setError("Impossible de contacter l'API. Vérifiez que le serveur FastAPI tourne.")
    } finally {
      setLoading(false)
    }
  }

  // Lecture de l'URL au chargement
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const name   = params.get("name")
    if (name) {
      search(name, false)
    }
  }, [])

  // Gestion du bouton retour navigateur
  useEffect(() => {
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search)
      const name   = params.get("name")
      if (name) {
        search(name, false)
      } else {
        setResult(null)
        setVue("liste")
      }
    }
    window.addEventListener("popstate", handlePop)
    return () => window.removeEventListener("popstate", handlePop)
  }, [])

  const TABS = [
    { id: "liste",   label: "🏛️ Élus" },
    { id: "fiche",   label: result ? `📋 ${result.recherche}` : "📋 Fiche" },
    { id: "sources", label: "🔍 Sources" },
  ]

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>

      <Header onHome={() => { setResult(null); setVue("liste"); window.history.pushState({}, "", "/") }} />

      <div style={{ marginTop: 20 }} />
      <SearchBar onSearch={search} />

      <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "0.5px solid #eee", paddingBottom: 12 }}>
        {TABS.map(t => (
          <span
            key={t.id}
            onClick={() => {
              if (t.id === "fiche" && !result) return
              setVue(t.id)
              // Nettoie l'URL si on revient à la liste
              if (t.id === "liste") {
                const url = new URL(window.location)
                url.searchParams.delete("name")
                window.history.pushState({}, "", url)
              }
            }}
            style={{
              padding: "6px 14px", borderRadius: 999, fontSize: 13,
              cursor: t.id === "fiche" && !result ? "default" : "pointer",
              background: vue === t.id ? "#1a1a1a" : "#f0f0ee",
              color: vue === t.id ? "#fff" : t.id === "fiche" && !result ? "#bbb" : "#555",
              fontWeight: vue === t.id ? 500 : 400,
            }}
          >
            {t.label}
          </span>
        ))}
      </div>

      {error && (
        <div style={{ background: "#FCEBEB", border: "0.5px solid #E24B4A", borderRadius: 8, padding: "12px 16px", color: "#791F1F", fontSize: 14, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          Recherche en cours...
        </div>
      )}

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
