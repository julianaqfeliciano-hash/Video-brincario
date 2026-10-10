import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fps, layout } from "./tema";

/**
 * Mostra o conteúdo no painel de cima entre `inicio` e `fim` (s, no vídeo cortado),
 * com fade curto na entrada e na saída. Os filhos usam o quadro absoluto do vídeo.
 */
export const Cena: React.FC<{
  inicio: number;
  fim: number;
  children: React.ReactNode;
  // Sem fade na entrada (ex.: a primeira cena, cujo quadro 0 vira a capa do vídeo)
  semFadeEntrada?: boolean;
}> = ({ inicio, fim, children, semFadeEntrada = false }) => {
  const frame = useCurrentFrame();
  const a = Math.round(inicio * fps) - (semFadeEntrada ? 8 : 2);
  const b = Math.round(fim * fps);
  if (frame < a || frame >= b) return null;
  const opacidade = interpolate(frame, [a, a + 6, b - 6, b], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: layout.painel.y,
        width: layout.largura,
        height: layout.painel.altura,
        opacity: opacidade,
      }}
    >
      {children}
    </div>
  );
};
