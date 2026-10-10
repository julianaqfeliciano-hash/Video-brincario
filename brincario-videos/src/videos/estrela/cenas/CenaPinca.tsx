import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import {
  corCapivara as CAP,
  corEscoteiro as UNIFORME,
} from "../../../brincario/componentes/Capivara";
import { cores, fonte, fps } from "../../../brincario/tema";
import { entrada, quando, salto } from "../dados";

// ROTEIRO.md, cena 8: "Para mexer nas pontinhas, ela usa as pinças dos dedos e as duas mãos ao mesmo tempo."
// Patinha de capivara (dedinhos com almofadinhas destacadas) pinçando a pontinha de uma estrela; rótulo "pinça";
// em "duas mãos" entra a segunda mão, espelhada.

const limitar = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const CENTRO = { x: 540, y: 575 };
const RAIO = 150;
const ESCALA_MAO = 1.1;
// Ponto (no desenho da mão) onde polegar e indicador se encontram
const PINCA_LOCAL = { x: 222, y: -3 };

const estrela = (cx: number, cy: number, r: number, ri: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const raio = i % 2 === 0 ? r : ri;
    pts.push(
      `${(cx + raio * Math.cos(ang)).toFixed(1)},${(cy + raio * Math.sin(ang)).toFixed(1)}`,
    );
  }
  return pts.join(" ");
};

// Ponto da pinça sobre a ponta esquerda da estrela (um pouco para dentro da ponta)
const ANG_ESQ = (198 * Math.PI) / 180;
const PINCA = {
  x: CENTRO.x + 0.9 * RAIO * Math.cos(ANG_ESQ),
  y: CENTRO.y + 0.9 * RAIO * Math.sin(ANG_ESQ),
};
const POS_MAO = {
  x: PINCA.x - PINCA_LOCAL.x * ESCALA_MAO,
  y: PINCA.y - PINCA_LOCAL.y * ESCALA_MAO,
};

/** Mão de lado fazendo pinça. `abertura` 1 = dedos abertos, 0 = fechados na pontinha. */
const MaoPinca: React.FC<{ abertura: number; brilho: number }> = ({
  abertura,
  brilho,
}) => {
  const giro = 16 * abertura;
  const ponta = (
    base: { x: number; y: number },
    fim: { x: number; y: number },
    angulo: number,
  ) => {
    const a = (angulo * Math.PI) / 180;
    const dx = fim.x - base.x;
    const dy = fim.y - base.y;
    return {
      x: base.x + dx * Math.cos(a) - dy * Math.sin(a),
      y: base.y + dx * Math.sin(a) + dy * Math.cos(a),
    };
  };
  const baseIndicador = { x: 90, y: -45 };
  const baseDedao = { x: 70, y: 40 };
  const pontaIndicador = ponta(baseIndicador, { x: 222, y: -14 }, -giro);
  const pontaDedao = ponta(baseDedao, { x: 222, y: 8 }, giro);
  const dedo = (
    base: { x: number; y: number },
    pontaD: { x: number; y: number },
  ) => (
    <>
      <line
        x1={base.x}
        y1={base.y}
        x2={pontaD.x}
        y2={pontaD.y}
        stroke={CAP.contorno}
        strokeWidth={46}
        strokeLinecap="round"
      />
      <line
        x1={base.x}
        y1={base.y}
        x2={pontaD.x}
        y2={pontaD.y}
        stroke={CAP.escuro}
        strokeWidth={34}
        strokeLinecap="round"
      />
      {/* Almofadinha ("feijãozinho") rosa na ponta, destacada em coral */}
      <circle
        cx={pontaD.x}
        cy={pontaD.y}
        r={13}
        fill={cores.rosa}
        stroke={cores.terracota}
        strokeWidth={6}
      />
    </>
  );
  return (
    <>
      {/* Bracinho de pelo com o punho cáqui do uniforme */}
      <rect
        x={-180}
        y={-46}
        width={170}
        height={92}
        rx={40}
        fill={CAP.corpo}
        stroke={CAP.contorno}
        strokeWidth={6}
      />
      <rect
        x={-180}
        y={-52}
        width={58}
        height={104}
        rx={22}
        fill={UNIFORME.caqui}
        stroke={CAP.contorno}
        strokeWidth={6}
      />
      {/* Patinha fofa */}
      <ellipse
        cx={30}
        cy={0}
        rx={88}
        ry={76}
        fill={CAP.corpo}
        stroke={CAP.contorno}
        strokeWidth={6}
      />
      <path
        d="M-20 -70 q8 -10 14 2 M10 -76 q8 -10 14 2"
        stroke={CAP.contorno}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        opacity={0.5}
      />
      <ellipse
        cx={20}
        cy={14}
        rx={28}
        ry={22}
        fill={cores.rosa}
        opacity={0.85}
      />
      {[
        [62, 56],
        [26, 70],
      ].map(([cx, cy]) => (
        <circle
          key={cx}
          cx={cx}
          cy={cy}
          r={18}
          fill={CAP.escuro}
          stroke={CAP.contorno}
          strokeWidth={5}
        />
      ))}
      {dedo(baseIndicador, pontaIndicador)}
      {dedo(baseDedao, pontaDedao)}
      {brilho > 0 && (
        <circle
          cx={PINCA_LOCAL.x}
          cy={PINCA_LOCAL.y}
          r={28 + 50 * brilho}
          fill="none"
          stroke={cores.terracota}
          strokeWidth={5}
          opacity={1 - brilho}
        />
      )}
    </>
  );
};

