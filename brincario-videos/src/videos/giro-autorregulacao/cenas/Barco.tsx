import React from "react";
import { interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Capivara,
  type ExpressaoCapivara,
} from "../../../brincario/componentes/Capivara";
import { Estalo } from "../../../brincario/componentes/Enfeites";
import { alturaOnda, estadoMar } from "../../../brincario/componentes/Mar";
import { cores, fps } from "../../../brincario/tema";
import { marcos, midia, quadroDe, quando } from "../dados";

// Fio condutor (ROTEIRO.md): a capivara escoteira num barquinho, embaixo do painel, o vídeo todo.
// Mar agitado: ela se segura, agitada. "concreto": chega uma caixa de presente boiando.
// "giro": a caixa abre e o Giro sobe até as patas; dali em diante ela gira o brinquedo, calma.
// Some na apresentação (fundo da marca) e no cartão final.

const limitar = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const BARCO_X = 540;
const LINHA_AGUA = 836;
const ESCALA_CAPIVARA = 0.55;
const CAPIVARA_Y = -120; // centro do corpo, em relação à linha d'água do barco
// O Giro fica acima da borda do barco: deslocado para cima dentro das patas
const GIRO_NAS_PATAS = -30;

/** Casco do barquinho (origem na linha d'água, no centro). */
const Casco: React.FC = () => (
  <g strokeLinejoin="round">
    <path
      d="M-170 -46 L170 -46 Q160 30 110 52 L-110 52 Q-160 30 -170 -46 Z"
      fill={cores.terracota}
      stroke={cores.texto}
      strokeWidth={7}
    />
    <path
      d="M-166 -46 L166 -46 L162 -22 L-162 -22 Z"
      fill={cores.branco}
      stroke={cores.texto}
      strokeWidth={5}
    />
    {[-90, 0, 90].map((x) => (
      <circle
        key={x}
        cx={x}
        cy={12}
        r={13}
        fill="#BFE9FF"
        stroke={cores.texto}
        strokeWidth={5}
      />
    ))}
    <rect
      x={-176}
      y={-56}
      width={352}
      height={14}
      rx={7}
      fill="#8A5A3B"
      stroke={cores.texto}
      strokeWidth={5}
    />
  </g>
);

const Caixa: React.FC<{ abre: number }> = ({ abre }) => (
  <g strokeLinejoin="round">
    <rect
      x={-44}
      y={-40}
      width={88}
      height={70}
      rx={10}
      fill={cores.lilas}
      stroke={cores.texto}
      strokeWidth={6}
    />
    <rect x={-8} y={-40} width={16} height={70} fill={cores.amarelo} />
    <g
      transform={`translate(${70 * abre} ${-90 * abre}) rotate(${70 * abre} 0 -46)`}
    >
      <rect
        x={-52}
        y={-60}
        width={104}
        height={24}
        rx={8}
        fill={cores.lilas}
        stroke={cores.texto}
        strokeWidth={6}
      />
      <rect x={-8} y={-60} width={16} height={24} fill={cores.amarelo} />
      <path
        d="M0 -60 q-26 -30 -34 -6 q20 6 34 6 q14 0 34 -6 q-8 -24 -34 6 Z"
        fill={cores.amarelo}
        stroke={cores.texto}
        strokeWidth={4}
      />
    </g>
  </g>
);

const GiroGirando: React.FC<{ angulo: number; tamanho: number }> = ({
  angulo,
  tamanho,
}) => (
  <g transform={`rotate(${angulo})`}>
    <image
      href={staticFile(midia.produto)}
      x={-tamanho / 2}
      y={-tamanho / 2}
      width={tamanho}
      height={tamanho}
    />
  </g>
);

