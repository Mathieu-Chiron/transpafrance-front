import { useNavigate } from "react-router-dom"

const SOURCES = [
  {
    nom: "Répertoire National des Élus (RNE)",
    url: "https://www.data.gouv.fr/fr/datasets/repertoire-national-des-elus-1/",
    description: "Base officielle du ministère de l'Intérieur listant tous les mandats en cours des élus français : nom, prénom, date de naissance, profession, parti, département.",
    usage: "Identité, mandats en cours, type de mandat (député / sénateur)",
    editeur: "Ministère de l'Intérieur / data.gouv.fr",
    acces: "Open Data — Licence Ouverte Etalab",
  },
  {
    nom: "NosDéputés.fr",
    url: "https://www.nosdeputes.fr",
    description: "Site citoyen agrégeant les données de l'Assemblée nationale : présences en commission, votes, interventions en séance, groupes parlementaires, responsabilités.",
    usage: "Votes, présences, responsabilités, anciens mandats",
    editeur: "Regards Citoyens",
    acces: "API publique JSON",
  },
  {
    nom: "Haute Autorité pour la Transparence de la Vie Publique (HATVP)",
    url: "https://www.hatvp.fr",
    description: "Autorité indépendante centralisant les déclarations de patrimoine et d'intérêts des élus et hauts fonctionnaires. Obligatoire pour tous les parlementaires.",
    usage: "Déclarations de patrimoine, transparence financière",
    editeur: "HATVP",
    acces: "Recherche publique sur hatvp.fr",
  },
  {
    nom: "Casier-politique.fr",
    url: "https://casier-politique.fr",
    description: "Base de données citoyenne recensant les condamnations judiciaires, mises en examen et procédures en cours visant des responsables politiques français.",
    usage: "Condamnations, procédures judiciaires, affaires en cours",
    editeur: "Association citoyenne indépendante",
    acces: "Site public",
  },
  {
    nom: "Open Data de l'Assemblée Nationale",
    url: "https://data.assemblee-nationale.fr",
    description: "Données officielles publiées par l'Assemblée nationale : dossiers législatifs, amendements, propositions de loi, scrutins publics.",
    usage: "Propositions de loi, amendements, activité parlementaire",
    editeur: "Assemblée Nationale",
    acces: "Open Data — Licence Ouverte",
  },
  {
    nom: "Wikipédia",
    url: "https://fr.wikipedia.org",
    description: "Encyclopédie collaborative utilisée pour compléter les informations biographiques : photo, résumé, appartenance politique, parcours.",
    usage: "Photo, biographie, bord politique",
    editeur: "Wikimedia Foundation",
    acces: "API MediaWiki publique",
  },
]

export default function Sources() {
  const navigate = useNavigate()

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
          Sources de données
        </h1>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 40 }}>
          TranspaFrance agrège exclusivement des données publiques et officielles. Voici les 6 sources utilisées.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {SOURCES.map((s, i) => (
            <div key={i} style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 10, padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <a href={s.url} target="_blank" rel="noreferrer"
                    style={{ fontSize: 16, fontWeight: 700, color: "#002395", textDecoration: "none" }}>
                    {s.nom}
                  </a>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.editeur}</div>
                </div>
                <span style={{ fontSize: 11, background: "#f0f4ff", color: "#002395", borderRadius: 4, padding: "3px 10px", whiteSpace: "nowrap" }}>
                  {s.acces}
                </span>
              </div>
              <p style={{ fontSize: 14, color: "#444", margin: "12px 0 8px", lineHeight: 1.6 }}>{s.description}</p>
              <div style={{ fontSize: 12, color: "#888" }}>
                <span style={{ fontWeight: 600, color: "#555" }}>Utilisé pour : </span>{s.usage}
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "#aaa", marginTop: 40 }}>
          Toutes les données sont 100% publiques. Aucune donnée personnelle n'est collectée par TranspaFrance.
        </p>
      </div>
    </div>
  )
}
