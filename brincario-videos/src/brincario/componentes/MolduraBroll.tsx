import React from "react";
import {
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { cores, fps } from "../tema";
import { quadroDe } from "../tempo";

const limitar = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/**
 * Moldura arredondada (borda creme, sombra suave) tocando um trecho de b-roll a partir de
 * `trechoInicio` (s), com zoom lento 1,0 → 1,08 (ESTILO.md §2.6). Posição em px do painel.
 */
export const MolduraBroll: React.FC<{
  src: string; // caminho em public/
  x: number;
  y: number;
  largura: number;
  altura: number;
  inicio: number; // s no vídeo final
  fim: number;
  trechoInicio: number; // s no b-roll
  progresso: number; // entrada 0→1 (use `salto`)
}> = ({ src, x, y, largura, altura, inicio, fim, trechoInicio, progresso }) => {
  const frame = useCurrentFrame();
  const de = quadroDe(inicio);
  const zoom = interpolate(
    frame,
    [de, Math.round(fim * fps)],
    [1, 1.08],
    limitar,
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: largura,
        height: altura,
        borderRadius: 36,
        overflow: "hidden",
        boxShadow: `0 0 0 5px ${cores.texto}, 0 11px 0 5px ${cores.texto}`,
        border: `7px solid ${cores.cremeClaro}`,
        opacity: Math.min(1, progresso * 1.5),
        transform: `scale(${0.7 + 0.3 * progresso})`,
      }}
    >
      <Sequence
        from={de}
        durationInFrames={Math.round(fim * fps) - de}
        layout="none"
      >
        <OffthreadVideo
          src={staticFile(src)}
          trimBefore={Math.round(trechoInicio * fps)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
          }}
        />
      </Sequence>
    </div>
  );
};
