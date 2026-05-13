import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import AutocompleteInput from "../components/AutocompleteInput"

const API = "https://web-production-6c245.up.railway.app"

const FEATURES = [
  {
    name: "Historique de votes",
    desc: "Chaque vote, texte par texte. Pour ou contre — vérifiez si ses actes correspondent à ses promesses.",
    tag: "Essentiel",
    tagBg: "#EEF4FF", tagColor: "#002395",
    borderColor: "#dce8ff",
    iconBg: "#EEF4FF",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="5" width="16" height="2" rx="1" fill="#002395"/>
        <rect x="3" y="10" width="11" height="2" rx="1" fill="#002395" opacity="0.6"/>
        <rect x="3" y="15" width="13" height="2" rx="1" fill="#002395" opacity="0.35"/>
        <circle cx="17" cy="15" r="3" fill="#ED2939"/>
        <path d="M15.5 15l1 1 2-2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Affaires judiciaires",
    desc: "Procédures en cours, condamnations définitives ou en appel — statut exact, sourcé et daté.",
    tag: "Judiciaire",
    tagBg: "#FFF0F0", tagColor: "#ED2939",
    borderColor: "#ffe0e0",
    iconBg: "#FFF0F0",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#ED2939" strokeWidth="1.8"/>
        <path d="M11 7v5l3 2" stroke="#ED2939" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="16.5" cy="16.5" r="3" fill="#ED2939"/>
        <path d="M15.2 16.5h2.6M16.5 15.2v2.6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    name: "Activité parlementaire",
    desc: "Présences, interventions, questions — comparées à la moyenne nationale des élus du même type.",
    tag: "Activité",
    tagBg: "#f5f5f5", tagColor: "#555",
    borderColor: "#f0f0f0",
    iconBg: "#f5f5f5",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="14" width="3.5" height="5" rx="1.5" fill="#555"/>
        <rect x="8.5" y="10" width="3.5" height="9" rx="1.5" fill="#555"/>
        <rect x="14" y="6" width="3.5" height="13" rx="1.5" fill="#555"/>
        <path d="M4.5 12 9 8.5l5.5-4" stroke="#002395" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="15.5" cy="4.5" r="2" fill="#002395"/>
      </svg>
    ),
  },
  {
    name: "Cumul de mandats",
    desc: "Député ET maire ET conseiller ? Détecté automatiquement depuis le Répertoire National des Élus.",
    tag: "Mandats",
    tagBg: "#FFF8EE", tagColor: "#BA7517",
    borderColor: "#f0f0f0",
    iconBg: "#FFF8EE",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="2.5" stroke="#BA7517" strokeWidth="1.8"/>
        <rect x="12" y="3" width="7" height="7" rx="2.5" stroke="#BA7517" strokeWidth="1.8"/>
        <rect x="3" y="12" width="7" height="7" rx="2.5" stroke="#BA7517" strokeWidth="1.8"/>
        <rect x="12" y="12" width="7" height="7" rx="2.5" fill="#BA7517" opacity="0.15" stroke="#BA7517" strokeWidth="1.8"/>
        <path d="M14.5 15.5l1.5 1.5 2.5-2.5" stroke="#BA7517" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Score de transparence",
    desc: "Une note sur 100 calculée à partir des données disponibles — présence, votes, affaires, cumul, HATVP.",
    tag: "Synthèse",
    tagBg: "#EEF4FF", tagColor: "#002395",
    borderColor: "#dce8ff",
    iconBg: "#EEF4FF",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#002395" strokeWidth="1.8"/>
        <path d="M11 7l1.2 2.5 2.8.4-2 2 .5 2.8L11 13.5l-2.5 1.2.5-2.8-2-2 2.8-.4L11 7z"
          fill="#002395" opacity="0.2" stroke="#002395" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    name: "Indemnités & coût",
    desc: "Ce que perçoit l'élu et ce qu'il coûte au contribuable — contextualisé par rapport au SMIC.",
    tag: "Finances",
    tagBg: "#f0fff4", tagColor: "#27500A",
    borderColor: "#f0f0f0",
    iconBg: "#f0fff4",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="5" width="16" height="13" rx="3" stroke="#27500A" strokeWidth="1.8"/>
        <path d="M7 5V4a1 1 0 012 0v1M13 5V4a1 1 0 012 0v1" stroke="#27500A" strokeWidth="1.5"/>
        <path d="M3 10h16" stroke="#27500A" strokeWidth="1.2" opacity="0.4"/>
        <path d="M7 14h3M12 14h3" stroke="#ED2939" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
]

