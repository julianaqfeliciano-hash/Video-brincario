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
 * Cenário de floresta na tela inteira (1080x1920), atrás de tudo.
 * Antes de `virada` (s): floresta triste e chuvosa, árvores retorcidas, neblina e olhinhos no mato.
 * Na virada: a chuva para, as nuvens se abrem, o sol nasce e a floresta fica verde e acolhedora.
 * Relâmpagos são só um clarão suave dentro das nuvens (nada de piscar a tela inteira).
 */

const limitar = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
const DURACAO_VIRADA = 1.6; // s

const mistura = (sol: number, triste: string, feliz: string) =>
  interpolateColors(sol, [0, 1], [triste, feliz]);

// Pseudo-aleatório determinístico (mesmo desenho em todo quadro)
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const Nuvem: React.FC<{
  x: number;
  y: number;
  s: number;
  cor: string;
  opacidade?: number;
}> = ({ x, y, s, cor, opacidade = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacidade}>
    <circle cx={-70} cy={10} r={52} fill={cor} />
    <circle cx={0} cy={-18} r={70} fill={cor} />
    <circle cx={74} cy={6} r={56} fill={cor} />
    <rect x={-122} y={10} width={250} height={56} rx={28} fill={cor} />
  </g>
);

/** Árvore retorcida sem folhas (triste). */
const ArvoreSeca: React.FC<{
  x: number;
  base: number;
  h: number;
  cor: string;
  espelho?: boolean;
}> = ({ x, base, h, cor, espelho = false }) => (
  <g transform={`translate(${x} ${base}) scale(${espelho ? -1 : 1} 1)`}>
    <path
      d={`M-16 0 Q-10 ${-h * 0.4} -22 ${-h * 0.62} Q-40 ${-h * 0.8} -70 ${-h * 0.86} M-18 ${-h * 0.62} Q4 ${-h * 0.9} 30 ${-h} M-14 ${-h * 0.4} Q30 ${-h * 0.5} 58 ${-h * 0.68} M16 0 Q8 ${-h * 0.35} 20 ${-h * 0.5}`}
      stroke={cor}
      strokeWidth={26}
      strokeLinecap="round"
      fill="none"
    />
    <path
      d={`M-22 0 Q-14 ${-h * 0.45} -6 ${-h * 0.55} Q8 ${-h * 0.45} 22 0 Z`}
      fill={cor}
    />
  </g>
);

/** Árvore frondosa (feliz). */
const ArvoreFeliz: React.FC<{
  x: number;
  base: number;
  h: number;
  cor: string;
  corEscura: string;
  frutas?: boolean;
}> = ({ x, base, h, cor, corEscura, frutas = false }) => (
  <g transform={`translate(${x} ${base})`}>
    <rect
      x={-16}
      y={-h * 0.45}
      width={32}
      height={h * 0.45}
      rx={12}
      fill="#8A5A3B"
    />
    <circle cx={0} cy={-h * 0.62} r={h * 0.3} fill={corEscura} />
    <circle cx={-h * 0.18} cy={-h * 0.72} r={h * 0.24} fill={cor} />
    <circle cx={h * 0.16} cy={-h * 0.78} r={h * 0.22} fill={cor} />
    <circle cx={0} cy={-h * 0.9} r={h * 0.2} fill={cor} />
    {frutas &&
      [
        [-0.2, -0.62],
        [0.14, -0.7],
        [-0.04, -0.86],
      ].map(([fx, fy], i) => (
        <circle key={i} cx={h * fx} cy={h * fy} r={9} fill={cores.terracota} />
      ))}
  </g>
);

