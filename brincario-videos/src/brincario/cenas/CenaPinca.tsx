import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Cena } from "../Cena";
import { cores, fonte, fps } from "../tema";
import { entrada, quando, salto } from "../tempo";

// ROTEIRO.md, cena 8: "Ao mexer nas pontinhas, ela usa a pinça dos dedos e as duas mãos ao mesmo tempo."
// Mão com polegar e indicador destacados pinçando a pontinha de uma estrela; rótulo "pinça";
// em "duas mãos" entra a segunda mão, espelhada.

const limitar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

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
    pts.push(`${(cx + raio * Math.cos(ang)).toFixed(1)},${(cy + raio * Math.sin(ang)).toFixed(1)}`);
  }
  return pts.join(" ");
};

// Ponto da pinça sobre a ponta esquerda da estrela (um pouco para dentro da ponta)
const ANG_ESQ = (198 * Math.PI) / 180;
const PINCA = { x: CENTRO.x + 0.9 * RAIO * Math.cos(ANG_ESQ), y: CENTRO.y + 0.9 * RAIO * Math.sin(ANG_ESQ) };
const POS_MAO = { x: PINCA.x - PINCA_LOCAL.x * ESCALA_MAO, y: PINCA.y - PINCA_LOCAL.y * ESCALA_MAO };

/** Mão de lado fazendo pinça. `abertura` 1 = dedos abertos, 0 = fechados na pontinha. */
const MaoPinca: React.FC<{ abertura: number; brilho: number }> = ({ abertura, brilho }) => {
  const giro = 16 * abertura;
  const ponta = (base: { x: number; y: number }, fim: { x: number; y: number }, angulo: number) => {
    const a = (angulo * Math.PI) / 180;
    const dx = fim.x - base.x;
    const dy = fim.y - base.y;
    return { x: base.x + dx * Math.cos(a) - dy * Math.sin(a), y: base.y + dx * Math.sin(a) + dy * Math.cos(a) };
  };
  const baseIndicador = { x: 90, y: -45 };
  const baseDedao = { x: 70, y: 40 };
  const pontaIndicador = ponta(baseIndicador, { x: 222, y: -14 }, -giro);
  const pontaDedao = ponta(baseDedao, { x: 222, y: 8 }, giro);
  return (
    <>
      <rect x={-150} y={-50} width={115} height={100} rx={22} fill={cores.terracotaClara} />
      <rect x={-50} y={-72} width={160} height={144} rx={62} fill={cores.salvia} />
      <line
        x1={baseIndicador.x}
        y1={baseIndicador.y}
        x2={pontaIndicador.x}
        y2={pontaIndicador.y}
        stroke={cores.salvia}
        strokeWidth={34}
        strokeLinecap="round"
      />
      <line
        x1={baseDedao.x}
        y1={baseDedao.y}
        x2={pontaDedao.x}
        y2={pontaDedao.y}
        stroke={cores.salvia}
        strokeWidth={36}
        strokeLinecap="round"
      />
      {/* Polegar e indicador destacados */}
      <circle cx={pontaIndicador.x} cy={pontaIndicador.y} r={17} fill={cores.terracota} />
      <circle cx={pontaDedao.x} cy={pontaDedao.y} r={18} fill={cores.terracota} />
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

  const tAo = quando("ao");
  const tPontinhas = quando("pontinhas");
  const tPinca = quando("pinca");
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
  const linhaY = interpolate(ePinca, [0, 1], [PINCA.y + 30, ROTULO.y - 60], limitar);

  return (
    <Cena inicio={tAo} fim={tFim}>
      <svg width={1080} height={900} viewBox="0 0 1080 900">
        {/* "2 mãos" no topo */}
        <g
          opacity={Math.min(1, eDuas)}
          transform={`translate(540 410) scale(${0.6 + 0.4 * eDuas}) translate(-540 -410)`}
        >
          <text x={520} y={410} textAnchor="end" fontFamily={fonte} fontWeight={900} fontSize={170} fill={cores.terracota}>
            2
          </text>
          <text x={540} y={404} fontFamily={fonte} fontWeight={800} fontSize={64} fill={cores.texto}>
            mãos
          </text>
        </g>

        {/* Estrela */}
        <g transform={`translate(${CENTRO.x} ${CENTRO.y}) scale(${0.6 + 0.4 * eEstrela}) translate(${-CENTRO.x} ${-CENTRO.y})`}>
          <polygon
            points={estrela(CENTRO.x, CENTRO.y, RAIO, RAIO * 0.52)}
            fill={cores.cremeClaro}
            stroke={cores.salviaEscura}
            strokeWidth={7}
            strokeLinejoin="round"
            opacity={Math.min(1, eEstrela)}
          />
        </g>

        {/* Mão esquerda: entra pela esquerda e fecha os dedos na pontinha */}
        <g
          opacity={eMao}
          transform={`translate(${POS_MAO.x - 120 * (1 - eMao)} ${POS_MAO.y}) scale(${ESCALA_MAO})`}
        >
          <MaoPinca abertura={1 - fecha} brilho={brilho > 0 && brilho < 1 ? brilho : 0} />
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
            stroke={cores.salviaEscura}
            strokeWidth={4}
            strokeLinecap="round"
          />
          <text
            x={ROTULO.x}
            y={ROTULO.y + 24 * (1 - ePinca)}
            textAnchor="middle"
            fontFamily={fonte}
            fontWeight={900}
            fontSize={64}
            fill={cores.terracota}
          >
            pinça
          </text>
        </g>
      </svg>
    </Cena>
  );
};
