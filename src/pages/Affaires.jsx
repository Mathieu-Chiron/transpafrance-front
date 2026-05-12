import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API = "https://web-production-6c245.up.railway.app"

export default function Affaires() {
  const navigate = useNavigate()
  const [elus, setElus]       = useState([])
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur]   = useState(null)

  useEffect(() => {
    fetch(`${API}/affaires`)
      .then(r => r.json())
      .then(d => { setElus(d.elus || []); setLoading(false) })
      .catch(() => { setErreur("Impossible de charger les données."); setLoading(false) })
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "system-ui, sans-serif" }}>
      {/* Nav */}
      <div style={{ background: "#fff", borderBottom: "0.5px solid #e5e5e5", padding: "0 32px", display: "flex", alignItems: "center", height: 62 }}>
        <span
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", fontWeight: 700, fontSize: 18, color: "#002395", letterSpacing: "-0.5px" }}
        >
          TranspaFrance
        </span>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111", marginBottom: 8 }}>
          Élus avec affaires judiciaires
        </h1>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 32 }}>
          Liste des parlementaires pour lesquels des procédures ou condamnations sont recensées sur{" "}
          <a href="https://casier-politique.fr" target="_blank" rel="noreferrer" style={{ color: "#002395" }}>
            casier-politique.fr
          </a>. Données mises à jour lors de chaque consultation de fiche.
        </p>

        {loading && <p style={{ color: "#999", fontSize: 14 }}>Chargement…</p>}
        {erreur  && <p style={{ color: "#c0392b", fontSize: 14 }}>{erreur}</p>}

        {!loading && !erreur && elus.length === 0 && (
          <p style={{ color: "#999", fontSize: 14 }}>
            Aucune donnée disponible — le précalcul n'a pas encore tourné.
          </p>
        )}

        {!loading && elus.length > 0 && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #e5e5e5" }}>
                <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, color: "#444" }}>Élu</th>
                <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, color: "#444" }}>Mandat</th>
                <th style={{ textAlign: "center", padding: "8px 12px", fontWeight: 600, color: "#444" }}>Procédures</th>
              </tr>
            </thead>
            <tbody>
              {elus.map((e, i) => (
                <tr
                  key={i}
                  onClick={() => navigate(`/app?name=${encodeURIComponent(e.nom)}`)}
                  style={{ borderBottom: "0.5px solid #f0f0f0", cursor: "pointer" }}
                  onMouseEnter={ev => ev.currentTarget.style.background = "#f5f7ff"}
                  onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "10px 12px", color: "#002395", fontWeight: 500 }}>{e.nom}</td>
                  <td style={{ padding: "10px 12px", color: "#555", textTransform: "capitalize" }}>
                    {e.type_mandat === "senateur" ? "Sénateur" : e.type_mandat === "depute" ? "Député" : e.type_mandat || "—"}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <span style={{ background: "#fff0f0", color: "#c0392b", borderRadius: 4, padding: "2px 10px", fontWeight: 600 }}>
                      {e.nb}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && elus.length > 0 && (
          <p style={{ fontSize: 12, color: "#aaa", marginTop: 24 }}>
            {elus.length} élu{elus.length > 1 ? "s" : ""} recensé{elus.length > 1 ? "s" : ""} — source : casier-politique.fr
          </p>
        )}
      </div>
    </div>
  )
}
