import React from "react";
import { OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Cena } from "../Cena";
import { cores, fonte, fps } from "../tema";
import { entrada, quadroDe, quando, salto } from "../tempo";

// ROTEIRO.md, cenas 10–13: "e ainda vira brincadeira. Coroa, pulseira, estrela do mar."
// Trechos de broll/parque.mp4 em moldura arredondada com zoom lento.
// "coroa", "pulseira" e "estrela do mar" duram ~0,5 s cada na fala, então os três trechos entram
// lado a lado, um por palavra, e continuam tocando até "É silenciosa".

const BROLL = "midia/parque.mp4";
const limitar = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Moldura arredondada tocando o b-roll a partir de `trechoInicio` (s), com zoom lento 1,0 → 1,08. */
const Moldura: React.FC<{
  x: number;
  y: number;
  largura: number;
  altura: number;
  inicio: number; // s no vídeo final
  fim: number;
  trechoInicio: number; // s no b-roll
  progresso: number; // entrada 0→1 (salto)
}> = ({ x, y, largura, altura, inicio, fim, trechoInicio, progresso }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [quadroDe(inicio), Math.round(fim * fps)], [1, 1.08], limitar);
  const de = quadroDe(inicio);
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
        boxShadow: "0 16px 44px rgba(59,51,46,0.20)",
        border: `6px solid ${cores.cremeClaro}`,
        opacity: Math.min(1, progresso * 1.5),
        transform: `scale(${0.7 + 0.3 * progresso})`,
      }}
    >
      <Sequence from={de} durationInFrames={Math.round(fim * fps) - de} layout="none">
        <OffthreadVideo
          src={staticFile(BROLL)}
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

const Rotulo: React.FC<{ x: number; y: number; texto: string; progresso: number }> = ({
  x,
  y,
  texto,
  progresso,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - 200,
      width: 400,
      top: y + 20 * (1 - progresso),
      textAlign: "center",
      fontFamily: fonte,
      fontWeight: 800,
      fontSize: 42,
      color: cores.texto,
      opacity: progresso,
    }}
  >
    {texto}
  </div>
);

export const CenaBroll: React.FC = () => {
  const frame = useCurrentFrame();

  const tBrincadeira = quando("brincadeira");
  const tCoroa = quando("coroa");
  const tPulseira = quando("pulseira");
  const tEstrela = quando("estrela", tPulseira);
  const tFim = quando("e", tEstrela) - 0.1; // "É silenciosa"

  // Moldura única com as mãos brincando, de "brincadeira" até "coroa"
  const eBrincadeira = salto(frame, tBrincadeira);

  const LARG = 300;
  const ALT = 500;
  const TOPO = 285;
  const trio = [
    { t: tCoroa, x: 70, trecho: 12.4, rotulo: "coroa" },
    { t: tPulseira, x: 390, trecho: 7.9, rotulo: "pulseira" },
    { t: tEstrela, x: 710, trecho: 15.6, rotulo: "estrela do mar" },
  ];

  return (
    <>
      <Cena inicio={tBrincadeira} fim={tCoroa + 0.15}>
        <Moldura
          x={540 - 175}
          y={262}
          largura={350}
          altura={590}
          inicio={tBrincadeira}
          fim={tCoroa + 0.15}
          trechoInicio={0.5}
          progresso={eBrincadeira}
        />
      </Cena>

      <Cena inicio={tCoroa} fim={tFim}>
        {trio.map(({ t, x, trecho, rotulo }) => {
          const p = salto(frame, t);
          if (p <= 0.001) return null;
          return (
            <React.Fragment key={rotulo}>
              <Moldura
                x={x}
                y={TOPO}
                largura={LARG}
                altura={ALT}
                inicio={t}
                fim={tFim}
                trechoInicio={trecho}
                progresso={p}
              />
              <Rotulo x={x + LARG / 2} y={TOPO + ALT + 22} texto={rotulo} progresso={entrada(frame, t)} />
            </React.Fragment>
          );
        })}
      </Cena>
    </>
  );
};
