import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores, fonte } from "../../../brincario/tema";
import { entrada, quando, salto } from "../dados";

// ROTEIRO.md, cena 9: "A mesma base para segurar o lápis, abotoar a roupa e usar a tesoura"
// Um ícone por palavra, com um pequeno salto ao entrar. Os ícones ficam na tela até "brincadeira".

const Lapis: React.FC = () => (
  <g transform="rotate(-40)">
    <rect
      x={-20}
      y={-108}
      width={40}
      height={24}
      rx={10}
      fill={cores.terracotaClara}
    />
    <rect x={-20} y={-88} width={40} height={14} fill={cores.salviaEscura} />
    <rect x={-20} y={-76} width={40} height={124} fill={cores.terracota} />
    <path
      d="M-20 46 L20 46 L0 92 Z"
      fill={cores.terracotaClara}
      strokeLinejoin="round"
    />
    <path d="M-7 77 L7 77 L0 92 Z" fill={cores.texto} />
  </g>
);

const Roupa: React.FC = () => (
  <g>
    <path
      d="M-42 -66 L-16 -74 Q0 -56 16 -74 L42 -66 L82 -28 L56 2 L44 -10 L44 72 L-44 72 L-44 -10 L-56 2 L-82 -28 Z"
      fill={cores.salvia}
      stroke={cores.salviaEscura}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <line
      x1={0}
      y1={-58}
      x2={0}
      y2={72}
      stroke={cores.salviaEscura}
      strokeWidth={4}
    />
    {[-34, -4, 26, 54].map((y) => (
      <circle
        key={y}
        cx={0}
        cy={y}
        r={7}
        fill={cores.cremeClaro}
        stroke={cores.salviaEscura}
        strokeWidth={3}
      />
    ))}
  </g>
);

const Tesoura: React.FC = () => (
  <g>
    <line
      x1={-26}
      y1={46}
      x2={40}
      y2={-84}
      stroke={cores.salviaEscura}
      strokeWidth={15}
      strokeLinecap="round"
    />
    <line
      x1={26}
      y1={46}
      x2={-40}
      y2={-84}
      stroke={cores.salviaEscura}
      strokeWidth={15}
      strokeLinecap="round"
    />
    <circle cx={0} cy={-6} r={7} fill={cores.cremeClaro} />
    <circle
      cx={-32}
      cy={62}
      r={24}
      fill="none"
      stroke={cores.terracota}
      strokeWidth={13}
    />
    <circle
      cx={32}
      cy={62}
      r={24}
      fill="none"
      stroke={cores.terracota}
      strokeWidth={13}
    />
  </g>
);

// Os ícones entram 0,4 s depois da palavra (ajuste do passo 7: estavam entrando cedo demais)
const ATRASO = 0.4;

const ITENS = [
  { palavra: "lapis", rotulo: "lápis", x: 230, Icone: Lapis, escala: 1.3 },
  { palavra: "roupa", rotulo: "roupa", x: 540, Icone: Roupa, escala: 1 },
  { palavra: "tesoura", rotulo: "tesoura", x: 850, Icone: Tesoura, escala: 1 },
];

export const CenaIcones: React.FC = () => {
  const frame = useCurrentFrame();

  const tDuas = quando("duas");
  const tInicio = quando("a", tDuas);
  const tBase = quando("base", tInicio);
  const tTesoura = quando("tesoura", tInicio);
  // Fica até "brincadeira" (a tesoura é dita só 0,4 s antes de "e ainda vira brincadeira")
  const tFim = quando("brincadeira", tTesoura) - 0.05;

  const eTitulo = entrada(frame, tBase);

  return (
    <Cena inicio={tInicio} fim={tFim}>
      <svg width={1080} height={900} viewBox="0 0 1080 900">
        <text
          x={540}
          y={340 + 24 * (1 - eTitulo)}
          textAnchor="middle"
          fontFamily={fonte}
          fontWeight={700}
          fontSize={30}
          letterSpacing={3.6}
          fill={cores.salviaEscura}
          opacity={eTitulo}
        >
          A MESMA BASE PARA
        </text>

        {ITENS.map(({ palavra, rotulo, x, Icone, escala }) => {
          const p = salto(frame, quando(palavra, tInicio) + ATRASO);
          if (p <= 0.001) return null;
          return (
            <g
              key={palavra}
              transform={`translate(${x} 570) scale(${0.6 + 0.4 * p})`}
              opacity={Math.min(1, p * 1.5)}
            >
              <circle
                r={122}
                fill={cores.cremeClaro}
                stroke={cores.salvia}
                strokeWidth={5}
              />
              <g transform={`scale(${escala})`}>
                <Icone />
              </g>
              <text
                y={196}
                textAnchor="middle"
                fontFamily={fonte}
                fontWeight={800}
                fontSize={48}
                fill={cores.texto}
              >
                {rotulo}
              </text>
            </g>
          );
        })}
      </svg>
    </Cena>
  );
};
