import React from "react";
import { CartaoFinal } from "../../../brincario/componentes/CartaoFinal";
import { quando } from "../dados";

// ROTEIRO.md, cena 16: "Brincar também é cuidar. O link está na bio."
// Cartão final: frase da marca, botão "Link na bio" e @brincario.loja. Fica até o fim do vídeo.

export const CenaFinal: React.FC = () => {
  const tBrincar = quando("brincar");
  const tCuidar = quando("cuidar", tBrincar);
  const tLink = quando("link", tCuidar);
  const tBio = quando("bio", tLink);
  return (
    <CartaoFinal
      inicio={tBrincar}
      tDestaque={tCuidar}
      tBotao={tLink}
      tArroba={tBio}
    />
  );
};