export const Floresta: React.FC<{ virada: number }> = ({ virada }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const ini = quadroDe(virada);
  const sol = interpolate(frame, [ini, ini + DURACAO_VIRADA * fps], [0, 1], {
    ...limitar,
    easing: Easing.inOut(Easing.cubic),
  });
  const triste = 1 - sol;

  const ceuTopo = mistura(sol, "#1F2740", "#6CCBFF");
  const ceuBase = mistura(sol, "#46506B", "#FFF1CF");
  const fundoArvores = mistura(sol, "#1C2536", "#7FCF8E");
  const chao = mistura(sol, "#26302A", "#7BD389");
  const chaoEscuro = mistura(sol, "#1A221E", "#4FB36A");

  // Clarão suave dentro das nuvens em dois momentos (só no período triste)
  const clarao = [1.2, 7.5].reduce(
    (acc, tc) =>
      acc + interpolate(t, [tc, tc + 0.12, tc + 0.6], [0, 1, 0], limitar),
    0,
  );

  const solY = interpolate(sol, [0, 1], [700, 250]);
  const nuvensAbrem = sol * 620;

  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      <defs>
        <linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ceuTopo} />
          <stop offset="0.55" stopColor={ceuBase} />
        </linearGradient>
        <radialGradient id="brilhoSol">
          <stop offset="0" stopColor="#FFF6B0" stopOpacity={0.9} />
          <stop offset="1" stopColor="#FFF6B0" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="neblina" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9D3E6" stopOpacity={0} />
          <stop offset="0.5" stopColor="#C9D3E6" stopOpacity={0.35} />
          <stop offset="1" stopColor="#C9D3E6" stopOpacity={0} />
        </linearGradient>
      </defs>

      <rect width={1080} height={1920} fill="url(#ceu)" />

      {/* Sol nascendo */}
      {sol > 0 && (
        <g opacity={sol}>
          <circle cx={150} cy={solY} r={230} fill="url(#brilhoSol)" />
          <g transform={`translate(150 ${solY}) scale(0.8) rotate(${t * 12})`}>
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
            cx={150}
            cy={solY}
            r={78}
            fill={cores.amarelo}
            stroke="#F5A623"
            strokeWidth={6}
          />
          <path
            d={`M126 ${solY + 8} Q150 ${solY + 30} 174 ${solY + 8}`}
            stroke="#C2410C"
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
          />
          <circle cx={128} cy={solY - 15} r={7} fill="#C2410C" />
          <circle cx={172} cy={solY - 15} r={7} fill="#C2410C" />
        </g>
      )}

      {/* Nuvens fofas do dia */}
      <g opacity={sol}>
        <Nuvem
          x={880 + Math.sin(t / 3) * 20}
          y={290}
          s={0.9}
          cor={cores.branco}
        />
        <Nuvem
          x={560 + Math.sin(t / 4 + 1) * 24}
          y={420}
          s={0.6}
          cor={cores.branco}
        />
      </g>

      {/* Nuvens de chuva: abrem para os lados na virada */}
      <g opacity={Math.max(0, 1 - sol * 1.2)}>
        {[
          { x: 140, y: 280, s: 1.3 },
          { x: 470, y: 230, s: 1.5 },
          { x: 820, y: 290, s: 1.35 },
          { x: 300, y: 400, s: 1.0 },
          { x: 760, y: 420, s: 1.1 },
        ].map((n, i) => {
          const lado = n.x < 540 ? -1 : 1;
          const cor = interpolateColors(
            Math.min(1, clarao),
            [0, 1],
            ["#3A4258", "#8E98B8"],
          );
          return (
            <Nuvem
              key={i}
              x={n.x + lado * nuvensAbrem + Math.sin(t / 2 + i) * 14}
              y={n.y}
              s={n.s}
              cor={cor}
            />
          );
        })}
      </g>

      {/* Fileira de árvores ao fundo */}
      <path
        d="M0 700 Q60 600 120 690 Q190 570 260 680 Q330 590 400 690 Q480 580 560 680 Q640 600 720 690 Q800 570 880 680 Q960 600 1080 690 V1920 H0 Z"
        fill={fundoArvores}
      />

      {/* Árvores tristes (somem) e felizes (aparecem) */}
      <g opacity={triste}>
        <ArvoreSeca x={110} base={880} h={420} cor="#141B28" />
        <ArvoreSeca x={980} base={900} h={460} cor="#141B28" espelho />
        <ArvoreSeca x={300} base={780} h={260} cor="#1B2433" espelho />
        <ArvoreSeca x={790} base={790} h={280} cor="#1B2433" />
      </g>
      <g opacity={sol} transform={`translate(0 ${(1 - sol) * 60})`}>
        <ArvoreFeliz
          x={60}
          base={880}
          h={380}
          cor="#4CC46B"
          corEscura="#2E9E55"
          frutas
        />
        <ArvoreFeliz
          x={1030}
          base={900}
          h={400}
          cor="#4CC46B"
          corEscura="#2E9E55"
        />
        <ArvoreFeliz
          x={220}
          base={800}
          h={220}
          cor="#6BD58A"
          corEscura="#3FAE66"
        />
        <ArvoreFeliz
          x={860}
          base={810}
          h={230}
          cor="#6BD58A"
          corEscura="#3FAE66"
          frutas
        />
      </g>

      {/* Chão */}
      <path
        d="M0 840 Q270 790 540 830 Q810 880 1080 820 V1920 H0 Z"
        fill={chao}
      />
      <path
        d="M0 1300 Q300 1240 600 1300 Q860 1350 1080 1290 V1920 H0 Z"
        fill={chaoEscuro}
      />

      {/* Neblina rasteira */}
      <rect
        x={-200 + Math.sin(t / 3) * 60}
        y={620}
        width={1480}
        height={260}
        fill="url(#neblina)"
        opacity={triste}
      />

      {/* Olhinhos assustadores no mato */}
      <g opacity={triste}>
        {[
          { x: 40, y: 800, f: 0 },
          { x: 1040, y: 770, f: 40 },
          { x: 30, y: 1380, f: 20 },
        ].map((o, i) => {
          const aberto = (frame + o.f) % 70 < 64 ? 1 : 0.1;
          return (
            <g key={i}>
              <ellipse cx={o.x} cy={o.y + 22} rx={70} ry={40} fill="#0F1620" />
              {[-1, 1].map((l) => (
                <ellipse
                  key={l}
                  cx={o.x + l * 16}
                  cy={o.y + 14}
                  rx={8}
                  ry={10 * aberto}
                  fill="#FFE45C"
                />
              ))}
            </g>
          );
        })}
      </g>

      {/* Flores, borboletas e passarinhos (dia) */}
      <g opacity={sol}>
        {Array.from({ length: 9 }).map((_, i) => {
          const fx = 40 + i * 125 + rnd(i) * 40;
          const fy = 846 + rnd(i + 9) * 30;
          const cor = [cores.rosa, cores.amarelo, cores.lilas, cores.terracota][
            i % 4
          ];
          const s = interpolate(
            sol,
            [0.3 + (i % 3) * 0.15, 1],
            [0, 1],
            limitar,
          );
          return (
            <g key={i} transform={`translate(${fx} ${fy}) scale(${s})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <circle
                  key={a}
                  cx={14 * Math.cos((a * Math.PI) / 180)}
                  cy={14 * Math.sin((a * Math.PI) / 180)}
                  r={10}
                  fill={cor}
                />
              ))}
              <circle
                r={8}
                fill={cores.amarelo}
                stroke="#F5A623"
                strokeWidth={3}
              />
            </g>
          );
        })}
        {[0, 1].map((i) => {
          const bx = 160 + i * 700 + Math.sin(t * 1.3 + i * 2) * 60;
          const by = 600 + i * 120 + Math.cos(t * 1.7 + i) * 30;
          const bate = Math.abs(Math.sin(t * 9 + i));
          return (
            <g key={i} transform={`translate(${bx} ${by})`}>
              <ellipse
                cx={-12}
                cy={0}
                rx={14 * bate + 3}
                ry={16}
                fill={i ? cores.lilas : cores.rosa}
              />
              <ellipse
                cx={12}
                cy={0}
                rx={14 * bate + 3}
                ry={16}
                fill={i ? cores.lilas : cores.rosa}
              />
              <rect
                x={-2}
                y={-12}
                width={4}
                height={24}
                rx={2}
                fill={cores.texto}
              />
            </g>
          );
        })}
        {[0, 1, 2].map((i) => {
          const px = ((t * 70 + i * 260) % 1300) - 120;
          const py = 520 + i * 40 + Math.sin(t * 2 + i) * 10;
          const asa = Math.sin(t * 10 + i) * 8;
          return (
            <path
              key={i}
              d={`M${px - 18} ${py - asa} Q${px - 8} ${py - 10} ${px} ${py} Q${px + 8} ${py - 10} ${px + 18} ${py - asa}`}
              stroke={cores.texto}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
          );
        })}
        {[
          { x: 120, y: 720 },
          { x: 960, y: 760 },
          { x: 540, y: 720 },
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

      {/* Chuva */}
      {triste > 0.01 && (
        <g
          opacity={triste}
          stroke="#A9B8D6"
          strokeWidth={4}
          strokeLinecap="round"
        >
          {Array.from({ length: 70 }).map((_, i) => {
            const x0 = rnd(i) * 1180 - 50;
            const vel = 900 + rnd(i + 70) * 500; // px/s
            const y = ((t * vel + rnd(i + 140) * 1920) % 2000) - 60;
            return (
              <line
                key={i}
                x1={x0 - y * 0.12}
                y1={y}
                x2={x0 - y * 0.12 - 8}
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
