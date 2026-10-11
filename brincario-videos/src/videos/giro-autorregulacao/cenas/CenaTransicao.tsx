import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores } from "../../../brincario/tema";
import { entrada, quando, salto } from "../dados";
import { textoSvg } from "./estilo";

// ROTEIRO.md, cena 11: "Ele também ajuda nos momentos de transição, sair de tela, chegar na escola,
// esperar numa consulta," — rótulo e três adesivos, um por palavra.

const Tablet: React.FC = () => (
  <g strokeLinejoin="round" strokeLinecap="round">
    <rect
      x={-48}
      y={-62}
      width={96}
      height={124}
      rx={14}
      fill={cores.azul}
      stroke={cores.texto}
      strokeWidth={6}
    />
    <rect x={-36} y={-48} width={72} height={88} rx={6} fill="#CFEFFF" />
    <circle cx={0} cy={52} r={5} fill={cores.texto} />
    <path
      d="M10 -6 L62 -6 M44 -24 L62 -6 L44 12"
      stroke={cores.terracota}
      strokeWidth={10}
      fill="none"
    />
  </g>
);

const Escola: React.FC = () => (
  <g strokeLinejoin="round">
    <path
      d="M-66 -10 L0 -58 L66 -10 Z"
      fill={cores.terracota}
      stroke={cores.texto}
      strokeWidth={6}
    />
    <rect
      x={-56}
      y={-12}
      width={112}
      height={74}
      fill={cores.amarelo}
      stroke={cores.texto}
      strokeWidth={6}
    />
    <rect
      x={-14}
      y={20}
      width={28}
      height={42}
      fill={cores.azul}
      stroke={cores.texto}
      strokeWidth={5}
    />
    <circle
      cx={0}
      cy={-26}
      r={10}
      fill={cores.branco}
      stroke={cores.texto}
      strokeWidth={4}
    />
    <rect
      x={-44}
      y={4}
      width={20}
      height={18}
      fill="#CFEFFF"
      stroke={cores.texto}
      strokeWidth={4}
    />
    <rect
      x={24}
      y={4}
      width={20}
      height={18}
      fill="#CFEFFF"
      stroke={cores.texto}
      strokeWidth={4}
    />
  </g>
);

const Relogio: React.FC<{ frame: number }> = ({ frame }) => (
  <g strokeLinecap="round">
    <circle r={58} fill={cores.branco} stroke={cores.texto} strokeWidth={7} />
    <circle r={6} fill={cores.texto} />
    <line
      x1={0}
      y1={0}
      x2={0}
      y2={-36}
      stroke={cores.texto}
      strokeWidth={7}
      transform={`rotate(${frame * 6})`}
    />
    <line
      x1={0}
      y1={0}
      x2={24}
      y2={0}
      stroke={cores.terracota}
      strokeWidth={7}
      transform={`rotate(${frame * 0.5})`}
    />
  </g>
);

export const CenaTransicao: React.FC = () => {
  const frame = useCurrentFrame();
  const tEle = quando("ele", quando("autorregulacao"));
  const tMomentos = quando("momentos", tEle);
  const tTela = quando("tela", tMomentos);
  const tEscola = quando("escola", tTela);
  const tConsulta = quando("consulta", tEscola);
  const tFim = quando("e", tConsulta) - 0.05; // "é leve"

  const eRotulo = entrada(frame, tMomentos);
  const itens = [
    { t: tTela, x: 220, rotulo: "sair da tela", Icone: <Tablet /> },
    { t: tEscola, x: 540, rotulo: "chegar na escola", Icone: <Escola /> },
    {
      t: tConsulta,
      x: 860,
      rotulo: "esperar a consulta",
      Icone: <Relogio frame={frame} />,
    },
  ];

  return (
    <Cena inicio={tEle} fim={tFim}>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        <text
          x={540}
          y={318 + 20 * (1 - eRotulo)}
          {...textoSvg(46)}
          opacity={eRotulo}
        >
          MOMENTOS DE TRANSIÇÃO
        </text>
        {itens.map(({ t, x, rotulo, Icone }) => {
          const p = salto(frame, t);
          if (p <= 0.001) return null;
          return (
            <g
              key={rotulo}
              transform={`translate(${x} 430) scale(${0.6 + 0.4 * p})`}
              opacity={Math.min(1, p * 1.5)}
            >
              <circle cy={8} r={96} fill={cores.texto} />
              <circle
                r={96}
                fill={cores.cremeClaro}
                stroke={cores.texto}
                strokeWidth={7}
              />
              {Icone}
              <text y={150} {...textoSvg(34)}>
                {rotulo}
              </text>
            </g>
          );
        })}
      </svg>
    </Cena>
  );
};
