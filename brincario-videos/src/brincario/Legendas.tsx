import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { cores, fonte, layout } from "./tema";
import type { Palavra } from "./tempo";

type Grupo = { palavras: Palavra[]; inicio: number; fim: number };

const MAX_PALAVRAS = 3;
const PAUSA_QUEBRA = 0.35; // pausa (s) que inicia um grupo novo
const PAUSA_SOME = 0.6; // pausa (s) a partir da qual a legenda some antes do próximo grupo
const FICA_DEPOIS = 0.3; // quanto a legenda fica na tela depois da última palavra, se some

// Agrupa as palavras em blocos de até 3, quebrando em pontuação e pausas (ESTILO.md §2.4)
export const agrupar = (palavras: Palavra[]): Grupo[] => {
  const grupos: Palavra[][] = [];
  let atual: Palavra[] = [];
  palavras.forEach((p, i) => {
    const anterior = palavras[i - 1];
    const quebra =
      atual.length >= MAX_PALAVRAS ||
      (anterior && /[.,?!;:]$/.test(anterior.texto)) ||
      (anterior && p.inicio - anterior.fim > PAUSA_QUEBRA);
    if (quebra && atual.length > 0) {
      grupos.push(atual);
      atual = [];
    }
    atual.push(p);
  });
  if (atual.length > 0) grupos.push(atual);

  return grupos.map((g, i) => {
    const proximo = grupos[i + 1];
    const ultimo = g[g.length - 1];
    const fim =
      proximo && proximo[0].inicio - ultimo.fim <= PAUSA_SOME
        ? proximo[0].inicio
        : ultimo.fim + FICA_DEPOIS;
    return { palavras: g, inicio: g[0].inicio, fim };
  });
};

export const Legendas: React.FC<{ palavras: Palavra[] }> = ({ palavras }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const grupos = React.useMemo(() => agrupar(palavras), [palavras]);
  const grupo = grupos.find((g) => t >= g.inicio && t < g.fim);
  if (!grupo) return null;

  // Palavra em destaque = a última que já começou
  const faladas = grupo.palavras.filter((p) => t >= p.inicio);
  const destaque = faladas[faladas.length - 1];

  return (
    <div
      style={{
        position: "absolute",
        left: layout.cartao.x + 40,
        width: layout.cartao.largura - 80,
        top: layout.legendaY - 60,
        height: 120,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 18,
        fontFamily: fonte,
        fontWeight: 900,
        fontSize: 68,
        lineHeight: 1.05,
      }}
    >
      {grupo.palavras.map((p, i) => {
        const falada = t >= p.inicio;
        const ehDestaque = p === destaque;
        const pulo = spring({
          frame: frame - Math.round(p.inicio * fps),
          fps,
          config: { damping: 14, stiffness: 220 },
          durationInFrames: 8,
        });
        const escala = ehDestaque ? 0.92 + 0.16 * pulo : 1;
        return (
          <span
            key={i}
            style={{
              // Palavras ainda não ditas ocupam o espaço, mas não aparecem (a linha não "pula")
              visibility: falada ? "visible" : "hidden",
              color: ehDestaque ? cores.terracota : cores.branco,
              WebkitTextStroke: `7px ${cores.texto}`,
              paintOrder: "stroke fill",
              textShadow: "0 4px 14px rgba(0,0,0,0.35)",
              transform: `scale(${escala})`,
              display: "inline-block",
            }}
          >
            {p.texto}
          </span>
        );
      })}
    </div>
  );
};
