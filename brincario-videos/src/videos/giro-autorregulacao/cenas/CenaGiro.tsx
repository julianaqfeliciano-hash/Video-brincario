import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores, fonte } from "../../../brincario/tema";
import { entrada, marcos, quadroDe, quando, salto } from "../dados";
import { limitar, textoSvg } from "./estilo";

// ROTEIRO.md, cena 6: "O giro tem um movimento fluido e contínuo." — a virada (o Giro sai da caixa:
// ver Barco.tsx). Rótulo "GIRO FLEX" e pílula "movimento fluido e contínuo" com uma onda que se desenha.

export const CenaGiro: React.FC = () => {
  const frame = useCurrentFrame();
  const tGiro = marcos.virada;
  const tFluido = quando("fluido", tGiro);
  const tFim = quando("enquanto", tGiro) - 0.05;

  const eTitulo = salto(frame, tGiro + 0.3);
  const ePilula = entrada(frame, tFluido);
  const desenha = interpolate(
    frame,
    [quadroDe(tFluido), quadroDe(tFluido) + 24],
    [0, 1],
    limitar,
  );
  const onda: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = 300 + (480 * i) / 60;
    onda.push(`${x},${(540 + 22 * Math.sin(i / 6 + frame / 6)).toFixed(1)}`);
  }
  const visiveis = Math.max(2, Math.round(onda.length * desenha));

  return (
    <Cena inicio={tGiro} fim={tFim}>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        <g
          transform={`translate(540 330) scale(${0.5 + 0.5 * eTitulo})`}
          opacity={Math.min(1, eTitulo * 1.5)}
        >
          <text y={0} {...textoSvg(96)} fill={cores.amarelo}>
            GIRO FLEX
          </text>
        </g>
        {desenha > 0 && (
          <polyline
            points={onda.slice(0, visiveis).join(" ")}
            fill="none"
            stroke={cores.branco}
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 390,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "14px 34px",
            borderRadius: 40,
            background: cores.cremeClaro,
            border: `6px solid ${cores.texto}`,
            boxShadow: `0 8px 0 ${cores.texto}`,
            fontFamily: fonte,
            fontWeight: 900,
            fontSize: 44,
            color: cores.texto,
            opacity: ePilula,
            transform: `translateY(${24 * (1 - ePilula)}px)`,
          }}
        >
          movimento <span style={{ color: cores.salviaEscura }}>fluido</span> e
          contínuo
        </div>
      </div>
    </Cena>
  );
};