const ELUS = [
  {
    name: "Député",
    desc: "Vote les lois à l'Assemblée nationale. Représente une circonscription pour 5 ans.",
    data: "Votes · Présences · Amendements · Affaires judiciaires · Score",
    count: "577 en France",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 19h16M5 19V9l6-5 6 5v10" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
        <rect x="8.5" y="13" width="5" height="6" rx="1" stroke="#fff" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    name: "Sénateur",
    desc: "Révise les lois au Sénat. Représente les collectivités locales pour 6 ans.",
    data: "Propositions de loi · Amendements · Affaires judiciaires · Ancienneté",
    count: "348 en France",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M5 18V9c0-3.5 12-3.5 12 0v9" stroke="#fff" strokeWidth="1.8"/>
        <path d="M3 18h16" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M8.5 9v9M13.5 9v9" stroke="#fff" strokeWidth="1.2" opacity="0.5"/>
      </svg>
    ),
  },
  {
    name: "Député européen",
    desc: "Vote les directives qui s'imposent à toute la France. Siège à Bruxelles pour 5 ans.",
    data: "Mandats · Affaires judiciaires · Cumul · Indemnités",
    count: "81 Français élus",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#fff" strokeWidth="1.8"/>
        <path d="M11 3s3.5 4 3.5 8-3.5 8-3.5 8M11 3s-3.5 4-3.5 8 3.5 8 3.5 8M3 11h16"
          stroke="#fff" strokeWidth="1.5"/>
      </svg>
    ),
  },
]

