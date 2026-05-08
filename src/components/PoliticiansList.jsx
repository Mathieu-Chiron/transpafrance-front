import { useState, useEffect } from "react"

const FILTRES_MANDAT = ["depute", "senateur", "maire"]
const FILTRES_BORD   = ["Gauche radicale", "Gauche", "Centre gauche", "Centre", "Centre droit", "Droite", "Extrême droite"]

export default function PoliticiansList({ onSelect }) {
  const [elus, setElus]             = useState([])
  const [loading, setLoading]       = useState(false)
  const [typeMandat, setTypeMandat] = useState("depute")
  const [filtreBord, setFiltreBord] = useState("")
  const [filtreCondamne, setFiltreCondamne] = useState(false)
  const [page, setPage]             = useState(1)
  const [total, setTotal]           = useState(0)

  const PAGE_SIZE = 50

  const charger = async () => {
    setLoading(true)
    try {
      let url = `http://localhost:8000/politicians?type_mandat=${typeMandat}&page=${page}&page_size=${PAGE_SIZE}`
      if (filtreBord) url += `&bord=${encodeURIComponent(filtreBord)}`
      const res  = await fetch(url)
      const data = await res.json()
      setElus(data.elus || [])
      setTotal(data.total || 0)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { charger() }, [typeMandat, filtreBord, page])

  const elusFiltres = filtreCondamne
    ? elus.filter(e => e.condamne)
    : elus

  return (
    <div>
      {/* Filtres type mandat */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {FILTRES_MANDAT.map(m => (
          <span
            key={m}
            onClick={() => { setTypeMandat(m); setPage(1) }}
            style={{
              padding: "5px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
              background: typeMandat === m ? "#1a1a1a" : "#f0f0ee",
              color: typeMandat === m ? "#fff" : "#555",
              fontWeight: typeMandat === m ? 500 : 400,
            }}
          >
            {m === "depute" ? "Députés" : m === "senateur" ? "Sénateurs" : "Maires"}
          </span>
        ))}

        <span
          onClick={() => setFiltreCondamne(!filtreCondamne)}
          style={{
            padding: "5px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
            background: filtreCondamne ? "#FCEBEB" : "#f0f0ee",
            color: filtreCondamne ? "#791F1F" : "#555",
            border: filtreCondamne ? "0.5px solid #E24B4A" : "0.5px solid transparent",
          }}
        >
          Condamnés seulement
        </span>
      </div>

      {/* Filtres bord politique */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, color: "#999", alignSelf: "center", marginRight: 4 }}>BORD</span>
        <span
          onClick={() => setFiltreBord("")}
          style={{
            padding: "3px 10px", borderRadius: 999, fontSize: 12, cursor: "pointer",
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
              padding: "3px 10px", borderRadius: 999, fontSize: 12, cursor: "pointer",
              background: filtreBord === b ? "#E6F1FB" : "#f0f0ee",
              color: filtreBord === b ? "#0C447C" : "#555",
              border: filtreBord === b ? "0.5px solid #378ADD" : "0.5px solid transparent",
            }}
          >
            {b}
          </span>
        ))}
      </div>

      {/* Compteur */}
      <div style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>
        {loading ? "Chargement..." : `${elusFiltres.length} élu${elusFiltres.length > 1 ? "s" : ""} affiché${elusFiltres.length > 1 ? "s" : ""}`}
        {filtreCondamne && <span style={{ color: "#A32D2D", marginLeft: 8 }}>⚠ filtre condamnés actif</span>}
      </div>

      {/* Grille */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
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
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{elu.nom}</div>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 6 }}>
              {elu.departement}
              {elu.bord && <span style={{ marginLeft: 6, color: "#666" }}>· {elu.bord}</span>}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {elu.condamne && (
                <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 999, background: "#FCEBEB", color: "#791F1F" }}>
                  {elu.nb_condamnations} condamnation{elu.nb_condamnations > 1 ? "s" : ""}
                </span>
              )}
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
