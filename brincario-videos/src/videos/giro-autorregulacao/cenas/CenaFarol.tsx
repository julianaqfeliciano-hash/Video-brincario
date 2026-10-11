import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores } from "../../../brincario/tema";
import { entrada, quadroDe, quando } from "../dados";
import { limitar } from "./estilo";

// ROTEIRO.md, cena 2: "Olhe o que pode te ajudar." — um farol acende e o facho chega ao barco.

export const CenaFarol: React.FC = () => {
  const frame = useCurrentFrame();
  const tOlhe = quando("olhe");
  const tFim = quando("eu") - 0.05;
  const eFarol = entrada(frame, tOlhe);
  // Facho: de cima para baixo até apontar para o barco
  const ang = interpolate(
    frame,
    [quadroDe(tOlhe), quadroDe(tOlhe) + 18],
    [143, 47], // de cima-esquerda até apontar para o barco
    {
      ...limitar,
      easing: (x) => 1 - (1 - x) ** 3,
    },
  );
  const brilho = 0.75 + 0.25 * Math.sin(frame / 3);
  return (
    <Cena inicio={tOlhe} fim={tFim}>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        <g transform={`translate(0 ${60 * (1 - eFarol)})`} opacity={eFarol}>
          {/* Facho de luz */}
          <g
            transform={`translate(930 400) rotate(${ang})`}
            opacity={0.55 * brilho}
          >
            <path d="M0 0 L-90 520 L90 520 Z" fill="#FFF3A6" />
          </g>
          {/* Rochedo e farol */}
          <path
            d="M840 660 Q930 600 1040 650 L1080 700 L820 700 Z"
            fill="#3B3F57"
            stroke={cores.texto}
            strokeWidth={6}
          />
          <path
            d="M890 640 L906 420 L954 420 L970 640 Z"
            fill={cores.branco}
            stroke={cores.texto}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          {[470, 540, 610].map((y) => (
            <path
              key={y}
              d={`M${903 - (y - 420) * 0.07} ${y} L${957 + (y - 420) * 0.07} ${y} L${958 + (y - 420) * 0.07} ${y + 26} L${902 - (y - 420) * 0.07} ${y + 26} Z`}
              fill={cores.terracota}
            />
          ))}
          <rect
            x={896}
            y={378}
            width={68}
            height={44}
            rx={8}
            fill="#FFE45C"
            stroke={cores.texto}
            strokeWidth={6}
          />
          <path
            d="M888 380 L930 344 L972 380 Z"
            fill={cores.terracota}
            stroke={cores.texto}
            strokeWidth={6}
            strokeLinejoin="round"
          />
          <circle
            cx={930}
            cy={400}
            r={40 * brilho}
            fill="#FFF3A6"
            opacity={0.6}
          />
        </g>
      </svg>
    </Cena>
  );
};
