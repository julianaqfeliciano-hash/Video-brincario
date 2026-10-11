import React from "react";
import { interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import {
  IconeLugar,
  IconeMochila,
  Selo,
} from "../../../brincario/componentes/Selo";
import { cores, fps } from "../../../brincario/tema";
import { entrada, marcos, midia, quadroDe, quando, salto } from "../dados";

// ROTEIRO.md, cena 12: "é leve, cabe na mochila, na escola, na terapia e em viagens."
// As três cores do Giro flutuando + selos; cada palavra do terceiro selo acende.

const IconePena: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 34 34">
    <path
      d="M28 4 C14 6 6 16 6 28 C18 26 28 18 28 4 Z"
      fill={cores.cremeClaro}
    />
    <path
      d="M6 28 L20 14"
      stroke={cores.salvia}
      strokeWidth={3}
      strokeLinecap="round"
    />
  </svg>
);

export const CenaCores: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const tLeve = quando("leve");
  const tE = quando("e", quando("consulta"));
  const tMochila = quando("mochila", tLeve);
  const tEscola = quando("escola", tMochila);
  const tTerapia = quando("terapia", tEscola);
  const tViagens = quando("viagens", tTerapia);
  const tFim = marcos.final - 0.05;

  const acende = (seg: number, proxima?: number) => {
    if (frame < quadroDe(seg)) return cores.texto;
    if (proxima !== undefined && t >= proxima) return cores.texto;
    return interpolateColors(
      entrada(frame, seg, { damping: 20, stiffness: 160 }),
      [0, 1],
      [cores.texto, cores.terracota],
    );
  };

  const giros = [
    { src: midia.produto, x: 220, atraso: 0 },
    { src: midia.produtoVerde, x: 540, atraso: 0.15 },
    { src: midia.produtoAzul, x: 860, atraso: 0.3 },
  ];

  return (
    <Cena inicio={tE} fim={tFim}>
      <div
        style={{
          position: "absolute",
          top: 268,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <Selo icone={<IconePena />} progresso={salto(frame, tLeve)}>
          Leve
        </Selo>
        <Selo icone={<IconeMochila />} progresso={salto(frame, tMochila)}>
          Cabe na mochila
        </Selo>
      </div>
      <div
        style={{
          position: "absolute",
          top: 372,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Selo icone={<IconeLugar />} progresso={salto(frame, tEscola)}>
          <span style={{ color: acende(tEscola, tTerapia) }}>Escola</span>
          <span style={{ color: cores.salvia }}>·</span>
          <span style={{ color: acende(tTerapia, tViagens) }}>Terapia</span>
          <span style={{ color: cores.salvia }}>·</span>
          <span style={{ color: acende(tViagens) }}>Viagens</span>
        </Selo>
      </div>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        {giros.map(({ src, x, atraso }, i) => {
          const p = salto(frame, tLeve + atraso);
          if (p <= 0.001) return null;
          const flutua = Math.sin(frame / 14 + i * 1.3) * 10;
          return (
            <g
              key={src}
              transform={`translate(${x} ${528 + flutua}) scale(${0.5 + 0.5 * p}) rotate(${frame * 2 + i * 40})`}
              opacity={Math.min(1, p * 1.5)}
            >
              <image
                href={staticFile(src)}
                x={-64}
                y={-64}
                width={128}
                height={128}
              />
            </g>
          );
        })}
      </svg>
    </Cena>
  );
};