export const Barco: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const calma = estadoMar(frame, marcos.virada);

  // Some na apresentação e no cartão final
  const a0 = quadroDe(marcos.apresentacao.inicio);
  const a1 = Math.round(marcos.apresentacao.fim * fps);
  const f0 = quadroDe(marcos.final);
  const visivel = interpolate(
    frame,
    [a0, a0 + 6, a1, a1 + 6, f0, f0 + 8],
    [1, 0, 0, 1, 1, 0],
    limitar,
  );
  if (visivel <= 0.001) return null;

  // Boia e inclina junto com as ondas
  const y = LINHA_AGUA + alturaOnda(BARCO_X + 600, t, calma);
  const inclina =
    ((alturaOnda(BARCO_X + 640, t, calma) -
      alturaOnda(BARCO_X + 560, t, calma)) /
      80) *
    57 *
    0.35;

  // Caixa de presente: chega boiando em "concreto", abre em "giro"
  const chega = interpolate(
    frame,
    [quadroDe(marcos.caixaChega), quadroDe(marcos.caixaChega) + 30],
    [0, 1],
    {
      ...limitar,
      easing: (x) => 1 - (1 - x) ** 3,
    },
  );
  const abre = interpolate(
    frame,
    [quadroDe(marcos.virada), quadroDe(marcos.virada) + 10],
    [0, 1],
    limitar,
  );
  const caixaX = interpolate(chega, [0, 1], [700, 215]);
  const caixaSome = interpolate(
    frame,
    [quadroDe(marcos.virada) + 24, quadroDe(marcos.virada) + 36],
    [1, 0],
    limitar,
  );

  // O Giro sobe da caixa até as patas
  const sobe = interpolate(
    frame,
    [quadroDe(marcos.virada) + 4, quadroDe(marcos.virada) + 22],
    [0, 1],
    {
      ...limitar,
      easing: (x) => 1 - (1 - x) ** 2,
    },
  );
  const comGiro = sobe >= 1;
  const naDica = t >= marcos.dica.inicio && t < marcos.dica.fim;
  const angulo = frame * (naDica ? 1.4 : 4.5); // gira sem parar; mais devagar na dica

  // Pose e expressão ao longo da história
  const noGancho = t < quando("olhe");
  const agita = Math.sin(t * 2 * Math.PI * 3.2);
  let expressao: ExpressaoCapivara = "agitada";
  let bracos = {
    esq: { ombro: 60, cotovelo: 50 },
    dir: { ombro: 60, cotovelo: 50 },
  };
  let olhar = { x: 0, y: 0 };
  if (calma <= 0.05 && noGancho) {
    bracos = {
      esq: { ombro: 150 + 12 * agita, cotovelo: 20 * agita },
      dir: { ombro: 150 - 12 * agita, cotovelo: -20 * agita },
    };
  }
  if (frame >= quadroDe(marcos.virada)) {
    expressao =
      t < marcos.virada + 0.7 ? "surpresa" : naDica ? "calma" : "feliz";
    bracos = {
      esq: { ombro: -5, cotovelo: -45 },
      dir: { ombro: -5, cotovelo: -45 },
    };
    if (t >= marcos.olhos.inicio && t < marcos.olhos.fim) {
      expressao = "surpresa";
      olhar = { x: Math.cos(frame / 5), y: Math.sin(frame / 5) };
    }
  }

  // Posição do Giro subindo (coordenadas do barco → das patas)
  const giroX = interpolate(sobe, [0, 1], [215, 0]);
  const giroY = interpolate(
    sobe,
    [0, 0.5, 1],
    [-40, -230, CAPIVARA_Y + (40 + GIRO_NAS_PATAS) * ESCALA_CAPIVARA],
  );

  return (
    <svg
      width={1080}
      height={900}
      viewBox="0 0 1080 900"
      style={{ position: "absolute", left: 0, top: 0, opacity: visivel }}
    >
      <g transform={`translate(${BARCO_X} ${y}) rotate(${inclina})`}>
        <Capivara
          x={0}
          y={CAPIVARA_Y}
          escala={ESCALA_CAPIVARA}
          expressao={expressao}
          bracoEsq={bracos.esq}
          bracoDir={bracos.dir}
          olhar={olhar}
          segura={
            comGiro ? (
              <g transform={`translate(0 ${GIRO_NAS_PATAS})`}>
                <GiroGirando angulo={angulo} tamanho={250} />
              </g>
            ) : undefined
          }
        />
        <Casco />
        {chega > 0 && caixaSome > 0 && (
          <g
            transform={`translate(${caixaX} ${-6 + Math.sin(t * 3) * 6})`}
            opacity={caixaSome}
          >
            <Caixa abre={abre} />
          </g>
        )}
        {sobe > 0 && !comGiro && (
          <g
            transform={`translate(${giroX} ${giroY}) scale(${0.55 + 0.45 * sobe})`}
          >
            <GiroGirando angulo={angulo} tamanho={250 * ESCALA_CAPIVARA} />
          </g>
        )}
      </g>
      <Estalo
        x={BARCO_X}
        y={LINHA_AGUA - 90}
        tempo={marcos.virada + 0.6}
        raio={230}
      />
    </svg>
  );
};
