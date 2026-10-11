import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { MolduraBroll } from "../../../brincario/componentes/MolduraBroll";
import { cores } from "../../../brincario/tema";
import { midia, quando, salto } from "../dados";
import { textoSvg } from "./estilo";

// ROTEIRO.md, cena 7: "Enquanto a criança gira, os olhos acompanham o movimento,"
// B-roll das mãos girando o Giro de verdade + olhinhos seguindo em círculo com uma seta circular.

export const CenaOlhos: React.FC = () => {
  const frame = useCurrentFrame();
  const tEnquanto = quando("enquanto");
  const tGira = quando("gira", tEnquanto);
  const tOlhos = quando("olhos", tGira);
  const tFim = quando("as", tOlhos) - 0.05; // "as mãos sentem..."

  const eBroll = salto(frame, tGira);
  const eOlhos = salto(frame, tOlhos);
  const ang = frame / 5;
  const px = Math.cos(ang) * 14;
  const py = Math.sin(ang) * 14;

  return (
    <Cena inicio={tEnquanto} fim={tFim}>
      <MolduraBroll
        src={midia.broll("giro_broll.mp4")}
        x={60}
        y={272}
        largura={330}
        altura={340}
        inicio={tGira}
        fim={tFim}
        trechoInicio={0.4}
        progresso={eBroll}
      />
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        <g
          transform={`translate(790 430) scale(${0.5 + 0.5 * eOlhos})`}
          opacity={Math.min(1, eOlhos * 1.5)}
        >
          <circle cy={9} r={135} fill={cores.texto} />
          <circle
            r={135}
            fill={cores.cremeClaro}
            stroke={cores.texto}
            strokeWidth={7}
          />
          {/* Seta circular girando */}
          <g transform={`rotate(${frame * 6})`}>
            <path
              d="M0 -112 A112 112 0 1 1 -97 -56"
              fill="none"
              stroke={cores.salvia}
              strokeWidth={10}
              strokeLinecap="round"
            />
            <path
              d="M-97 -56 L-112 -86 M-97 -56 L-66 -64"
              stroke={cores.salvia}
              strokeWidth={10}
              strokeLinecap="round"
            />
          </g>
          {[-38, 38].map((x) => (
            <g key={x}>
              <ellipse
                cx={x}
                cy={0}
                rx={30}
                ry={36}
                fill={cores.branco}
                stroke={cores.texto}
                strokeWidth={6}
              />
              <circle cx={x + px} cy={py} r={14} fill={cores.texto} />
              <circle cx={x + px + 5} cy={py - 5} r={5} fill={cores.branco} />
            </g>
          ))}
          <text y={196} {...textoSvg(40)}>
            os olhos acompanham
          </text>
        </g>
      </svg>
    </Cena>
  );
};
