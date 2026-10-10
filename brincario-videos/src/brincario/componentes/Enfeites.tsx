import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { cores, fps } from "../tema";
import { quadroDe } from "../tempo";

/** Estrelinha de 4 pontas (brilho). */
export const Brilho: React.FC<{
  x: number;
  y: number;
  r: number;
  cor: string;
  opacidade?: number;
}> = ({ x, y, r, cor, opacidade = 1 }) => (
  <path
    d={`M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z`}
    fill={cor}
    opacity={opacidade}
  />
);

/**
 * Fundo alegre do painel: manchas coloridas suaves e brilhos que flutuam e cintilam devagar.
 * Fica atrás das cenas, só na área do painel (y entre 250 e 880).
 */
export const FundoAlegre: React.FC = () => {
  const frame = useCurrentFrame();
  const flut = (fase: number, amp = 10) => Math.sin(frame / 40 + fase) * amp;
  const manchas = [
    { x: 70, y: 340, r: 80, cor: cores.amarelo, o: 0.28 },
    { x: 1020, y: 430, r: 100, cor: cores.lilas, o: 0.16 },
    { x: 40, y: 760, r: 70, cor: cores.azul, o: 0.16 },
    { x: 1030, y: 800, r: 64, cor: cores.rosa, o: 0.2 },
  ];
  const brilhos = [
    { x: 150, y: 470, r: 16, cor: cores.amarelo },
    { x: 930, y: 300, r: 20, cor: cores.rosa },
    { x: 960, y: 640, r: 14, cor: cores.azul },
    { x: 120, y: 640, r: 12, cor: cores.lilas },
    { x: 860, y: 840, r: 12, cor: cores.amarelo },
  ];
  return (
    <svg
      width={1080}
      height={900}
      viewBox="0 0 1080 900"
      style={{ position: "absolute", left: 0, top: 0 }}
    >
      {manchas.map((m, i) => (
        <circle
          key={i}
          cx={m.x + flut(i, 8)}
          cy={m.y + flut(i + 1.5, 12)}
          r={m.r}
          fill={m.cor}
          opacity={m.o}
        />
      ))}
      {brilhos.map((b, i) => (
        <Brilho
          key={i}
          x={b.x}
          y={b.y + flut(i * 2, 6)}
          r={b.r * (0.75 + 0.25 * Math.sin(frame / 9 + i * 1.7))}
          cor={b.cor}
          opacidade={0.75}
        />
      ))}
    </svg>
  );
};

/**
 * Estalo de estrelinhas e bolinhas coloridas saindo de um ponto quando algo importante aparece.
 * Dura ~0,6 s a partir de `tempo` (s). Use dentro de um <svg> do painel.
 */
export const Estalo: React.FC<{
  x: number;
  y: number;
  tempo: number;
  raio?: number;
}> = ({ x, y, tempo, raio = 120 }) => {
  const frame = useCurrentFrame();
  const inicio = quadroDe(tempo);
  const p = interpolate(frame, [inicio, inicio + 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (p <= 0 || p >= 1) return null;
  const sai = 1 - (1 - p) ** 3;
  const paleta = [
    cores.amarelo,
    cores.terracota,
    cores.lilas,
    cores.azul,
    cores.salvia,
    cores.rosa,
  ];
  return (
    <g opacity={1 - p * p}>
      {paleta.concat(paleta).map((cor, i) => {
        const ang = (i / 12) * Math.PI * 2 + 0.3;
        const d = raio * (0.55 + (0.45 * ((i * 7) % 3)) / 2) * sai;
        const px = x + Math.cos(ang) * d;
        const py = y + Math.sin(ang) * d;
        return i % 2 === 0 ? (
          <Brilho key={i} x={px} y={py} r={13 * (1 - p * 0.5)} cor={cor} />
        ) : (
          <circle key={i} cx={px} cy={py} r={7 * (1 - p * 0.5)} fill={cor} />
        );
      })}
    </g>
  );
};

/**
 * Fundo limpo da marca (creme + enfeites) cobrindo a tela inteira entre `inicio` e `fim` (s),
 * por cima de um cenário (ex.: a floresta na chuva). Usado na apresentação de quem fala.
 */
export const FundoMarca: React.FC<{ inicio: number; fim: number }> = ({
  inicio,
  fim,
}) => {
  const frame = useCurrentFrame();
  const a = quadroDe(inicio);
  const b = Math.round(fim * fps);
  if (frame < a || frame >= b + 6) return null;
  const opacidade = interpolate(frame, [a, a + 6, b, b + 6], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: cores.creme,
        opacity: opacidade,
      }}
    >
      <FundoAlegre />
    </div>
  );
};