const s = {
  page: { fontFamily: "system-ui, sans-serif", color: "#0a0a0a", background: "#fff" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 60, background: "#fff", borderBottom: "1px solid #f0f0f0", position: "sticky", top: 0, zIndex: 10 },
  navLogo: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  navName: { fontSize: 16, fontWeight: 500, color: "#002395", letterSpacing: "-0.3px" },
  navLinks: { display: "flex", gap: 28 },
  navLink: { fontSize: 14, color: "#555", textDecoration: "none" },
  navBtn: { fontSize: 13, fontWeight: 500, padding: "8px 18px", borderRadius: 999, background: "#002395", color: "#fff", border: "none", cursor: "pointer" },
  hero: { padding: "72px 40px 64px", background: "#f7f9ff", borderRadius: "0 0 40px 40px", textAlign: "center" },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e0e8ff", borderRadius: 999, padding: "5px 14px", fontSize: 12, color: "#002395", fontWeight: 500, marginBottom: 28 },
  heroDot: { width: 6, height: 6, borderRadius: "50%", background: "#ED2939" },
  heroTitle: { fontSize: 44, fontWeight: 500, lineHeight: 1.15, letterSpacing: "-1px", color: "#0a0a0a", marginBottom: 18, maxWidth: 600, marginLeft: "auto", marginRight: "auto" },
  heroSub: { fontSize: 16, color: "#666", lineHeight: 1.65, maxWidth: 460, margin: "0 auto 36px" },
  searchCard: { background: "#fff", borderRadius: 24, boxShadow: "0 2px 24px rgba(0,35,149,0.08)", padding: 20, maxWidth: 560, margin: "0 auto" },
  searchModes: { display: "flex", gap: 4, marginBottom: 14 },
  searchRow: { display: "flex", gap: 8 },
  searchInput: { flex: 1, padding: "11px 16px", border: "1.5px solid #e8edf8", borderRadius: 14, fontSize: 14, outline: "none", color: "#0a0a0a", background: "#f7f9ff" },
  searchGo: { padding: "11px 20px", borderRadius: 14, background: "#002395", color: "#fff", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer" },
  searchHint: { fontSize: 12, color: "#aaa", marginTop: 12 },
  section: { padding: "64px 40px" },
  sectionBadge: { display: "inline-flex", alignItems: "center", gap: 6, background: "#f0f4ff", borderRadius: 999, padding: "5px 14px", fontSize: 12, color: "#002395", fontWeight: 500, marginBottom: 18 },
  sectionTitle: { fontSize: 28, fontWeight: 500, letterSpacing: "-0.5px", lineHeight: 1.25, marginBottom: 10 },
  sectionSub: { fontSize: 14, color: "#888", lineHeight: 1.65, marginBottom: 36, maxWidth: 480 },
  featGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 },
  featCard: { background: "#fff", borderRadius: 24, padding: 24 },
  featIconWrap: { width: 48, height: 48, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  featName: { fontSize: 14, fontWeight: 500, color: "#0a0a0a", marginBottom: 8 },
  featDesc: { fontSize: 13, color: "#888", lineHeight: 1.6 },
  featPill: { display: "inline-block", marginTop: 14, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999 },
  elusGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 },
  eluCard: { background: "#f7f9ff", borderRadius: 24, padding: 24, border: "1.5px solid #e8edf8" },
  eluIconBg: { width: 44, height: 44, borderRadius: 14, background: "#002395", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  eluName: { fontSize: 15, fontWeight: 500, color: "#0a0a0a", marginBottom: 6 },
  eluDesc: { fontSize: 13, color: "#777", lineHeight: 1.6, marginBottom: 10 },
  eluData: { fontSize: 11, color: "#aaa", lineHeight: 1.8 },
  eluCount: { display: "inline-block", marginTop: 12, fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999, background: "#fff", color: "#002395", border: "1px solid #e0e8ff" },
  maireNote: { marginTop: 16, background: "#fffbf0", borderRadius: 16, padding: "14px 18px", fontSize: 13, color: "#777", lineHeight: 1.65, border: "1.5px solid #fde9b0" },
  cta: { margin: "0 40px 64px", background: "#002395", borderRadius: 32, padding: "56px 48px", textAlign: "center", position: "relative", overflow: "hidden" },
  ctaEye: { fontSize: 12, letterSpacing: 2, color: "#fff", opacity: 0.4, marginBottom: 16 },
  ctaTitle: { fontSize: 30, fontWeight: 500, color: "#fff", lineHeight: 1.3, letterSpacing: "-0.5px", marginBottom: 10 },
  ctaSub: { fontSize: 14, color: "#fff", opacity: 0.55, marginBottom: 32 },
  ctaBtns: { display: "flex", gap: 10, justifyContent: "center" },
  ctaBtnW: { background: "#fff", color: "#002395", fontSize: 13, fontWeight: 500, padding: "11px 24px", borderRadius: 999, border: "none", cursor: "pointer" },
  ctaBtnO: { background: "transparent", color: "#fff", fontSize: 13, padding: "11px 24px", borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.25)", cursor: "pointer" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderTop: "1px solid #f0f0f0" },
  footerTxt: { fontSize: 12, color: "#ccc" },
  footerLinks: { display: "flex", gap: 20 },
  footerLink: { fontSize: 12, color: "#bbb", textDecoration: "none" },
}

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery]   = useState("")
  const [postal, setPostal] = useState("")
  const [mode, setMode]     = useState("nom")
  const [stats, setStats]   = useState({ deputes: 577, senateurs: 348, elus_avec_affaires: null, total_procedures: null })

  useEffect(() => {
    fetch(`${API}/stats`)
      .then(r => r.json())
      .then(d => setStats(d))
      .catch(() => {})
  }, [])

  const go = () => {
    if (mode === "nom" && query.trim()) {
      navigate(`/app?name=${encodeURIComponent(query.trim())}`)
    } else if (mode === "postal" && postal.trim()) {
      navigate(`/app?cp=${encodeURIComponent(postal.trim())}`)
    }
  }

  return (
    <div style={s.page}>

      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navLogo} onClick={() => navigate("/")}>
          <svg width="26" height="26" viewBox="0 0 144 144" xmlns="http://www.w3.org/2000/svg">
            <polygon points="72,4 124,32 124,112 72,140 20,112 20,32" fill="#002395"/>
            <clipPath id="hx"><polygon points="72,4 124,32 124,112 72,140 20,112 20,32"/></clipPath>
            <rect x="20" y="4" width="35" height="136" fill="#4a7fd4" clipPath="url(#hx)" opacity="0.5"/>
            <rect x="55" y="4" width="34" height="136" fill="#fff" clipPath="url(#hx)" opacity="0.25"/>
            <rect x="89" y="4" width="35" height="136" fill="#ED2939" clipPath="url(#hx)" opacity="0.45"/>
            <path d="M38,72 Q72,48 106,72 Q72,96 38,72 Z" fill="#fff"/>
            <circle cx="72" cy="72" r="15" fill="#4a7fd4"/>
            <circle cx="72" cy="72" r="7" fill="#001a6e"/>
            <circle cx="77" cy="67" r="3.5" fill="#fff" opacity="0.9"/>
            <path d="M38,72 Q72,48 106,72 Q72,96 38,72 Z" fill="none" stroke="#fff" strokeWidth="2.5"/>
          </svg>
          <span style={s.navName}>TranspaFrance</span>
        </div>
        <div style={s.navLinks}>
          <span style={s.navLink}>Les élus</span>
          <Link to="/affaires" style={s.navLink}>Affaires judiciaires</Link>
          <Link to="/sources" style={s.navLink}>Sources</Link>
        </div>
        <button style={s.navBtn} onClick={() => navigate("/app")}>Rechercher un élu</button>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroBadge}>
          <div style={s.heroDot}/>
          Transparence politique française
        </div>
        <h1 style={s.heroTitle}>
          Vos élus.<br/>
          Leurs votes, leurs mandats,<br/>
          <span style={{ color: "#ED2939" }}>leurs indemnités.</span>
        </h1>
        <p style={s.heroSub}>
          Des données publiques centralisées pour vous permettre de voter en connaissance de cause. Ni à gauche ni à droite.
        </p>
        <div style={s.searchCard}>
          <div style={s.searchModes}>
            {[{ id: "nom", label: "Par nom" }, { id: "postal", label: "Par code postal" }].map(t => (
              <div
                key={t.id}
                onClick={() => setMode(t.id)}
                style={{
                  fontSize: 12, fontWeight: 500, padding: "5px 14px", borderRadius: 999, cursor: "pointer",
                  background: mode === t.id ? "#002395" : "transparent",
                  color: mode === t.id ? "#fff" : "#888",
                  border: mode === t.id ? "1px solid #002395" : "1px solid transparent",
                }}
              >{t.label}</div>
            ))}
          </div>
          <div style={s.searchRow}>
            {mode === "nom" ? (
              <AutocompleteInput
                value={query}
                onChange={val => setQuery(val)}
                onSelect={nom => navigate(`/app?name=${encodeURIComponent(nom)}`)}
                onEnter={go}
                style={s.searchInput}
                placeholder="Larcher, Macron..."
              />
            ) : (
              <input
                style={s.searchInput}
                value={postal}
                onChange={e => setPostal(e.target.value.replace(/\D/g, "").slice(0, 5))}
                onKeyDown={e => e.key === "Enter" && go()}
                placeholder="69, 75, 69001, 13008..."
                maxLength={5}
              />
            )}
            <button style={s.searchGo} onClick={go}>Rechercher</button>
          </div>
          <p style={s.searchHint}>
            Vous ne connaissez pas son nom ?{" "}
            <span style={{ color: "#002395", fontWeight: 500, cursor: "pointer" }} onClick={() => setMode("postal")}>
              Entrez votre code postal
            </span>
          </p>
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0" }}>
        {[
          { num: stats.deputes,            red: false, label: "Députés indexés",         href: null },
          { num: stats.senateurs,          red: false, label: "Sénateurs indexés",       href: null },
          { num: stats.elus_avec_affaires, red: true,  label: "Élus avec affaires",      href: "/affaires" },
          { num: stats.total_procedures,   red: true,  label: "Procédures répertoriées", href: "/affaires" },
          { num: "100%",                   red: false, label: "Données publiques",       href: "/sources" },
        ].map((st, i, arr) => {
          const inner = (
            <>
              <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.5px", color: st.href && !st.red ? "#002395" : st.red ? "#ED2939" : "#002395" }}>
                {st.num ?? "—"}
              </div>
              <div style={{ fontSize: 12, color: st.href ? "#888" : "#aaa", marginTop: 3, textDecoration: st.href ? "underline" : "none" }}>
                {st.label}
              </div>
            </>
          )
          const cellStyle = { flex: 1, padding: "22px 0", textAlign: "center", display: "block", borderRight: i < arr.length - 1 ? "1px solid #f0f0f0" : "none" }
          return st.href ? (
            <Link key={st.label} to={st.href} style={{ ...cellStyle, textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f7f9ff"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {inner}
            </Link>
          ) : (
            <div key={st.label} style={cellStyle}>{inner}</div>
          )
        })}
      </div>

      {/* Features */}
      <section style={s.section}>
        <div style={s.sectionBadge}>Ce que vous pouvez vérifier</div>
        <h2 style={s.sectionTitle}>Tout ce que votre élu<br/>ne vous dira pas.</h2>
        <p style={s.sectionSub}>Aucune opinion, aucun filtre politique. Des faits, des chiffres, des sources officielles.</p>
        <div style={s.featGrid}>
          {FEATURES.map(f => (
            <div key={f.name} style={{ ...s.featCard, border: `1.5px solid ${f.borderColor}` }}>
              <div style={{ ...s.featIconWrap, background: f.iconBg }}>{f.icon}</div>
              <div style={s.featName}>{f.name}</div>
              <div style={s.featDesc}>{f.desc}</div>
              <span style={{ ...s.featPill, background: f.tagBg, color: f.tagColor }}>{f.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Élus */}
      <section style={{ ...s.section, paddingTop: 0 }}>
        <div style={s.sectionBadge}>Qui pouvez-vous rechercher</div>
        <h2 style={s.sectionTitle}>Tous vos représentants,<br/>quel que soit leur mandat.</h2>
        <p style={s.sectionSub}>De votre commune à Bruxelles — retrouvez et évaluez n'importe quel élu français.</p>
        <div style={s.elusGrid}>
          {ELUS.map(e => (
            <div key={e.name} style={s.eluCard}>
              <div style={s.eluIconBg}>{e.icon}</div>
              <div style={s.eluName}>{e.name}</div>
              <div style={s.eluDesc}>{e.desc}</div>
              <div style={s.eluData}>{e.data}</div>
              <span style={s.eluCount}>{e.count}</span>
            </div>
          ))}
        </div>
        <div style={s.maireNote}>
          <strong style={{ fontWeight: 500, color: "#555" }}>Et les maires ?</strong> TranspaFrance permet de retrouver le maire de n'importe quelle commune via votre code postal. Les données disponibles sont aujourd'hui limitées — affaires judiciaires et cumul de mandats. Une section dédiée est prévue avec les budgets communaux et marchés publics.
        </div>
      </section>

      {/* CTA */}
      <div style={s.cta}>
        <p style={s.ctaEye}>AVANT DE VOTER</p>
        <h2 style={s.ctaTitle}>Informé aujourd'hui.<br/>Libre de voter demain.</h2>
        <p style={s.ctaSub}>Ni à gauche ni à droite. Pour la transparence.</p>
        <div style={s.ctaBtns}>
          <button style={s.ctaBtnW} onClick={() => navigate("/app")}>Rechercher un élu</button>
          <button style={s.ctaBtnO} onClick={() => navigate("/app")}>Trouver mes élus par code postal</button>
        </div>
      </div>

      {/* Footer */}
      <footer style={s.footer}>
        <span style={s.footerTxt}>TranspaFrance — données publiques françaises</span>
        <div style={s.footerLinks}>
          <Link to="/sources" style={s.footerLink}>Sources</Link>
          <span style={s.footerLink}>À propos</span>
          <span style={s.footerLink}>Contact</span>
        </div>
      </footer>

    </div>
  )
}
