import { useState, useEffect, useCallback } from "react"

const API = "https://web-production-6c245.up.railway.app"

const POSITION_STYLES = {
  pour:        { bg: "#EAF3DE", color: "#27500A", label: "Pour" },
  contre:      { bg: "#FCEBEB", color: "#791F1F", label: "Contre" },
  abstention:  { bg: "#F1EFE8", color: "#5F5E5A", label: "Abstention" },
  "non-votant": { bg: "#f0f0ee", color: "#999",   label: "Non-votant" },
}

function PositionBadge({ position }) {
  const s = POSITION_STYLES[position?.toLowerCase()] || { bg: "#f0f0ee", color: "#aaa", label: position || "—" }
  return (
    <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 999, background: s.bg, color: s.color, whiteSpace: "nowrap", flexShrink: 0 }}>
      {s.label}
    </span>
  )
}

function VoteRow({ vote }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "0.5px solid #f0f0ee", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {vote.url
          ? <a href={vote.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#1a1a1a", textDecoration: "none", fontWeight: 500, display: "block" }}
              onMouseEnter={e => e.target.style.textDecoration = "underline"}
              onMouseLeave={e => e.target.style.textDecoration = "none"}>
              {vote.texte}
            </a>
          : <div style={{ fontSize: 13, color: "#1a1a1a", fontWeight: 500 }}>{vote.texte}</div>
        }
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 3, display: "flex", gap: 10 }}>
          <span>{vote.date}</span>
          {vote.sort && <span>· {vote.sort === "adopté" ? "✅ Adopté" : vote.sort === "rejeté" ? "❌ Rejeté" : vote.sort}</span>}
        </div>
      </div>
      <PositionBadge position={vote.position} />
    </div>
  )
}

export default function VoteHistory({ name, typeMandat }) {
  const [votes, setVotes]         = useState([])
  const [total, setTotal]         = useState(null)
  const [pages, setPages]         = useState(1)
  const [page, setPage]           = useState(1)
  const [query, setQuery]         = useState("")
  const [inputVal, setInputVal]   = useState("")
  const [position, setPosition]   = useState("")
  const [loading, setLoading]     = useState(false)
  const [note, setNote]           = useState("")
  const [legislature, setLegislature] = useState("")
  const [error, setError]         = useState(null)

  const PAGE_SIZE = 50

  const fetchVotes = useCallback(async (nom, q, pos, pg) => {
    if (!nom) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ name: nom, q, position: pos, page: pg, page_size: PAGE_SIZE })
      const res  = await fetch(`${API}/politician/votes?${params}`)
      const data = await res.json()
      if (!data.trouve) {
        setError(data.note || "Données non disponibles")
        setVotes([])
        setTotal(0)
      } else {
        setVotes(data.votes || [])
        setTotal(data.total)
        setPages(data.pages || 1)
        setNote(data.note || "")
        setLegislature(data.legislature || "")
      }
    } catch {
      setError("Impossible de charger les votes")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (typeMandat === "senateur") return
    setPage(1)
    fetchVotes(name, query, position, 1)
  }, [name, query, position, fetchVotes, typeMandat])

  useEffect(() => {
    if (typeMandat === "senateur") return
    fetchVotes(name, query, position, page)
  }, [page]) // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault()
    setQuery(inputVal)
    setPage(1)
  }

  if (typeMandat === "senateur") {
    return (
      <div style={{ padding: "20px", background: "#f7f7f5", borderRadius: 10, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#888" }}>Historique de votes non disponible pour les sénateurs.</div>
        <div style={{ fontSize: 11, color: "#bbb", marginTop: 6 }}>Source NosSénateurs.fr en cours d'intégration.</div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 6, flex: 1, minWidth: 200 }}>
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Rechercher un texte… (ex : retraites)"
            style={{
              flex: 1, padding: "7px 12px", borderRadius: 8,
              border: "0.5px solid #ddd", fontSize: 13, outline: "none",
            }}
          />
          <button type="submit" style={{
            padding: "7px 14px", borderRadius: 8, border: "none",
            background: "#1a1a1a", color: "#fff", fontSize: 13, cursor: "pointer",
          }}>
            Chercher
          </button>
          {query && (
            <button type="button" onClick={() => { setQuery(""); setInputVal(""); setPage(1) }} style={{
              padding: "7px 10px", borderRadius: 8, border: "0.5px solid #ddd",
              background: "#fff", fontSize: 12, cursor: "pointer", color: "#666",
            }}>✕</button>
          )}
        </form>

        {/* Filtre position */}
        <div style={{ display: "flex", gap: 6 }}>
          {["", "pour", "contre", "abstention"].map(pos => (
            <button key={pos} onClick={() => { setPosition(pos); setPage(1) }} style={{
              padding: "6px 12px", borderRadius: 999, fontSize: 12, cursor: "pointer", border: "none",
              background: position === pos ? "#1a1a1a" : "#f0f0ee",
              color: position === pos ? "#fff" : "#555",
            }}>
              {pos === "" ? "Tous" : pos.charAt(0).toUpperCase() + pos.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Résumé */}
      {total !== null && !loading && (
        <div style={{ fontSize: 12, color: "#888" }}>
          {query ? <><strong>{total}</strong> vote{total > 1 ? "s" : ""} contenant « {query} »</> : <><strong>{total}</strong> votes — {legislature}</>}
        </div>
      )}

      {/* Note 17e législature */}
      {note && !loading && (
        <div style={{ fontSize: 11, color: "#b35c00", background: "#fdf3e3", borderRadius: 7, padding: "7px 12px" }}>
          ⚠️ {note}
        </div>
      )}

      {/* Liste */}
      {loading && <div style={{ fontSize: 13, color: "#999", padding: "20px 0", textAlign: "center" }}>Chargement…</div>}

      {error && !loading && (
        <div style={{ fontSize: 13, color: "#888", background: "#f7f7f5", borderRadius: 8, padding: "16px", textAlign: "center" }}>
          {error}
        </div>
      )}

      {!loading && !error && votes.length > 0 && (
        <div>
          {votes.map((v, i) => <VoteRow key={i} vote={v} />)}
        </div>
      )}

      {!loading && !error && votes.length === 0 && total === 0 && (
        <div style={{ fontSize: 13, color: "#999", padding: "20px 0", textAlign: "center" }}>
          Aucun vote trouvé{query ? ` pour « ${query} »` : ""}.
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && !loading && (
        <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", paddingTop: 8 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={btnStyle(page > 1)}>←</button>
          <span style={{ fontSize: 13, color: "#555" }}>Page {page} / {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={btnStyle(page < pages)}>→</button>
        </div>
      )}

      {/* Source */}
      {!loading && total > 0 && (
        <div style={{ fontSize: 11, color: "#bbb" }}>
          Source : <a href={`https://www.nosdeputes.fr`} target="_blank" rel="noopener noreferrer" style={{ color: "#378ADD" }}>NosDéputés.fr</a>
        </div>
      )}

    </div>
  )
}

function btnStyle(active) {
  return {
    padding: "6px 14px", borderRadius: 8, border: "0.5px solid #ddd",
    background: active ? "#fff" : "#f7f7f5", cursor: active ? "pointer" : "default",
    color: active ? "#333" : "#ccc", fontSize: 13,
  }
}
