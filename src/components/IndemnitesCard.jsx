const SMIC_BRUT   = 1766.92  // SMIC brut mensuel 2024
const SALAIRE_MED = 2340     // Salaire médian France 2023

const INDEMNITE_MAIRE = { label: "Maire", mensuel: 2500 }

const POSTES = {
  collabs: {
    label: "Budget collaborateurs",
    detail: "Enveloppe mensuelle pour rémunérer jusqu'à 5 assistants parlementaires. Embauche libre, sans appel d'offres ni contrôle d'usage.",
  },
  brut: {
    label: "Indemnité parlementaire brute",
    detail: "Rémunération mensuelle fixée par ordonnance. Soumise à cotisations sociales et impôt sur le revenu comme tout salaire.",
  },
  frais: {
    label: "Frais de mandat",
    detail: "Forfait mensuel pour couvrir les dépenses liées au mandat. Versé automatiquement, sans obligation de justificatif ni contrôle a posteriori.",
  },
}

function fmt(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)
}

function PosteLigne({ poste, montant, last }) {
  return (
    <div style={{
      padding: "14px 0",
      borderBottom: last ? "none" : "0.5px solid #f0f0ee",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{poste.label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap", flexShrink: 0 }}>
          {fmt(montant)}<span style={{ fontSize: 11, fontWeight: 400, color: "#999" }}> /mois</span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.5 }}>{poste.detail}</div>
    </div>
  )
}

export default function IndemnitesCard({ indemnites, mandats }) {
  if (!indemnites?.montants) return null

  const m          = indemnites.montants
  const typeMandat = indemnites.type_mandat || "depute"
  const brut       = m.brut_mensuel
  const frais      = m.frais_mandat
  const collabs    = m.credit_collaborateurs
  const source     = m.source

  const mandatsRne = mandats?.mandats_rne || []
  const estMaire   = mandatsRne.some(r => r.type === "Maire")
  const totalBase  = brut + frais + collabs
  const totalCumul = totalBase + (estMaire ? INDEMNITE_MAIRE.mensuel : 0)

  // Postes triés du plus élevé au plus faible
  const lignes = [
    { poste: POSTES.collabs, montant: collabs },
    { poste: POSTES.brut,    montant: brut },
    { poste: POSTES.frais,   montant: frais },
  ].sort((a, b) => b.montant - a.montant)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Total contribuable */}
      <div style={{ background: "#f7f7f5", borderRadius: 12, padding: "18px 20px" }}>
        <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Coût total pour le contribuable
        </div>
        <div style={{ fontSize: 38, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>
          {fmt(estMaire ? totalCumul : totalBase)}
          <span style={{ fontSize: 14, fontWeight: 400, color: "#888", marginLeft: 6 }}>/mois</span>
        </div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
          soit {fmt((estMaire ? totalCumul : totalBase) * 12)} / an
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
          {[
            { ref: SMIC_BRUT,   label: "le SMIC brut" },
            { ref: SALAIRE_MED, label: "le salaire médian" },
          ].map(({ ref, label }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 8, padding: "7px 12px", border: "0.5px solid #e8e8e4", fontSize: 12, color: "#666" }}>
              <strong style={{ color: "#1a1a1a" }}>{((estMaire ? totalCumul : totalBase) / ref).toFixed(1)}×</strong> {label}
            </div>
          ))}
        </div>
        {estMaire && (
          <div style={{ fontSize: 11, color: "#b35c00", marginTop: 10, background: "#FAEEDA", borderRadius: 6, padding: "6px 10px" }}>
            Cumul détecté : inclut ~{fmt(INDEMNITE_MAIRE.mensuel)}/mois d'indemnité de maire
          </div>
        )}
      </div>

      {/* Détail des postes */}
      <div>
        <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Détail
        </div>
        <div style={{ background: "#fafaf8", borderRadius: 10, padding: "0 16px", border: "0.5px solid #eee" }}>
          {lignes.map(({ poste, montant }, i) => (
            <PosteLigne key={poste.label} poste={poste} montant={montant} last={i === lignes.length - 1} />
          ))}
        </div>
      </div>

      {/* Source */}
      {source && (
        <div style={{ fontSize: 11, color: "#bbb" }}>
          Source :{" "}
          <a href={source} target="_blank" rel="noopener noreferrer" style={{ color: "#378ADD" }}>
            {typeMandat === "senateur" ? "Sénat" : "Assemblée nationale"}
          </a>
          {" "}— Montants légaux fixes, identiques pour tous les parlementaires du même type.
        </div>
      )}

    </div>
  )
}