export const CenaPinca: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;

  const tAo = quando("para", quando("acalmar")); // "Para mexer nas pontinhas"
  const tPontinhas = quando("pontinhas");
  const tPinca = quando("pincas", tPontinhas);
  const tDuas = quando("duas");
  const tFim = quando("a", tDuas) - 0.1;

  const eEstrela = salto(frame, tAo);
  const eMao = entrada(frame, tAo);
  const fecha = entrada(frame, tPontinhas, { damping: 20, stiffness: 140 });
  const ePinca = entrada(frame, tPinca);
  const brilho = interpolate(t, [tPinca, tPinca + 0.7], [0, 1], limitar);
  const eDuas = salto(frame, tDuas);
  const eMaoDireita = entrada(frame, tDuas);

  // Linha de chamada da pinça até o rótulo, desenhando-se
  const ROTULO = { x: 300, y: 820 };
  const linhaX = interpolate(ePinca, [0, 1], [PINCA.x, ROTULO.x + 10], limitar);
  const linhaY = interpolate(
    ePinca,
    [0, 1],
    [PINCA.y + 30, ROTULO.y - 60],
    limitar,
  );

  return (
    <Cena inicio={tAo} fim={tFim}>
      <svg width={1080} height={900} viewBox="0 0 1080 900">
        {/* "2 mãos" no topo */}
        <g
          opacity={Math.min(1, eDuas)}
          transform={`translate(540 410) scale(${0.6 + 0.4 * eDuas}) translate(-540 -410)`}
        >
          <text
            x={520}
            y={410}
            textAnchor="end"
            fontFamily={fonte}
            fontWeight={900}
            fontSize={170}
            fill={cores.terracota}
            stroke={cores.texto}
            strokeWidth={10}
            paintOrder="stroke"
            strokeLinejoin="round"
          >
            2
          </text>
          <text
            x={540}
            y={404}
            fontFamily={fonte}
            fontSize={64}
            fontWeight={900}
            fill={cores.branco}
            stroke={cores.texto}
            strokeWidth={9}
            paintOrder="stroke"
            strokeLinejoin="round"
          >
            mãos
          </text>
        </g>

        <defs>
          <linearGradient
            id="estrelaLilasDourada"
            x1="0"
            y1="0"
            x2="1"
            y2="0.3"
          >
            <stop offset="0.1" stopColor="#B07CE8" />
            <stop offset="0.9" stopColor="#F2C14E" />
          </linearGradient>
        </defs>
        {/* Estrela (lilás e dourada, como o produto) */}
        <g
          transform={`translate(${CENTRO.x} ${CENTRO.y}) scale(${0.6 + 0.4 * eEstrela}) translate(${-CENTRO.x} ${-CENTRO.y})`}
        >
          <polygon
            points={estrela(CENTRO.x, CENTRO.y, RAIO, RAIO * 0.52)}
            fill="url(#estrelaLilasDourada)"
            stroke={cores.texto}
            strokeWidth={8}
            strokeLinejoin="round"
            opacity={Math.min(1, eEstrela)}
          />
        </g>

        {/* Mão esquerda: entra pela esquerda e fecha os dedos na pontinha */}
        <g
          opacity={eMao}
          transform={`translate(${POS_MAO.x - 120 * (1 - eMao)} ${POS_MAO.y}) scale(${ESCALA_MAO})`}
        >
          <MaoPinca
            abertura={1 - fecha}
            brilho={brilho > 0 && brilho < 1 ? brilho : 0}
          />
        </g>

        {/* Mão direita (espelhada) em "duas mãos" */}
        <g
          opacity={eMaoDireita}
          transform={`translate(${1080 - POS_MAO.x + 120 * (1 - eMaoDireita)} ${POS_MAO.y}) scale(${-ESCALA_MAO} ${ESCALA_MAO})`}
        >
          <MaoPinca abertura={1 - eMaoDireita} brilho={0} />
        </g>

        {/* Rótulo "pinça" com linha de chamada */}
        <g opacity={ePinca}>
          <line
            x1={PINCA.x}
            y1={PINCA.y + 30}
            x2={linhaX}
            y2={linhaY}
            stroke={cores.texto}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <text
            x={ROTULO.x}
            y={ROTULO.y + 24 * (1 - ePinca)}
            textAnchor="middle"
            fontFamily={fonte}
            fontWeight={900}
            fontSize={68}
            fill={cores.branco}
            stroke={cores.texto}
            strokeWidth={10}
            paintOrder="stroke"
            strokeLinejoin="round"
          >
            pinça
          </text>
        </g>
      </svg>
    </Cena>
  );
};
