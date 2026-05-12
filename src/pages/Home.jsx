import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

const FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="3" width="12" height="1.5" rx="0.75" fill="#0C447C"/>
        <rect x="2" y="7" width="8" height="1.5" rx="0.75" fill="#0C447C"/>
        <rect x="2" y="11" width="10" height="1.5" rx="0.75" fill="#0C447C"/>
      </svg>
    ),
    iconBg: "#E6F1FB",
    borderColor: "#002395",
    name: "Historique de votes",
    desc: "Chaque vote, texte par texte. Pour ou contre — vérifiez si ses actes correspondent à ses promesses.",
    tag: "Essentiel",
    tagBg: "#E6F1FB",
    tagColor: "#0C447C",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2a6 6 0 100 12A6 6 0 008 2z" stroke="#444" strokeWidth="1.5"/>
        <path d="M8 5v4l2 1.5" stroke="#444" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    iconBg: "#f0f0f0",
    borderColor: "#1a1a1a",
    name: "Affaires judiciaires",
    desc: "Procédures en cours, condamnations définitives ou en appel — le statut exact, sourcé et daté.",
    tag: "Judiciaire",
    tagBg: "#FCEBEB",
    tagColor: "#791F1F",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="10" width="2.5" height="4" rx="0.5" fill="#A32D2D"/>
        <rect x="6" y="7" width="2.5" height="7" rx="0.5" fill="#A32D2D"/>
        <rect x="10" y="4" width="2.5" height="10" rx="0.5" fill="#A32D2D"/>
      </svg>
    ),
    iconBg: "#FCEBEB",
    borderColor: "#ED2939",
    name: "Activité parlementaire",
    desc: "Présences, interventions, questions — comparées à la moyenne nationale des élus du même type.",
    tag: "Activité",
    tagBg: "#f0f0f0",
    tagColor: "#5F5E5A",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5.5" height="5.5" rx="1" stroke="#633806" strokeWidth="1.5"/>
        <rect x="8.5" y="2" width="5.5" height="5.5" rx="1" stroke="#633806" strokeWidth="1.5"/>
        <rect x="2" y="8.5" width="5.5" height="5.5" rx="1" stroke="#633806" strokeWidth="1.5"/>
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" stroke="#633806" strokeWidth="1.5"/>
      </svg>
    ),
    iconBg: "#FAEEDA",
    borderColor: "transparent",
    name: "Cumul de mandats",
    desc: "Député ET maire ET conseiller ? Détecté automatiquement depuis le Répertoire National des Élus.",
    tag: "Mandats",
    tagBg: "#FAEEDA",
    tagColor: "#633806",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5L8 2z" stroke="#27500A" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
    iconBg: "#EAF3DE",
    borderColor: "transparent",
    name: "Score de transparence",
    desc: "Une note sur 100 — présence, votes, affaires judiciaires, cumul, déclaration HATVP.",
    tag: "Synthèse",
    tagBg: "#EAF3DE",
    tagColor: "#27500A",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="4" width="12" height="9" rx="1" stroke="#185FA5" strokeWidth="1.5"/>
        <path d="M5 4V3a1 1 0 012 0v1M9 4V3a1 1 0 012 0v1" stroke="#185FA5" strokeWidth="1.2"/>
        <path d="M2 8h12" stroke="#185FA5" strokeWidth="1" opacity="0.4"/>
      </svg>
    ),
    iconBg: "#E6F1FB",
    borderColor: "transparent",
    name: "Indemnités & coût",
    desc: "Ce que perçoit l'élu et ce qu'il coûte au contribuable — contextualisé par rapport au SMIC.",
    tag: "Finances",
    tagBg: "#E6F1FB",
    tagColor: "#0C447C",
  },
]

