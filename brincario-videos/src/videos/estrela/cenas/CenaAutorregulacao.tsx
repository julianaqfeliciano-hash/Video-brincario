import React from "react";
import {
  Img,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Cena } from "../../../brincario/Cena";
import { Capivara } from "../../../brincario/componentes/Capivara";
import { cores, fonte, fps } from "../../../brincario/tema";
import { entrada, midia, quadroDe, quando, salto } from "../dados";

// ROTEIRO.md, cena 7: "A criança aprende que quando a agitação sobe, existe algo que ela mesma
// pode fazer para se acalmar." Fluxo de 3 círculos: capivara agitada → estrela → capivara calma.

const Y = 530;
const R = 100;
const XS = [210, 540, 870];
const limitar = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const Seta: React.FC<{ de: number; ate: number; progresso: number }> = ({
  de,
  ate,
  progresso,
}) => {
  const x2 = de + (ate - de) * progresso;
  if (progresso <= 0.01) return null;
  return (
    <g
      stroke={cores.texto}
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <line x1={de} y1={Y} x2={x2} y2={Y} />
      {progresso > 0.85 && (
        <polyline
          points={`${x2 - 16},${Y - 14} ${x2},${Y} ${x2 - 16},${Y + 14}`}
        />
      )}
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
  const tFim = quando("para", tAcalmar) - 0.1; // até "Para mexer nas pontinhas"

  const eRotulo = entrada(frame, tCrianca);
  const e1 = salto(frame, tAgitacao);
  const sobe = entrada(frame, tSobe, { damping: 16, stiffness: 120 });
  const seta1 = interpolate(t, [tAlgo - 0.35, tAlgo], [0, 1], limitar);
  const e2 = salto(frame, tAlgo);
  const seta2 = interpolate(t, [tFazer, tAcalmar], [0, 1], limitar);
  const e3 = salto(frame, tAcalmar);
  const destaque3 = entrada(frame, tAcalmar);

  const circulo = (
    x: number,
    p: number,
    borda: string,
    conteudo: React.ReactNode,
    rotulo: string,
  ) =>
    p > 0.001 && (
      <g
        transform={`translate(${x} ${Y}) scale(${0.6 + 0.4 * p}) translate(${-x} ${-Y})`}
        opacity={Math.min(1, p * 1.5)}
      >
        <circle cx={x} cy={Y + 8} r={R} fill={cores.texto} />
        <circle
          cx={x}
          cy={Y}
          r={R}
          fill={cores.cremeClaro}
          stroke={borda}
          strokeWidth={7}
        />
        {conteudo}
        <text
          x={x}
          y={Y + R + 64}
          textAnchor="middle"
          fontFamily={fonte}
          fontWeight={900}
          fontSize={40}
          fill={cores.branco}
          stroke={cores.texto}
          strokeWidth={9}
          paintOrder="stroke"
          strokeLinejoin="round"
        >
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
          fontWeight={900}
          fontSize={34}
          letterSpacing={4.5}
          fill={cores.branco}
          stroke={cores.texto}
          strokeWidth={8}
          paintOrder="stroke"
          strokeLinejoin="round"
          opacity={eRotulo}
        >
          A CAPIVARA APRENDE
        </text>

        <Seta de={XS[0] + R + 12} ate={XS[1] - R - 12} progresso={seta1} />
        <Seta de={XS[1] + R + 12} ate={XS[2] - R - 12} progresso={seta2} />

        {circulo(
          XS[0],
          e1,
          cores.texto,
          <Capivara
            x={XS[0]}
            y={Y + 14}
            escala={0.3}
            expressao="agitada"
            bracoEsq={{ ombro: 150 + 12 * Math.sin(frame * 0.8), cotovelo: 0 }}
            bracoDir={{ ombro: 150 - 12 * Math.sin(frame * 0.8), cotovelo: 0 }}
            inclinacao={(3 + 6 * sobe) * Math.sin(frame * 0.9)}
          />,
          "agitação sobe",
        )}

        {circulo(
          XS[1],
          e2,
          cores.texto,
          <foreignObject x={XS[1] - 70} y={Y - 70} width={140} height={140}>
            <Img
              src={staticFile(midia.produto)}
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
          interpolateColors(destaque3, [0, 1], [cores.texto, cores.terracota]),
          <Capivara
            x={XS[2]}
            y={Y + 14}
            escala={0.3}
            expressao="calma"
            bracoEsq={{ ombro: -20, cotovelo: -60 }}
            bracoDir={{ ombro: -20, cotovelo: -60 }}
          />,
          "se acalma",
        )}
      </svg>
    </Cena>
  );
};
