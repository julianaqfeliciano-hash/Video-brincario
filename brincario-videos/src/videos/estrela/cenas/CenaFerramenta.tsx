import React from "react";
import { staticFile, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { Capivara } from "../../../brincario/componentes/Capivara";
import { Estalo } from "../../../brincario/componentes/Enfeites";
import { cores, fonte, textoClaro } from "../../../brincario/tema";
import { entrada, midia, quando, salto } from "../dados";

// ROTEIRO.md, cena 6: "A estrela tátil vira uma ferramenta de autorregulação."
// A capivara pega a estrela (é aqui que a floresta vira dia de sol): surpresa em "estrela",
// feliz em "tátil", com um estalo de luz saindo da estrela; pílula "ferramenta de autorregulação".

export const CenaFerramenta: React.FC = () => {
  const frame = useCurrentFrame();

  const tDesacelerar = quando("desacelerar");
  const tEstrela = quando("estrela", tDesacelerar);
  const tTatil = quando("tatil");
  const tAuto = quando("autorregulacao");
  const tFim = quando("crianca", tAuto) - 0.15; // até "A criança aprende"

  const eRotulo = entrada(frame, tEstrela);
  const eCapivara = salto(frame, tEstrela);
  const eEstrela = salto(frame, tTatil);
  const ePilula = salto(frame, tAuto);
  const expressao = frame >= Math.round(tTatil * 30) - 2 ? "feliz" : "surpresa";
  const gira = Math.sin(frame / 10) * 6;

  return (
    <Cena inicio={tEstrela - 0.15} fim={tFim}>
      <div
        style={{
          position: "absolute",
          top: 282 + 24 * (1 - eRotulo),
          width: 1080,
          textAlign: "center",
          fontFamily: fonte,
          fontWeight: 900,
          fontSize: 40,
          letterSpacing: "0.12em",
          ...textoClaro,
          WebkitTextStroke: "8px #2B2350",
          opacity: eRotulo,
        }}
      >
        ESTRELA TÁTIL
      </div>

      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        <g
          opacity={Math.min(1, eCapivara * 1.5)}
          transform={`translate(540 800) scale(${0.6 + 0.4 * eCapivara}) translate(-540 -800)`}
        >
          <Capivara
            x={540}
            y={600}
            escala={1}
            expressao={expressao}
            bracoEsq={{ ombro: 0, cotovelo: -40 }}
            bracoDir={{ ombro: 0, cotovelo: -40 }}
            segura={
              <g transform={`rotate(${gira}) scale(${0.85 + 0.15 * eEstrela})`}>
                <circle
                  cy={30}
                  r={135 * eEstrela}
                  fill={cores.amarelo}
                  opacity={0.35}
                />
                <image
                  href={staticFile(midia.produto)}
                  x={-105}
                  y={-75}
                  width={210}
                  height={210}
                />
              </g>
            }
          />
        </g>
        <Estalo x={540} y={670} tempo={tTatil} raio={260} />
      </svg>

      <div
        style={{
          position: "absolute",
          top: 800,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            height: 74,
            padding: "0 36px",
            display: "flex",
            alignItems: "center",
            borderRadius: 37,
            background: cores.cremeClaro,
            border: `5px solid ${cores.texto}`,
            boxShadow: `0 7px 0 ${cores.texto}`,
            color: cores.texto,
            fontFamily: fonte,
            fontWeight: 900,
            fontSize: 40,
            opacity: Math.min(1, ePilula * 1.5),
            transform: `scale(${0.6 + 0.4 * ePilula})`,
          }}
        >
          ferramenta de&nbsp;
          <span style={{ color: cores.terracota }}>autorregulação</span>
        </div>
      </div>
    </Cena>
  );
};
