import { cores, fonte } from "../../../brincario/tema";

// Texto SVG branco com contorno índigo (lê bem no mar agitado e no pôr do sol)
export const textoSvg = (tamanho: number) =>
  ({
    fontFamily: fonte,
    fontWeight: 900,
    fontSize: tamanho,
    fill: cores.branco,
    stroke: cores.texto,
    strokeWidth: Math.max(7, tamanho / 6),
    paintOrder: "stroke",
    strokeLinejoin: "round",
    textAnchor: "middle",
  }) as const;

export const limitar = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
