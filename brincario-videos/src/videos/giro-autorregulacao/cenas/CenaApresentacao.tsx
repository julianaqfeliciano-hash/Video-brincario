import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores, fonte } from "../../../brincario/tema";
import { entrada, marcos, quando, salto } from "../dados";

// ROTEIRO.md, cena 3: "Eu sou Juliana, psicóloga clínica e vim te contar hoje." (fundo da marca, sem mar)
// Apresentação da marca sobre o fundo limpo (a chuva some aqui): ícone, nome e profissão.

export const CenaApresentacao: React.FC = () => {
  const frame = useCurrentFrame();

  const tEu = marcos.apresentacao.inicio;
  const tJuliana = quando("juliana");
  const tPsicologa = quando("psicologa");
  const tFim = marcos.apresentacao.fim;

  const eIcone = salto(frame, tEu);
  const eNome = entrada(frame, tJuliana);
  const eRotulo = entrada(frame, tPsicologa);

  return (
    <Cena inicio={tEu} fim={tFim}>
      <div
        style={{
          position: "absolute",
          top: 300,
          width: 1080,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: fonte,
        }}
      >
        <svg
          width={150}
          height={150}
          viewBox="0 0 150 150"
          style={{
            opacity: Math.min(1, eIcone * 1.5),
            transform: `scale(${0.6 + 0.4 * eIcone})`,
          }}
        >
          <circle cx={75} cy={75} r={75} fill={cores.salvia} />
          {/* Coração acolhido por uma mão */}
          <path
            d="M75 98 C52 82 44 70 44 59 C44 49 52 42 61 42 C67 42 72 45 75 50 C78 45 83 42 89 42 C98 42 106 49 106 59 C106 70 98 82 75 98 Z"
            fill={cores.terracota}
          />
          <path
            d="M36 92 Q54 116 80 114 Q100 112 114 98"
            fill="none"
            stroke={cores.cremeClaro}
            strokeWidth={9}
            strokeLinecap="round"
          />
        </svg>

        <div
          style={{
            marginTop: 34,
            fontWeight: 900,
            fontSize: 120,
            lineHeight: 1,
            color: cores.texto,
            opacity: eNome,
            transform: `translateY(${24 * (1 - eNome)}px)`,
          }}
        >
          Juliana
        </div>

        <div
          style={{
            marginTop: 26,
            fontWeight: 700,
            fontSize: 36,
            letterSpacing: "0.14em",
            color: cores.branco,
            background: cores.terracota,
            padding: "12px 30px",
            borderRadius: 40,
            border: `5px solid ${cores.texto}`,
            boxShadow: `0 7px 0 ${cores.texto}`,
            opacity: eRotulo,
            transform: `translateY(${24 * (1 - eRotulo)}px)`,
          }}
        >
          PSICÓLOGA CLÍNICA
        </div>
      </div>
    </Cena>
  );
};
