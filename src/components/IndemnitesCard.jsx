const SMIC_BRUT   = 1766.92  // SMIC brut mensuel 2024
const SALAIRE_MED = 2340     // Salaire médian France 2023

const INDEMNITE_MAIRE = { label: "Maire", mensuel: 2500 }

const POSTES = {
  brut: {
    label:  "Indemnité parlementaire brute",
    detail: "Rémunération mensuelle fixée par ordonnance. Soumise à cotisations sociales et impôt sur le revenu comme tout salaire.",
  },
  frais: {
    label:  "Frais de mandat",
    detail: "Forfait mensuel versé automatiquement, sans obligation de justificatif ni contrôle a posteriori.",
  },
  collabs: {
    label:  "Budget collaborateurs",
    detail: "Enveloppe pour rémunérer jusqu'à 5 assistants parlementaires. Embauche libre, sans appel d'offres ni contrôle d'usage.",
  },
}

function fmt(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)
}

function TotalLigne({ label, montant, sub, comparaisons, bg, textColor, subColor, chipBg, chipBorder, chipText }) {
  return (
    <div style={{ background: bg || "#f7f7f5", borderRadius: 10, padding: "16px 20px" }}>
      <div style={{ fontSize: 11, color: subColor || "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: textColor || "#1a1a1a", lineHeight: 1 }}>
          {fmt(montant)}
        </span>
        <span style={{ fontSize: 13, color: subColor || "#888" }}>/mois</span>
        <span style={{ fontSize: 12, color: subColor || "#888" }}>· {fmt(montant * 12)}/an</span>
      </div>
      {comparaisons && (
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          {comparaisons.map(({ ref, label: lbl }) => (
            <div key={lbl} style={{
              background: chipBg || "#fff",
              borderRadius: 7, padding: "6px 11px",
              border: `0.5px solid ${chipBorder || "#e8e8e4"}`,
              fontSize: 12, color: chipText || "#666",
            }}>
              <strong style={{ color: textColor || "#1a1a1a" }}>{(montant / ref).toFixed(1)}×</strong> {lbl}
            </div>
          ))}
        </div>
      )}
      {sub && <div style={{ fontSize: 11, color: subColor || "#999", marginTop: 8 }}>{sub}</div>}
    </div>
  )
}

function PosteLigne({ poste, montant, last }) {
  return (
    <div style={{ padding: "13px 0", borderBottom: last ? "none" : "0.5px solid #f0f0ee" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a1a" }}>{poste.label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", whiteSpace: "nowrap", flexShrink: 0 }}>
          {fmt(montant)}<span style={{ fontSize: 11, fontWeight: 400, color: "#999" }}> /mois</span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#888", marginTop: 3, lineHeight: 1.5 }}>{poste.detail}</div>
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

  const mandatsRne  = mandats?.mandats_rne || []
  const estMaire    = mandatsRne.some(r => r.type === "Maire")
  const bonusMaire  = estMaire ? INDEMNITE_MAIRE.mensuel : 0

  const percoit     = brut + frais + bonusMaire       // ce que perçoit l'élu
  const coutTotal   = brut + frais + collabs + bonusMaire  // coût contribuable

  const lignes = [
    { poste: POSTES.brut,  montant: brut },
    { poste: POSTES.frais, montant: frais },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Ligne 1 : ce que perçoit l'élu — fond bleu pâle */}
      <TotalLigne
        label={`Ce que perçoit le ${typeMandat === "senateur" ? "sénateur" : "député"}`}
        montant={percoit}
        comparaisons={[
          { ref: SMIC_BRUT,   label: "le SMIC brut" },
          { ref: SALAIRE_MED, label: "le salaire médian" },
        ]}
        sub={estMaire ? `Dont ~${fmt(bonusMaire)}/mois d'indemnité de maire` : null}
        bg="#E6F1FB" textColor="#0C447C" subColor="#4a7ab0" chipBg="#fff" chipBorder="#c2d9f0" chipText="#0C447C"
      />

      {/* Détail brut + frais */}
      <div>
        <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, margin: "4px 0 6px" }}>
          Détail
        </div>
        <div style={{ background: "#fafaf8", borderRadius: 10, padding: "0 16px", border: "0.5px solid #eee" }}>
          {lignes.map(({ poste, montant }, i) => (
            <PosteLigne key={poste.label} poste={poste} montant={montant} last={i === lignes.length - 1} />
          ))}
        </div>
      </div>

      {/* Budget collaborateurs — fond ambre distinct */}
      <div style={{ background: "#fffbf0", borderRadius: 10, padding: "16px 20px", border: "1.5px solid #fde9b0" }}>
        <div style={{ fontSize: 11, color: "#BA7517", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
          Budget collaborateurs
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#7a4a00", lineHeight: 1 }}>{fmt(collabs)}</span>
          <span style={{ fontSize: 13, color: "#BA7517" }}>/mois</span>
          <span style={{ fontSize: 12, color: "#BA7517" }}>· {fmt(collabs * 12)}/an</span>
        </div>
        <div style={{ fontSize: 12, color: "#9a6200", marginTop: 8, lineHeight: 1.55 }}>
          {POSTES.collabs.detail}
        </div>
      </div>

      {/* Ligne 2 : coût total contribuable — fond rouge pâle */}
      <TotalLigne
        label="Coût total pour le contribuable"
        montant={coutTotal}
        sub={`Indemnités + frais + budget collaborateurs`}
        bg="#FCEBEB" textColor="#791F1F" subColor="#a04040" chipBg="#fff" chipBorder="#f0c5c5" chipText="#791F1F"
      />

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
