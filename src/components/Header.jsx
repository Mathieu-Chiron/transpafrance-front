export default function Header() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.5rem" }}>
      <img
        src="/logo.svg"
        alt="TranspaFrance"
        style={{ width: 48, height: 48 }}
      />
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 2, color: "#002395" }}>
          TranspaFrance
        </h1>
        <p style={{ fontSize: 12, color: "#999", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Transparence politique
        </p>
      </div>
    </div>
  )
}