const ELUS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 15h14M4 15V7l5-4 5 4v8" stroke="#185FA5" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="7" y="10" width="4" height="5" rx="0.5" stroke="#185FA5" strokeWidth="1.2"/>
      </svg>
    ),
    iconBg: "#E6F1FB",
    title: "Député",
    desc: "Vote les lois à l'Assemblée nationale. Représente une circonscription pour 5 ans.",
    data: "Votes · Présences · Amendements · Affaires judiciaires · Score",
    tag: "577 en France",
    tagBg: "#E6F1FB",
    tagColor: "#0C447C",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 14V7c0-2.8 10-2.8 10 0v7" stroke="#534AB7" strokeWidth="1.5"/>
        <path d="M2 14h14" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M7 7v7M11 7v7" stroke="#534AB7" strokeWidth="1" opacity="0.5"/>
      </svg>
    ),
    iconBg: "#F5F0FF",
    title: "Sénateur",
    desc: "Révise les lois au Sénat. Représente les collectivités locales pour 6 ans.",
    data: "Propositions de loi · Amendements · Affaires judiciaires · Ancienneté",
    tag: "348 en France",
    tagBg: "#F5F0FF",
    tagColor: "#3C3489",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="#0F6E56" strokeWidth="1.5"/>
        <path d="M9 2c0 0 3 3.5 3 7s-3 7-3 7M9 2c0 0-3 3.5-3 7s3 7 3 7M2 9h14" stroke="#0F6E56" strokeWidth="1.2"/>
      </svg>
    ),
    iconBg: "#E1F5EE",
    title: "Député européen",
    desc: "Vote les directives qui s'imposent à toute la France. Siège à Bruxelles pour 5 ans.",
    data: "Mandats · Affaires judiciaires · Cumul · Indemnités",
    tag: "81 Français élus",
    tagBg: "#E1F5EE",
    tagColor: "#085041",
  },
]

const API = "https://web-production-6c245.up.railway.app"

