import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores, fps } from "../../../brincario/tema";
import { entrada, quadroDe, quando } from "../dados";
import { limitar, textoSvg } from "./estilo";

// ROTEIRO.md, cena 1: "Seu filho fica agitado e não consegue desacelerar?"
// Título já pronto no quadro 0 (capa); em "agitado" uma onda espirra no barco; "desacelerar" fica
// coral com grifo amarelo.

const Respingo: React.FC<{ tempo: number }> = ({ tempo }) => {
  const frame = useCurrentFrame();
  const ini = quadroDe(tempo);
  const p = interpolate(frame, [ini, ini + 0.8 * fps], [0, 1], limitar);
  if (p <= 0 || p >= 1) return null;
  return (
    <g opacity={1 - p * p}>
      {Array.from({ length: 16 }).map((_, i) => {
        const lado = i % 2 ? 1 : -1;
        const vx = lado * (60 + ((i * 37) % 120));
        const vy = -(220 + ((i * 53) % 160));
        const x = 540 + lado * 150 + vx * p;
        const y = 800 + vy * p + 380 * p * p;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={8 + (i % 3) * 4}
            fill={i % 3 ? "#CFE9FF" : cores.branco}
            stroke={cores.texto}
            strokeWidth={3}
          />
        );
      })}
    </g>
  );
};

export const CenaGancho: React.FC = () => {
  const frame = useCurrentFrame();
  const tAgitado = quando("agitado");
  const tDesacelerar = quando("desacelerar");
  const tFim = quando("olhe") - 0.05;
  const grifo = entrada(frame, tDesacelerar);
  const cor = interpolateColors(grifo, [0, 1], [cores.branco, cores.terracota]);
  return (
    <Cena inicio={0} fim={tFim} semFadeEntrada>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        <text x={540} y={345} {...textoSvg(74)}>
          Não consegue
        </text>
        <rect
          x={540 - 250}
          y={402}
          width={500 * grifo}
          height={30}
          rx={15}
          fill={cores.amarelo}
          stroke={cores.texto}
          strokeWidth={5}
        />
        <text x={540} y={430} {...textoSvg(86)} fill={cor}>
          desacelerar?
        </text>
        <Respingo tempo={tAgitado} />
      </svg>
    </Cena>
  );
};
