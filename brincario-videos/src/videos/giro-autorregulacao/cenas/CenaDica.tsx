import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores, fonte, fps } from "../../../brincario/tema";
import { entrada, marcos, quando, salto } from "../dados";
import { textoSvg } from "./estilo";

// ROTEIRO.md, cena 9: "Uma dica, peça para que ele gire devagar e respire junto com o movimento."
// Selo "DICA" e anéis de respiração em volta da capivara que crescem ("inspira") e diminuem ("solta").

const CICLO = 4; // s por respiração

export const CenaDica: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const tDica = marcos.dica.inicio;
  const tRespire = quando("respire", tDica);
  const tFim = marcos.dica.fim - 0.05;

  const eSelo = salto(frame, tDica);
  const eBolha = entrada(frame, tRespire);
  const fase = ((((t - tRespire) / CICLO) % 1) + 1) % 1;
  const inspira = fase < 0.5;
  const tamanho = 0.5 - 0.5 * Math.cos(2 * Math.PI * fase); // 0 → 1 → 0

  return (
    <Cena inicio={tDica} fim={tFim}>
      <div
        style={{
          position: "absolute",
          top: 280,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 34px 12px 16px",
            borderRadius: 40,
            background: cores.amarelo,
            border: `6px solid ${cores.texto}`,
            boxShadow: `0 8px 0 ${cores.texto}`,
            fontFamily: fonte,
            fontWeight: 900,
            fontSize: 48,
            color: cores.texto,
            opacity: Math.min(1, eSelo * 1.5),
            transform: `scale(${0.6 + 0.4 * eSelo})`,
          }}
        >
          <svg width={52} height={52} viewBox="0 0 46 46">
            <circle cx={23} cy={23} r={23} fill={cores.branco} />
            <path
              d="M23 9 A10 10 0 0 1 30 27 V31 H16 V27 A10 10 0 0 1 23 9 Z"
              fill={cores.amarelo}
              stroke={cores.texto}
              strokeWidth={2.5}
            />
            <rect
              x={17}
              y={33}
              width={12}
              height={4}
              rx={2}
              fill={cores.texto}
            />
          </svg>
          DICA: gire devagar
        </div>
      </div>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        {eBolha > 0.01 && (
          <g opacity={eBolha}>
            {/* Anéis que crescem e diminuem em volta da capivara, no ritmo da respiração */}
            <ellipse
              cx={540}
              cy={716}
              rx={190 + 90 * tamanho}
              ry={120 + 60 * tamanho}
              fill="none"
              stroke={cores.branco}
              strokeWidth={9}
              opacity={0.9}
            />
            <ellipse
              cx={540}
              cy={716}
              rx={150 + 60 * tamanho}
              ry={95 + 40 * tamanho}
              fill="none"
              stroke="#BFEFFF"
              strokeWidth={6}
              opacity={0.8}
            />
            <text
              x={540}
              y={470}
              {...textoSvg(58)}
              fill={inspira ? "#BFEFFF" : cores.branco}
            >
              {inspira ? "inspira…" : "solta…"}
            </text>
          </g>
        )}
      </svg>
    </Cena>
  );
};
