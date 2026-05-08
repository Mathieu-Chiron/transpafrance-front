export function hoverBord(hex, alpha = 0.15) {
  if (!hex) return "#ddeeff"
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const BORD_COULEUR = {
  "Extrême gauche":  "#C0392B",
  "Gauche radicale": "#E74C3C",
  "Gauche":          "#E91E63",
  "Centre gauche":   "#9C27B0",
  "Centre":          "#2196F3",
  "Centre droit":    "#1565C0",
  "Droite":          "#0D47A1",
  "Droite nationale":"#37474F",
  "Extrême droite":  "#212121",
}
