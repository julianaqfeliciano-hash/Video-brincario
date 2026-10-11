import React from "react";
import { interpolate, staticFile, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { Capivara } from "../../../brincario/componentes/Capivara";
import { Estalo } from "../../../brincario/componentes/Enfeites";
import { cores } from "../../../brincario/tema";
import { entrada, marcos, midia, quando, salto } from "../dados";
import { limitar, textoSvg } from "./estilo";

// ROTEIRO.md, cena 10: "Com o tempo ele aprende a reconhecer, estou agitado, vou usar o Giro Flex.
// Isso é autorregulação." — fluxo capivara agitada → Giro → capivara calma; título com estalo.

const Y = 450;
const R = 84;
const XS = [220, 540, 860];

const Seta: React.FC<{ de: number; ate: number; p: number }> = ({
  de,
  ate,
  p,
}) => {
  if (p <= 0.01) return null;
  const x2 = de + (ate - de) * p;
  return (
    <g
      stroke={cores.branco}
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <line x1={de} y1={Y} x2={x2} y2={Y} />
      {p > 0.85 && (
        <polyline
          points={`${x2 - 18},${Y - 16} ${x2},${Y} ${x2 - 18},${Y + 16}`}
        />
      )}
    </g>
  );
};

export const CenaAutorregulacao: React.FC = () => {
  const frame = useCurrentFrame();
  const tInicio = marcos.dica.fim; // "Com o tempo..."
  const tAgitado = quando("agitado", tInicio);
  const tGiro = quando("giro", tAgitado);
  const tAuto = quando("autorregulacao", tGiro);
  const tFim = quando("ele", tAuto) - 0.05;

  const eRotulo = entrada(frame, tInicio);
  const e1 = salto(frame, tAgitado);
  const s1 = interpolate(frame / 30, [tGiro - 0.4, tGiro], [0, 1], limitar);
  const e2 = salto(frame, tGiro);
  const s2 = interpolate(
    frame / 30,
    [tAuto - 0.5, tAuto - 0.1],
    [0, 1],
    limitar,
  );
  const e3 = salto(frame, tAuto);
  const eTitulo = salto(frame, tAuto);

  const circulo = (
    x: number,
    p: number,
    conteudo: React.ReactNode,
    rotulo: string,
    borda = cores.texto,
  ) =>
    p > 0.001 && (
      <g
        transform={`translate(${x} ${Y}) scale(${0.6 + 0.4 * p})`}
        opacity={Math.min(1, p * 1.5)}
      >
        <circle cy={8} r={R} fill={cores.texto} />
        <circle r={R} fill={cores.cremeClaro} stroke={borda} strokeWidth={8} />
        {conteudo}
        <text y={R + 48} {...textoSvg(36)}>
          {rotulo}
        </text>
      </g>
    );

  return (
    <Cena inicio={tInicio} fim={tFim}>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        {eTitulo < 0.05 ? (
          <text x={540} y={330} {...textoSvg(38)} opacity={eRotulo}>
            ELE APRENDE A RECONHECER
          </text>
        ) : (
          <g transform={`translate(540 342) scale(${0.5 + 0.5 * eTitulo})`}>
            <text {...textoSvg(64)} fill={cores.amarelo}>
              AUTORREGULAÇÃO!
            </text>
          </g>
        )}
        <Seta de={XS[0] + R + 14} ate={XS[1] - R - 14} p={s1} />
        <Seta de={XS[1] + R + 14} ate={XS[2] - R - 14} p={s2} />
        {circulo(
          XS[0],
          e1,
          <Capivara
            x={0}
            y={14}
            escala={0.255}
            expressao="agitada"
            bracoEsq={{ ombro: 150 + 12 * Math.sin(frame * 0.8), cotovelo: 0 }}
            bracoDir={{ ombro: 150 - 12 * Math.sin(frame * 0.8), cotovelo: 0 }}
            inclinacao={6 * Math.sin(frame * 0.9)}
          />,
          "estou agitado",
        )}
        {circulo(
          XS[1],
          e2,
          <g transform={`rotate(${frame * 4.5})`}>
            <image
              href={staticFile(midia.produto)}
              x={-65}
              y={-65}
              width={130}
              height={130}
            />
          </g>,
          "vou usar o Giro",
        )}
        {circulo(
          XS[2],
          e3,
          <Capivara
            x={0}
            y={14}
            escala={0.255}
            expressao="calma"
            bracoEsq={{ ombro: -20, cotovelo: -60 }}
            bracoDir={{ ombro: -20, cotovelo: -60 }}
          />,
          "calma",
          cores.terracota,
        )}
        <Estalo x={540} y={450} tempo={tAuto} raio={165} />
      </svg>
    </Cena>
  );
};
