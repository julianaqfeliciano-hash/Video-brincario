import React from "react";
import { cores, fonte } from "../tema";

/** Selo de benefício: pílula creme-clara com ícone num círculo sálvia (ESTILO.md §2.5). */
export const Selo: React.FC<{
  icone: React.ReactNode;
  progresso: number;
  children: React.ReactNode;
}> = ({ icone, progresso, children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 16,
      height: 80,
      padding: "0 30px 0 12px",
      borderRadius: 40,
      background: cores.cremeClaro,
      border: `4px solid ${cores.salvia}`,
      boxShadow: "0 10px 26px rgba(59,51,46,0.10)",
      fontFamily: fonte,
      fontWeight: 800,
      fontSize: 40,
      color: cores.texto,
      opacity: Math.min(1, progresso * 1.5),
      transform: `scale(${0.6 + 0.4 * progresso})`,
      whiteSpace: "nowrap",
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        background: cores.salvia,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icone}
    </div>
    {children}
  </div>
);

// Ícones prontos (34x34, creme sobre o círculo sálvia)
export const IconeSom: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 34 34">
    <path
      d="M5 13 H11 L18 7 V27 L11 21 H5 Z"
      fill={cores.cremeClaro}
      strokeLinejoin="round"
    />
    <line
      x1={23}
      y1={12}
      x2={31}
      y2={22}
      stroke={cores.cremeClaro}
      strokeWidth={3.5}
      strokeLinecap="round"
    />
    <line
      x1={31}
      y1={12}
      x2={23}
      y2={22}
      stroke={cores.cremeClaro}
      strokeWidth={3.5}
      strokeLinecap="round"
    />
  </svg>
);

export const IconeMochila: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 34 34">
    <path
      d="M12 8 Q12 3 17 3 Q22 3 22 8"
      fill="none"
      stroke={cores.cremeClaro}
      strokeWidth={3}
    />
    <rect x={6} y={8} width={22} height={23} rx={7} fill={cores.cremeClaro} />
    <rect x={11} y={18} width={12} height={8} rx={3} fill={cores.salvia} />
  </svg>
);

export const IconeLugar: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 34 34">
    <path
      d="M17 31 C9 21 7 17 7 13 A10 10 0 0 1 27 13 C27 17 25 21 17 31 Z"
      fill={cores.cremeClaro}
    />
    <circle cx={17} cy={13} r={4} fill={cores.salvia} />
  </svg>
);
