import { useState } from "react"

const TYPE_STYLES = {
  "Député":   { bg: "#E6F1FB", color: "#0C447C", icon: "🏛️" },
  "Sénateur": { bg: "#F5F0FF", color: "#4a1a8b", icon: "📜" },
  "Maire":    { bg: "#FFF8EE", color: "#7a4a00", icon: "🎖️" },
}

export default function CodePostalSearch({ onSelectElu }) {
  const [codePostal, setCodePostal] = useState("")
  const [result, setResult]         = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const chercher = async () => {
    if (codePostal.length !== 5 || !codePostal.match(/^\d{5}$/)) {
      setError("Code postal invalide — 5 chiffres attendus")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res  = await fetch(`https://web-production-6c245.up.railway.app/elus/code-postal/${codePostal}`)
      const data = await res.json()
      if (!data.trouve) throw new Error(data.erreur || "Introuvable")
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") chercher()
  }

  return (
    <div style={{ background: "#f8f8f6", borderRadius: 10, padding: "20px", marginBottom: 24, border: "0.5px solid #e5e5e5" }}>

      <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a", marginBottom: 4 }}>
        🔍 Qui sont mes élus ?
      </div>
      <div style={{ fontSize: 12, color: "#999", marginBottom: 12 }}>
        Entrez votre code postal pour trouver votre député, sénateur et maire
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={codePostal}
          onChange={e => setCodePostal(e.target.value.replace(/\D/g, "").slice(0, 5))}
          onKeyDown={handleKey}
          placeholder="Ex : 75011, 69001, 13008..."
          maxLength={5}
          style={{
            flex: 1, padding: "9px 14px",
            border: "0.5px solid #ccc", borderRadius: 8,
            fontSize: 15, outline: "none", background: "#fff"
          }}
        />
        <button
          onClick={chercher}
          style={{
            padding: "9px 18px", borderRadius: 8,
            border: "none", background: "#002395",
            color: "#fff", fontSize: 13, fontWeight: 500,
            cursor: "pointer", whiteSpace: "nowrap"
          }}
        >
          Trouver mes élus
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#791F1F", background: "#FCEBEB", padding: "6px 10px", borderRadius: 6 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 12, fontSize: 13, color: "#999" }}>Recherche en cours...</div>
      )}

      {result && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: "#999", marginBottom: 10 }}>
            {result.total} élu{result.total > 1 ? "s" : ""} trouvé{result.total > 1 ? "s" : ""} pour <strong>{result.commune}</strong> ({result.departement})
          </div>

          {/* Maires */}
          {result.maires.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#999", letterSpacing: "1px", marginBottom: 6 }}>MAIRE</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.maires.map((elu, i) => (
                  <EluCard key={i} elu={elu} onSelect={onSelectElu} />
                ))}
              </div>
            </div>
          )}

          {/* Députés */}
          {result.deputes.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#999", letterSpacing: "1px", marginBottom: 6 }}>
                DÉPUTÉS DU DÉPARTEMENT ({result.deputes.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.deputes.map((elu, i) => (
                  <EluCard key={i} elu={elu} onSelect={onSelectElu} />
                ))}
              </div>
            </div>
          )}

          {/* Sénateurs */}
          {result.senateurs.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: "#999", letterSpacing: "1px", marginBottom: 6 }}>
                SÉNATEURS DU DÉPARTEMENT ({result.senateurs.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {result.senateurs.map((elu, i) => (
                  <EluCard key={i} elu={elu} onSelect={onSelectElu} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EluCard({ elu, onSelect }) {
  const style = TYPE_STYLES[elu.type_mandat] || { bg: "#f0f0ee", color: "#555", icon: "👤" }
  return (
    <div
      onClick={() => onSelect(elu.nom)}
      style={{
        background: "#fff",
        border: "0.5px solid #e5e5e5",
        borderRadius: 8,
        padding: "8px 12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        minWidth: 160,
      }}
    >
      <span style={{ fontSize: 16 }}>{style.icon}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1a1a" }}>{elu.prenom} {elu.nom_famille}</div>
        <span style={{
          fontSize: 10, padding: "1px 6px", borderRadius: 999,
          background: style.bg, color: style.color,
        }}>
          {elu.type_mandat}
        </span>
      </div>
    </div>
  )
}
