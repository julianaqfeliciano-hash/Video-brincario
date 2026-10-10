import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { Cena } from "../Cena";
import { cores, fonte } from "../tema";
import { entrada, quadroDe, quando, salto } from "../tempo";

// ROTEIRO.md, cena 6: "A estrela tátil vira uma ferramenta de autorregulação."
// Foto da estrela com saltinho em "tátil", flutuando; pílula "ferramenta de autorregulação".

export const CenaFerramenta: React.FC = () => {
  const frame = useCurrentFrame();

  const tDesacelerar = quando("desacelerar");
  const tEstrela = quando("estrela", tDesacelerar);
  const tTatil = quando("tatil");
  const tAuto = quando("autorregulacao");
  const tFim = quando("crianca", tAuto) - 0.15; // até "A criança aprende"

  const eRotulo = entrada(frame, tEstrela);
  const eFoto = salto(frame, tTatil);
  const flutua = Math.sin((frame - quadroDe(tTatil)) / 18) * 8;
  const ePilula = entrada(frame, tAuto);

  return (
    <Cena inicio={tEstrela - 0.15} fim={tFim}>
      <div
        style={{
          position: "absolute",
          top: 280 + 24 * (1 - eRotulo),
          width: 1080,
          textAlign: "center",
          fontFamily: fonte,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: "0.14em",
          color: cores.salviaEscura,
          opacity: eRotulo,
        }}
      >
        ESTRELA TÁTIL
      </div>

      <div
        style={{
          position: "absolute",
          left: 540 - 140,
          top: 690,
          width: 280,
          height: 26,
          borderRadius: "50%",
          background: "rgba(59,51,46,0.14)",
          filter: "blur(8px)",
          opacity: Math.min(1, eFoto),
          transform: `scale(${1 - flutua / 80})`,
        }}
      />
      <Img
        src={staticFile("midia/estrela_recorte.png")}
        style={{
          position: "absolute",
          left: 540 - 180,
          top: 330 + flutua,
          width: 360,
          height: 360,
          objectFit: "contain",
          opacity: Math.min(1, eFoto * 1.5),
          transform: `scale(${0.6 + 0.4 * eFoto})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 752 + 24 * (1 - ePilula),
          width: 1080,
          display: "flex",
          justifyContent: "center",
          opacity: ePilula,
        }}
      >
        <div
          style={{
            height: 80,
            padding: "0 40px",
            display: "flex",
            alignItems: "center",
            borderRadius: 40,
            background: cores.salviaEscura,
            color: cores.branco,
            fontFamily: fonte,
            fontWeight: 800,
            fontSize: 42,
          }}
        >
          ferramenta de&nbsp;<span style={{ color: cores.terracotaClara }}>autorregulação</span>
        </div>
      </div>
    </Cena>
  );
};