export default function Home() {
  const navigate  = useNavigate()
  const [query, setQuery]       = useState("")
  const [postal, setPostal]     = useState("")
  const [searchMode, setMode]   = useState("nom")
  const [stats, setStats]       = useState({
    deputes: 577, senateurs: 348, elus_avec_affaires: null, total_procedures: null
  })

  useEffect(() => {
    fetch(`${API}/stats`)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
  }, [])

  const handleSearch = () => {
    if (searchMode === "nom" && query.trim()) {
      navigate(`/app?name=${encodeURIComponent(query.trim())}`)
    } else if (searchMode === "postal" && postal.trim()) {
      navigate(`/app?cp=${encodeURIComponent(postal.trim())}`)
    }
  }

  const handleKey = (e) => {
    if (e.key === "Enter") handleSearch()
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", color: "#1a1a1a" }}>

      {/* Nav — hauteur +20% : 52 → 62px */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 62, borderBottom: "0.5px solid #e5e5e5", background: "#fff", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => navigate("/")}>
          <svg width="29" height="29" viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg">
            <polygon points="72,4 124,32 124,112 72,140 20,112 20,32" fill="#002395"/>
            <clipPath id="hn"><polygon points="72,4 124,32 124,112 72,140 20,112 20,32"/></clipPath>
            <rect x="20" y="4" width="35" height="136" fill="#4a7fd4" clipPath="url(#hn)" opacity="0.4"/>
            <rect x="55" y="4" width="34" height="136" fill="#fff" clipPath="url(#hn)" opacity="0.2"/>
            <rect x="89" y="4" width="35" height="136" fill="#ED2939" clipPath="url(#hn)" opacity="0.35"/>
            <path d="M40,72 Q72,50 104,72 Q72,94 40,72 Z" fill="#fff"/>
            <circle cx="72" cy="72" r="14" fill="#4a7fd4"/>
            <circle cx="72" cy="72" r="7" fill="#001a6e"/>
            <circle cx="76" cy="68" r="3" fill="#fff" opacity="0.9"/>
            <path d="M40,72 Q72,50 104,72 Q72,94 40,72 Z" fill="none" stroke="#fff" strokeWidth="2"/>
          </svg>
          <span style={{ fontSize: 18, fontWeight: 500, color: "#002395" }}>TranspaFrance</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["Les élus", "Affaires judiciaires", "Sources"].map(l => (
            <span key={l} style={{ fontSize: 16, color: "#666", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <button
          onClick={() => navigate("/app")}
          style={{ fontSize: 14, fontWeight: 500, padding: "7px 17px", borderRadius: 8, background: "#002395", color: "#fff", cursor: "pointer", border: "none" }}
        >
          Rechercher un élu
        </button>
      </nav>

      {/* Hero — texte centré, tailles +15% */}
      <section style={{ padding: "56px 32px 48px", borderBottom: "0.5px solid #e5e5e5", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", pointerEvents: "none" }}>
          <div style={{ flex: 1, background: "#002395", opacity: 0.04 }}/>
          <div style={{ flex: 1 }}/>
          <div style={{ flex: 1, background: "#ED2939", opacity: 0.04 }}/>
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 13, letterSpacing: 2, color: "#999", marginBottom: 16 }}>TRANSPARENCE POLITIQUE FRANÇAISE</p>
          <h1 style={{ fontSize: 37, fontWeight: 500, lineHeight: 1.25, marginBottom: 14 }}>
            Vos élus.<br/>
            Leurs votes, leurs mandats,<br/>
            <span style={{ color: "#002395" }}>leurs indemnités.</span>
          </h1>
          <p style={{ fontSize: 17, color: "#666", lineHeight: 1.6, marginBottom: 28, maxWidth: 520, margin: "0 auto 28px" }}>
            Des données publiques centralisées pour vous permettre de voter en connaissance de cause. Ni à gauche ni à droite — pour la transparence.
          </p>

          <div style={{ background: "#fff", border: "0.5px solid #ddd", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 14, justifyContent: "center" }}>
              {[
                { id: "nom", label: "Par nom" },
                { id: "postal", label: "Par code postal" },
              ].map(t => (
                <div
                  key={t.id}
                  onClick={() => setMode(t.id)}
                  style={{
                    fontSize: 14, padding: "4px 14px", borderRadius: 999, cursor: "pointer",
                    background: searchMode === t.id ? "#002395" : "transparent",
                    color: searchMode === t.id ? "#fff" : "#666",
                    border: searchMode === t.id ? "0.5px solid #002395" : "0.5px solid transparent",
                  }}
                >
                  {t.label}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {searchMode === "nom" ? (
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Didier Justice..."
                  style={{ flex: 1, padding: "10px 16px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 16, outline: "none" }}
                />
              ) : (
                <input
                  value={postal}
                  onChange={e => setPostal(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  onKeyDown={handleKey}
                  placeholder="75011, 69001, 13008..."
                  maxLength={5}
                  style={{ flex: 1, padding: "10px 16px", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 16, outline: "none" }}
                />
              )}
              <button
                onClick={handleSearch}
                style={{ padding: "10px 20px", borderRadius: 8, background: "#002395", color: "#fff", fontSize: 15, fontWeight: 500, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Rechercher
              </button>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#999" }}>
            Vous ne connaissez pas son nom ?{" "}
            <span style={{ color: "#002395", cursor: "pointer" }} onClick={() => setMode("postal")}>
              Entrez votre code postal
            </span>{" "}
            pour trouver vos représentants.
          </p>
        </div>
      </section>

      {/* Tribar */}
      <div style={{ height: 3, display: "flex" }}>
        <div style={{ flex: 1, background: "#002395" }}/>
        <div style={{ flex: 1, background: "#ddd" }}/>
        <div style={{ flex: 1, background: "#ED2939" }}/>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", borderBottom: "0.5px solid #e5e5e5" }}>
        {[
          { num: stats.deputes,            label: "Députés indexés",         href: null },
          { num: stats.senateurs,          label: "Sénateurs indexés",       href: null },
          { num: stats.elus_avec_affaires, label: "Élus avec affaires",      href: "/affaires" },
          { num: stats.total_procedures,   label: "Procédures répertoriées", href: "/affaires" },
          { num: "100%",                   label: "Données publiques",       href: "/sources" },
        ].map((s, i, arr) => {
          const inner = (
            <>
              <div style={{ fontSize: 20, fontWeight: 500, color: "#002395" }}>{s.num ?? "—"}</div>
              <div style={{ fontSize: 11, color: s.href ? "#002395" : "#999", marginTop: 2, textDecoration: s.href ? "underline" : "none" }}>
                {s.label}
              </div>
            </>
          )
          const commonStyle = {
            flex: 1, padding: "16px 0", textAlign: "center", display: "block",
            borderRight: i < arr.length - 1 ? "0.5px solid #e5e5e5" : "none",
          }
          return s.href ? (
            <Link key={s.label} to={s.href} style={{ ...commonStyle, textDecoration: "none" }}
              onMouseEnter={ev => ev.currentTarget.style.background = "#f5f7ff"}
              onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
              {inner}
            </Link>
          ) : (
            <div key={s.label} style={commonStyle}>{inner}</div>
          )
        })}
      </div>

      {/* Features */}
      <section style={{ padding: "40px 32px", borderBottom: "0.5px solid #e5e5e5" }}>
        <p style={{ fontSize: 11, letterSpacing: 2, color: "#999", marginBottom: 8 }}>CE QUE VOUS POUVEZ VÉRIFIER</p>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>Tout ce que votre élu ne vous dira pas spontanément.</h2>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 24, lineHeight: 1.6 }}>Aucune opinion, aucun filtre politique. Des faits, des chiffres, des sources officielles.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
          {FEATURES.map(f => (
            <div key={f.name} style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderTop: `2px solid ${f.borderColor || "#e5e5e5"}`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: f.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {f.icon}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</span>
              </div>
              <p style={{ fontSize: 12, color: "#888", lineHeight: 1.55 }}>{f.desc}</p>
              <span style={{ display: "inline-block", marginTop: 10, fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 999, background: f.tagBg, color: f.tagColor }}>
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Élus */}
      <section style={{ padding: "40px 32px", borderBottom: "0.5px solid #e5e5e5" }}>
        <p style={{ fontSize: 11, letterSpacing: 2, color: "#999", marginBottom: 8 }}>QUI POUVEZ-VOUS RECHERCHER</p>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 6 }}>Tous vos représentants, quel que soit leur mandat.</h2>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 24, lineHeight: 1.6 }}>De votre commune à Bruxelles — retrouvez et évaluez n'importe quel élu français.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10 }}>
          {ELUS.map(e => (
            <div key={e.title} style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: e.iconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                {e.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5, marginBottom: 6 }}>{e.desc}</div>
              <div style={{ fontSize: 11, color: "#aaa", lineHeight: 1.6 }}>{e.data}</div>
              <span style={{ display: "inline-block", marginTop: 8, fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 999, background: e.tagBg, color: e.tagColor }}>
                {e.tag}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, background: "#f8f8f6", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#666", lineHeight: 1.6, borderLeft: "2px solid #ddd" }}>
          <strong style={{ fontWeight: 500 }}>Et les maires ?</strong> TranspaFrance permet de retrouver le maire de n'importe quelle commune via le code postal. Les données disponibles sont aujourd'hui limitées — affaires judiciaires et cumul de mandats. Une section dédiée est prévue avec l'intégration des budgets communaux et des marchés publics.
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "48px 32px", background: "#002395", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", pointerEvents: "none" }}>
          <div style={{ flex: 1, background: "#4a7fd4", opacity: 0.10 }}/>
          <div style={{ flex: 1 }}/>
          <div style={{ flex: 1, background: "#ED2939", opacity: 0.08 }}/>
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, letterSpacing: 2, color: "#fff", opacity: 0.4, marginBottom: 14 }}>AVANT DE VOTER</p>
          <h2 style={{ fontSize: 26, fontWeight: 500, color: "#fff", lineHeight: 1.3, marginBottom: 10 }}>
            Informé aujourd'hui.<br/>Libre de voter demain.
          </h2>
          <p style={{ fontSize: 14, color: "#fff", opacity: 0.6, marginBottom: 28 }}>Ni à gauche ni à droite. Pour la transparence.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={() => navigate("/app")}
              style={{ background: "#fff", color: "#002395", fontSize: 13, fontWeight: 500, padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer" }}
            >
              Rechercher un élu
            </button>
            <button
              onClick={() => { navigate("/app"); }}
              style={{ background: "transparent", color: "#fff", fontSize: 13, padding: "10px 22px", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.35)", cursor: "pointer" }}
            >
              Trouver mes élus par code postal
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", borderTop: "0.5px solid #e5e5e5" }}>
        <span style={{ fontSize: 12, color: "#aaa" }}>TranspaFrance — données publiques françaises</span>
        <div style={{ display: "flex", gap: 16 }}>
          {["Sources", "À propos", "Contact"].map(l => (
            <span key={l} style={{ fontSize: 12, color: "#aaa", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>

    </div>
  )
}
