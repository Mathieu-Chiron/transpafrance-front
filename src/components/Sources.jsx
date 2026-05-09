const SOURCES = [
  {
    titre:     "Mandats & Élus",
    icon:      "🏛️",
    sous_titre: "Répertoire National des Élus (RNE)",
    officiel:  true,
    url:       "https://www.data.gouv.fr/datasets/repertoire-national-des-elus-1",
    points: [
      "Source officielle du gouvernement français, mise à jour régulièrement par le ministère de l'Intérieur",
      "Recense tous les élus en exercice : députés, sénateurs, maires, conseillers régionaux et départementaux, députés européens",
      "Permet de détecter les cumuls de mandats : un élu apparaissant dans plusieurs catégories exerce plusieurs fonctions simultanément",
      "Données disponibles sur data.gouv.fr, plateforme open data de l'État",
    ]
  },
  {
    titre:     "Biographie & Parti politique",
    icon:      "📖",
    sous_titre: "Wikipedia & Wikidata",
    officiel:  false,
    url:       "https://fr.wikipedia.org",
    points: [
      "Encyclopédie collaborative, source la plus complète pour les biographies politiques françaises",
      "Fournit le résumé biographique, la photo, la date de naissance et le parti politique déclaré",
      "Le bord politique (gauche, droite, centre...) est déduit du parti via une classification établie par Politico",
      "Les données Wikidata permettent de récupérer des informations structurées et standardisées",
    ]
  },
  {
    titre:     "Votes & Activité parlementaire",
    icon:      "🗳️",
    sous_titre: "NosDéputés.fr — Regards Citoyens",
    officiel:  false,
    url:       "https://www.nosdeputes.fr",
    points: [
      "Site citoyen géré par l'association Regards Citoyens, agrégeant les données officielles de l'Assemblée nationale",
      "Recense les votes de chaque député sur les textes de loi, avec leur position (pour, contre, abstention)",
      "Publie les statistiques mensuelles d'activité : présences, interventions, questions, amendements",
      "⚠️ Les données couvrent principalement la 16e législature (2022-2024) — la 17e est en cours d'intégration",
    ]
  },
  {
    titre:     "Propositions de loi & Amendements",
    icon:      "📋",
    sous_titre: "NosDéputés.fr — Regards Citoyens",
    officiel:  false,
    url:       "https://www.nosdeputes.fr",
    points: [
      "Recense les textes de loi déposés ou co-signés par chaque parlementaire",
      "Liste les amendements proposés, leur objet, leur sort (adopté, rejeté, tombé) et le texte concerné",
      "Chaque document est lié à sa source officielle sur le site de l'Assemblée nationale",
      "⚠️ Couvre la 16e législature — données partielles pour la législature en cours",
    ]
  },
  {
    titre:     "Indemnités parlementaires",
    icon:      "💰",
    sous_titre: "Assemblée Nationale & Sénat",
    officiel:  true,
    url:       "https://www.assemblee-nationale.fr/dyn/synthese/deputes-groupes-parlementaires/la-situation-materielle-du-depute",
    points: [
      "Les indemnités parlementaires sont fixées par la loi et identiques pour tous les élus du même type",
      "Député : 7 637 € brut/mois + 5 950 € de frais de mandat + 11 463 € de crédit collaborateurs",
      "Sénateur : 7 637 € brut/mois + 6 600 € de frais de mandat + 7 548 € de crédit collaborateurs",
      "⚠️ Il n'existe pas de base publique publiant les montants individualisés — les retenues pour absences ne sont pas rendues publiques",
    ]
  },
  {
    titre:     "Condamnations judiciaires",
    icon:      "⚖️",
    sous_titre: "Casier Politique",
    officiel:  false,
    url:       "https://casier-politique.fr",
    points: [
      "Site indépendant recensant les condamnations pénales des personnalités politiques françaises, tous mandats confondus",
      "Les données sont extraites de Wikipedia et des décisions de justice rendues publiques",
      "Chaque condamnation est classée : ⚫ Définitif (cassation) · 🔴 En appel · 🟠 1re instance",
      "⚠️ Cette base n'est pas exhaustive — seules les condamnations médiatisées ou documentées sont répertoriées",
    ]
  },
  {
    titre:     "Affaires & Actualités judiciaires",
    icon:      "📰",
    sous_titre: "NewsAPI",
    officiel:  false,
    url:       "https://newsapi.org",
    points: [
      "Agrégateur de presse permettant de retrouver les articles récents mentionnant une personnalité",
      "Les articles sont classés automatiquement : actualités générales vs affaires judiciaires",
      "Détection par mots-clés : mise en examen, condamné, procès, corruption, fraude...",
      "⚠️ Cette détection est automatique et peut contenir des faux positifs — toujours vérifier la source originale",
    ]
  },
  {
    titre:     "Déclarations d'intérêts & Patrimoine",
    icon:      "🔍",
    sous_titre: "Haute Autorité pour la Transparence de la Vie Publique",
    officiel:  true,
    url:       "https://www.hatvp.fr",
    points: [
      "La HATVP publie les déclarations obligatoires de patrimoine et d'intérêts de tous les élus",
      "Ces déclarations permettent de vérifier les conflits d'intérêts potentiels et l'évolution du patrimoine",
      "Tous les ministres, parlementaires et hauts fonctionnaires sont soumis à cette obligation de transparence",
      "⚠️ Politico renvoie directement vers la fiche HATVP — les données ne sont pas encore intégrées dans l'API",
    ]
  },
]

export default function Sources() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>

      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>À propos des sources</h2>
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>
          Politico agrège des données provenant de plusieurs sources publiques et indépendantes.
          Voici comment chaque information est collectée et ce que cela implique en termes de fiabilité.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {SOURCES.map((s, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              border: "0.5px solid #e5e5e5",
              borderRadius: 10,
              padding: "16px 20px",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
                  {s.icon} {s.titre}
                </div>
                <div style={{ fontSize: 13, color: "#666" }}>{s.sous_titre}</div>
              </div>

              {/* Encart source */}
              
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: s.officiel ? "0.5px solid #C0392B" : "0.5px solid #999",
                  background: s.officiel ? "#FEF0EE" : "#f9f9f9",
                  color: s.officiel ? "#C0392B" : "#555",
                  fontSize: 11,
                  fontWeight: 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {s.officiel && <span>🇫🇷</span>}
                <span>{s.officiel ? "Source officielle" : "Source indépendante"}</span>
                <span style={{ fontSize: 10, opacity: 0.7 }}>↗</span>
              </a>
            </div>

            {/* Points */}
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {s.points.map((p, j) => (
                <li
                  key={j}
                  style={{
                    fontSize: 13,
                    color: p.startsWith("⚠️") ? "#854F0B" : "#444",
                    background: p.startsWith("⚠️") ? "#FAEEDA" : "transparent",
                    padding: p.startsWith("⚠️") ? "4px 8px" : "0",
                    borderRadius: p.startsWith("⚠️") ? 4 : 0,
                    lineHeight: 1.5,
                    paddingLeft: p.startsWith("⚠️") ? 8 : 16,
                    position: "relative",
                  }}
                >
                  {!p.startsWith("⚠️") && (
                    <span style={{ position: "absolute", left: 4, color: "#bbb" }}>·</span>
                  )}
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, padding: "12px 16px", background: "#f7f7f5", borderRadius: 8, fontSize: 12, color: "#999" }}>
        Politico est un projet indépendant à but non lucratif. Les données sont collectées automatiquement depuis des sources publiques.
        En cas d'erreur ou d'omission, contactez-nous.
      </div>
    </div>
  )
}
