import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { Cena } from "../Cena";
import { cores, fonte } from "../tema";
import { entrada, quando, salto } from "../tempo";

// ROTEIRO.md, cena 16: "Brincar também é cuidar. O link está na bio."
// Cartão final: frase da marca, botão "Link na bio" e @brincario.loja. Fica até o fim do vídeo.

export const CenaFinal: React.FC = () => {
  const frame = useCurrentFrame();

  const tBrincar = quando("brincar");
  const tCuidar = quando("cuidar", tBrincar);
  const tLink = quando("link", tCuidar);
  const tBio = quando("bio", tLink);

  const eCartao = salto(frame, tBrincar);
  const eFrase = entrada(frame, tBrincar);
  const corCuidar = interpolateColors(entrada(frame, tCuidar), [0, 1], [cores.texto, cores.terracota]);
  const eBotao = salto(frame, tLink);
  const eArroba = entrada(frame, tBio);

  return (
    <Cena inicio={tBrincar} fim={9999}>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 280,
          width: 900,
          height: 570,
          borderRadius: 56,
          background: cores.cremeClaro,
          border: `5px solid ${cores.salvia}`,
          boxShadow: "0 20px 60px rgba(59,51,46,0.12)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          fontFamily: fonte,
          opacity: Math.min(1, eCartao * 1.5),
          transform: `scale(${0.85 + 0.15 * eCartao})`,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 84,
            lineHeight: 1.08,
            textAlign: "center",
            color: cores.texto,
            opacity: eFrase,
            transform: `translateY(${24 * (1 - eFrase)}px)`,
          }}
        >
          Brincar também
          <br />é <span style={{ color: corCuidar }}>cuidar</span>
        </div>

        <div
          style={{
            background: cores.salviaEscura,
            color: cores.branco,
            fontWeight: 900,
            fontSize: 48,
            padding: "18px 56px",
            borderRadius: 48,
            opacity: Math.min(1, eBotao * 1.5),
            transform: `scale(${0.6 + 0.4 * eBotao})`,
          }}
        >
          Link na bio
        </div>

        <div
          style={{
            fontWeight: 800,
            fontSize: 44,
            color: cores.salviaEscura,
            opacity: eArroba,
            transform: `translateY(${20 * (1 - eArroba)}px)`,
          }}
        >
          @brincario.loja
        </div>
      </div>
    </Cena>
  );
};
