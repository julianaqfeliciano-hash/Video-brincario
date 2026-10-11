import React from "react";
import {
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { cores, fps } from "../tema";
import { quadroDe } from "../tempo";
import { Brilho } from "./Enfeites";

/**
 * Cenário de mar na tela inteira (1080x1920), atrás de tudo.
 * Antes de `virada` (s): mar agitado — céu escuro, ondas grandes com espuma, chuva e vento,
 * clarão suave dentro das nuvens (nunca a tela toda). Na virada as ondas baixam, as nuvens abrem e
 * vem um pôr do sol quente com reflexo na água, gaivotas e brilhos.
 * Use `estadoMar(frame, virada)` e `alturaOnda(x, t, calma)` para fazer algo boiar no ritmo das ondas.
 */

const limitar = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const DURACAO_VIRADA = 1.8; // s
export const HORIZONTE = 600;
const SOL_X = 880;

/** 0 = mar agitado, 1 = mar calmo, com a transição suave a partir de `virada`. */
export const estadoMar = (frame: number, virada: number) => {
  const ini = quadroDe(virada);
  return interpolate(frame, [ini, ini + DURACAO_VIRADA * fps], [0, 1], {
    ...limitar,
    easing: Easing.inOut(Easing.cubic),
  });
};

/** Deslocamento vertical da água no ponto x (px), no instante t (s). */
export const alturaOnda = (x: number, t: number, calma: number) => {
  const amp = 34 * (1 - calma) + 7 * calma;
  const vel = 3.2 * (1 - calma) + 1.1 * calma;
  return (
    amp * Math.sin(x / 120 + t * vel) +
    amp * 0.45 * Math.sin(x / 47 - t * vel * 1.4)
  );
};

const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const Nuvem: React.FC<{ x: number; y: number; s: number; cor: string }> = ({
  x,
  y,
  s,
  cor,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={-70} cy={10} r={52} fill={cor} />
    <circle cx={0} cy={-18} r={70} fill={cor} />
    <circle cx={74} cy={6} r={56} fill={cor} />
    <rect x={-122} y={10} width={250} height={56} rx={28} fill={cor} />
  </g>
);

const caminhoOnda = (
  base: number,
  t: number,
  calma: number,
  fase: number,
  escala: number,
) => {
  const pts: string[] = [];
  for (let x = -20; x <= 1100; x += 20) {
    pts.push(
      `${x},${(base + alturaOnda(x + fase, t, calma) * escala).toFixed(1)}`,
    );
  }
  return `M-20 1920 L${pts.join(" L")} L1100 1920 Z`;
};

export const Mar: React.FC<{ virada: number }> = ({ virada }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const calma = estadoMar(frame, virada);
  const agitado = 1 - calma;
  const mix = (a: string, b: string) =>
    interpolateColors(calma, [0, 1], [a, b]);

  const clarao = [1.0, 9.0].reduce(
    (acc, tc) =>
      acc + interpolate(t, [tc, tc + 0.12, tc + 0.6], [0, 1, 0], limitar),
    0,
  );
  const solY = interpolate(calma, [0, 1], [HORIZONTE + 120, HORIZONTE - 45]);

  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <linearGradient id="ceuMar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix("#1B2238", "#7B6CF0")} />
          <stop offset="0.18" stopColor={mix("#2A3552", "#FF8FA3")} />
          <stop offset="0.31" stopColor={mix("#44506E", "#FFD27A")} />
        </linearGradient>
        <radialGradient id="brilhoSolMar">
          <stop offset="0" stopColor="#FFF1B0" stopOpacity={0.95} />
          <stop offset="1" stopColor="#FFF1B0" stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect width={1080} height={1920} fill="url(#ceuMar)" />

      {/* Sol se pondo (dia calmo) */}
      {calma > 0 && (
        <g opacity={calma}>
          <circle cx={SOL_X} cy={solY} r={230} fill="url(#brilhoSolMar)" />
          <g
            transform={`translate(${SOL_X} ${solY}) rotate(${t * 10}) scale(0.7)`}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x={-8}
                y={-170}
                width={16}
                height={46}
                rx={8}
                fill={cores.amarelo}
                transform={`rotate(${i * 30})`}
              />
            ))}
          </g>
          <circle
            cx={SOL_X}
            cy={solY}
            r={72}
            fill={cores.amarelo}
            stroke="#F5A623"
            strokeWidth={6}
          />
          <path
            d={`M${SOL_X - 22} ${solY + 8} Q${SOL_X} ${solY + 28} ${SOL_X + 22} ${solY + 8}`}
            stroke="#C2410C"
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={SOL_X - 20} cy={solY - 14} r={7} fill="#C2410C" />
          <circle cx={SOL_X + 20} cy={solY - 14} r={7} fill="#C2410C" />
        </g>
      )}

      {/* Nuvens rosadas do pôr do sol */}
      <g opacity={calma}>
        <Nuvem x={200 + Math.sin(t / 3) * 20} y={330} s={0.8} cor="#FFE1EA" />
        <Nuvem
          x={560 + Math.sin(t / 4 + 1) * 24}
          y={420}
          s={0.5}
          cor="#FFF4E0"
        />
      </g>

      {/* Nuvens de tempestade (abrem para os lados na virada) */}
      <g opacity={Math.max(0, 1 - calma * 1.2)}>
        {[
          { x: 140, y: 270, s: 1.35 },
          { x: 480, y: 220, s: 1.55 },
          { x: 840, y: 280, s: 1.35 },
          { x: 320, y: 400, s: 1.05 },
          { x: 760, y: 420, s: 1.1 },
        ].map((n, i) => (
          <Nuvem
            key={i}
            x={
              n.x +
              (n.x < 540 ? -1 : 1) * calma * 640 +
              Math.sin(t * 1.5 + i) * 18
            }
            y={n.y}
            s={n.s}
            cor={interpolateColors(
              Math.min(1, clarao),
              [0, 1],
              ["#333C55", "#8E98B8"],
            )}
          />
        ))}
      </g>

      {/* Mar: camadas de ondas do horizonte para a frente */}
      <path
        d={caminhoOnda(HORIZONTE, t, calma, 0, 0.35)}
        fill={mix("#1A2E48", "#5B7BD6")}
      />
      {/* Reflexo do sol na água */}
      <g opacity={calma * 0.85}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={SOL_X - (90 - i * 14) + Math.sin(t * 2 + i) * 10}
            y={HORIZONTE + 18 + i * 26}
            width={(90 - i * 14) * 2}
            height={8}
            rx={4}
            fill="#FFE08A"
          />
        ))}
      </g>
      <path
        d={caminhoOnda(700, t, calma, 300, 0.7)}
        fill={mix("#1E3A5A", "#3E8FD1")}
      />
      <path
        d={caminhoOnda(830, t, calma, 600, 1)}
        fill={mix("#22476B", "#2EA7D6")}
      />
      <path
        d={caminhoOnda(1000, t, calma, 900, 1.1)}
        fill={mix("#1B3C5C", "#2595C7")}
      />
      <path
        d={caminhoOnda(1500, t, calma, 1200, 1.2)}
        fill={mix("#163250", "#1E86B8")}
      />

      {/* Espuma nas cristas do mar agitado */}
      <g opacity={agitado} fill="#E6EEF8">
        {Array.from({ length: 14 }).map((_, i) => {
          const x = ((i * 83 + t * 140 * (i % 2 ? 1 : -1) + 2000) % 1120) - 20;
          const y = 700 + alturaOnda(x + 300, t, calma) * 0.7 - 6;
          return <ellipse key={i} cx={x} cy={y} rx={26} ry={7} opacity={0.8} />;
        })}
      </g>

      {/* Gaivotas e brilhos (mar calmo) */}
      <g opacity={calma}>
        {[0, 1, 2].map((i) => {
          const px = ((t * 60 + i * 300) % 1300) - 120;
          const py = 350 + i * 50 + Math.sin(t * 2 + i) * 12;
          const asa = Math.sin(t * 9 + i) * 9;
          return (
            <path
              key={i}
              d={`M${px - 20} ${py - asa} Q${px - 9} ${py - 11} ${px} ${py} Q${px + 9} ${py - 11} ${px + 20} ${py - asa}`}
              stroke={cores.texto}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
        {[
          { x: 140, y: 760 },
          { x: 960, y: 800 },
          { x: 300, y: 1450 },
        ].map((b, i) => (
          <Brilho
            key={i}
            x={b.x}
            y={b.y}
            r={14 * (0.7 + 0.3 * Math.sin(t * 3 + i))}
            cor={cores.branco}
            opacidade={0.9}
          />
        ))}
      </g>

      {/* Chuva com vento */}
      {agitado > 0.01 && (
        <g
          opacity={agitado}
          stroke="#A9B8D6"
          strokeWidth={4}
          strokeLinecap="round"
        >
          {Array.from({ length: 70 }).map((_, i) => {
            const x0 = rnd(i) * 1300 - 50;
            const vel = 1000 + rnd(i + 70) * 500;
            const y = ((t * vel + rnd(i + 140) * 1920) % 2000) - 60;
            return (
              <line
                key={i}
                x1={x0 - y * 0.25}
                y1={y}
                x2={x0 - y * 0.25 - 14}
                y2={y + 46}
                opacity={0.5 + rnd(i + 3) * 0.4}
              />
            );
          })}
        </g>
      )}
    </svg>
  );
};
