import React from "react";
import { Img, interpolate, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Cena } from "../Cena";
import { cores, fonte, fps } from "../tema";
import { entrada, quadroDe, quando, salto } from "../tempo";

// ROTEIRO.md, cena 7: "A criança aprende que quando a agitação sobe, existe algo que ela mesma
// pode fazer para se acalmar." Fluxo de 3 ícones em círculos ligados por setas.

const Y = 530;
const R = 100;
const XS = [210, 540, 870];
const limitar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Seta: React.FC<{ de: number; ate: number; progresso: number }> = ({ de, ate, progresso }) => {
  const x2 = de + (ate - de) * progresso;
  if (progresso <= 0.01) return null;
  return (
    <g stroke={cores.salviaEscura} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line x1={de} y1={Y} x2={x2} y2={Y} />
      {progresso > 0.85 && <polyline points={`${x2 - 16},${Y - 14} ${x2},${Y} ${x2 - 16},${Y + 14}`} />}
    </g>
  );
};

export const CenaAutorregulacao: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;

  const tAuto = quando("autorregulacao");
  const tCrianca = quando("crianca", tAuto);
  const tAgitacao = quando("agitacao", tCrianca);
  const tSobe = quando("sobe", tAgitacao);
  const tAlgo = quando("algo", tSobe);
  const tFazer = quando("fazer", tAlgo);
  const tAcalmar = quando("acalmar", tFazer);
  const tFim = quando("ao", tAcalmar) - 0.1;

  const eRotulo = entrada(frame, tCrianca);
  const e1 = salto(frame, tAgitacao);
  const sobe = entrada(frame, tSobe, { damping: 16, stiffness: 120 });
  const seta1 = interpolate(t, [tAlgo - 0.35, tAlgo], [0, 1], limitar);
  const e2 = salto(frame, tAlgo);
  const seta2 = interpolate(t, [tFazer, tAcalmar], [0, 1], limitar);
  const e3 = salto(frame, tAcalmar);
  const destaque3 = entrada(frame, tAcalmar);

  // Onda agitada: amplitude e "altura" crescem em "sobe", e a onda corre
  const onda: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const s = i / 40;
    const x = XS[0] - 62 + 124 * s;
    const amp = 14 + 14 * sobe;
    const y = Y + 22 - 34 * sobe * s + amp * Math.sin(2 * Math.PI * 3.5 * s - t * 10);
    onda.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  const circulo = (x: number, p: number, borda: string, conteudo: React.ReactNode, rotulo: string) =>
    p > 0.001 && (
      <g transform={`translate(${x} ${Y}) scale(${0.6 + 0.4 * p}) translate(${-x} ${-Y})`} opacity={Math.min(1, p * 1.5)}>
        <circle cx={x} cy={Y} r={R} fill={cores.cremeClaro} stroke={borda} strokeWidth={6} />
        {conteudo}
        <text x={x} y={Y + R + 64} textAnchor="middle" fontFamily={fonte} fontWeight={800} fontSize={40} fill={cores.texto}>
          {rotulo}
        </text>
      </g>
    );

  return (
    <Cena inicio={tCrianca - 0.1} fim={tFim}>
      <svg width={1080} height={900} viewBox="0 0 1080 900">
        <text
          x={540}
          y={330 + 24 * (1 - eRotulo)}
          textAnchor="middle"
          fontFamily={fonte}
          fontWeight={700}
          fontSize={32}
          letterSpacing={4.5}
          fill={cores.salviaEscura}
          opacity={eRotulo}
        >
          A CRIANÇA APRENDE
        </text>

        <Seta de={XS[0] + R + 12} ate={XS[1] - R - 12} progresso={seta1} />
        <Seta de={XS[1] + R + 12} ate={XS[2] - R - 12} progresso={seta2} />

        {circulo(
          XS[0],
          e1,
          cores.salvia,
          <polyline
            points={onda.join(" ")}
            fill="none"
            stroke={cores.terracota}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />,
          "agitação sobe",
        )}

        {circulo(
          XS[1],
          e2,
          cores.salvia,
          <foreignObject x={XS[1] - 70} y={Y - 70} width={140} height={140}>
            <Img
              src={staticFile("midia/estrela_recorte.png")}
              style={{
                width: 140,
                height: 140,
                objectFit: "contain",
                transform: `rotate(${6 * Math.sin((frame - quadroDe(tAlgo)) / 6)}deg)`,
              }}
            />
          </foreignObject>,
          "mexe na estrela",
        )}

        {circulo(
          XS[2],
          e3,
          interpolateColors(destaque3, [0, 1], [cores.salvia, cores.terracota]),
          <g>
            <circle cx={XS[2]} cy={Y} r={58} fill={cores.terracotaClara} />
            <path
              d={`M${XS[2] - 30} ${Y - 6} q12 10 24 0 M${XS[2] + 6} ${Y - 6} q12 10 24 0`}
              fill="none"
              stroke={cores.texto}
              strokeWidth={5}
              strokeLinecap="round"
            />
            <path
              d={`M${XS[2] - 18} ${Y + 20} Q${XS[2]} ${Y + 34} ${XS[2] + 18} ${Y + 20}`}
              fill="none"
              stroke={cores.texto}
              strokeWidth={5}
              strokeLinecap="round"
            />
          </g>,
          "se acalma",
        )}
      </svg>
    </Cena>
  );
};
