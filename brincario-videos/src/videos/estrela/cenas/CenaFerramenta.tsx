import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { FotoProduto } from "../../../brincario/componentes/FotoProduto";
import { cores, fonte } from "../../../brincario/tema";
import { entrada, midia, quando, salto } from "../dados";

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

      <FotoProduto
        src={midia.produto}
        topo={330}
        tamanho={360}
        progresso={eFoto}
        inicio={tTatil}
        sombraY={690}
        sombraLargura={280}
        sombraAltura={26}
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
          ferramenta de&nbsp;
          <span style={{ color: cores.terracotaClara }}>autorregulação</span>
        </div>
      </div>
    </Cena>
  );
};
