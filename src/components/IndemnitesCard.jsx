const SMIC_BRUT    = 1766.92   // SMIC brut mensuel 2024
const SALAIRE_MED  = 2340      // Salaire médian France 2023

// Indemnités mairie estimées selon taille commune (source: DGCL)
const INDEMNITE_MAIRE = {
  label:   "Maire",
  mensuel: 2500,
  note:    "estimation moyenne toutes communes",
}

function fmt(n) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n)
}

function Ratio({ valeur, reference, label }) {
  const r = (valeur / reference).toFixed(1)
  return (
    <span style={{ fontSize: 12, color: "#666" }}>
      <strong style={{ color: "#1a1a1a" }}>{r}×</strong> {label}
    </span>
  )
}

function Ligne({ label, montant, note, highlight }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: "10px 0", borderBottom: "0.5px solid #f0f0ee", gap: 12,
    }}>
      <div>
        <div style={{ fontSize: 13, color: "#333", fontWeight: highlight ? 500 : 400 }}>{label}</div>
        {note && <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{note}</div>}
      </div>
      <div style={{
        fontSize: 14, fontWeight: 600, color: highlight ? "#1a1a1a" : "#555",
        whiteSpace: "nowrap", flexShrink: 0,
      }}>
        {fmt(montant)} <span style={{ fontWeight: 400, fontSize: 11, color: "#999" }}>/mois</span>
      </div>
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

  // Détection cumul depuis mandats_rne
  const mandatsRne   = mandats?.mandats_rne || []
  const estMaire     = mandatsRne.some(m => m.type === "Maire")
  const totalCumul   = brut + (estMaire ? INDEMNITE_MAIRE.mensuel : 0)
  const hasCumul     = estMaire

  const labelMandat  = typeMandat === "senateur" ? "Sénateur" : "Député"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Indemnité principale */}
      <div style={{ background: "#f7f7f5", borderRadius: 12, padding: "18px 20px" }}>
        <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Indemnité parlementaire brute
        </div>
        <div style={{ fontSize: 36, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>
          {fmt(brut)}
          <span style={{ fontSize: 14, fontWeight: 400, color: "#888", marginLeft: 6 }}>/mois</span>
        </div>
        <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
          soit {fmt(brut * 12)} / an
        </div>

        {/* Comparaisons */}
        <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
          <div style={{ background: "#fff", borderRadius: 8, padding: "8px 14px", border: "0.5px solid #e8e8e4" }}>
            <Ratio valeur={brut} reference={SMIC_BRUT} label="le SMIC brut" />
          </div>
          <div style={{ background: "#fff", borderRadius: 8, padding: "8px 14px", border: "0.5px solid #e8e8e4" }}>
            <Ratio valeur={brut} reference={SALAIRE_MED} label="le salaire médian français" />
          </div>
        </div>
      </div>

      {/* Cumul si détecté */}
      {hasCumul && (
        <div style={{ background: "#FAEEDA", borderRadius: 12, padding: "16px 20px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#633806", marginBottom: 10 }}>
            Cumul de mandats détecté — estimation du total
          </div>
          <Ligne label={labelMandat} montant={brut} highlight />
          <Ligne label={`+ ${INDEMNITE_MAIRE.label}`} montant={INDEMNITE_MAIRE.mensuel} note={INDEMNITE_MAIRE.note} />
          <div style={{
            display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 2,
            fontSize: 14, fontWeight: 700, color: "#633806",
          }}>
            <span>Total estimé</span>
            <span>~{fmt(totalCumul)} /mois</span>
          </div>
        </div>
      )}

      {/* Frais et budget */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Autres dotations
        </div>
        <div style={{ background: "#fafaf8", borderRadius: 10, padding: "4px 16px", border: "0.5px solid #eee" }}>
          <Ligne
            label="Frais de mandat"
            montant={frais}
            note="Non contrôlés, non justifiés — remboursés automatiquement"
          />
          <Ligne
            label="Budget collaborateurs"
            montant={collabs}
            note="Embauche libre, sans appel d'offres"
          />
          <div style={{ padding: "10px 0", fontSize: 12, color: "#aaa" }}>
            <strong style={{ color: "#888" }}>Total dotations</strong>
            {" "}(hors indemnité) : <strong style={{ color: "#555" }}>{fmt(frais + collabs)} /mois</strong>
          </div>
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
