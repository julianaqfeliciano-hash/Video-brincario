import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { Capivara } from "../../../brincario/componentes/Capivara";
import { CartaoFinal } from "../../../brincario/componentes/CartaoFinal";
import { quando, salto } from "../dados";

// ROTEIRO.md, cena 16: "Brincar também é cuidar. Quer ajudar seu filho? O link está na bio."
// Cartão final: frase da marca, botão "Link na bio" e @brincario.loja, com a capivara acenando.

export const CenaFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const tBrincar = quando("brincar");
  const tCuidar = quando("cuidar", tBrincar);
  const tQuer = quando("quer", tCuidar);
  const tLink = quando("link", tQuer);
  const tBio = quando("bio", tLink);
  const eCapivara = salto(frame, tCuidar);
  const aceno = Math.sin(frame / 4) * 18;
  return (
    <>
      <CartaoFinal
        inicio={tBrincar}
        tDestaque={tCuidar}
        tBotao={tLink}
        tArroba={tBio}
        pergunta="Quer ajudar seu filho?"
        tPergunta={tQuer}
      />
      <Cena inicio={tCuidar} fim={9999}>
        <svg
          width={1080}
          height={900}
          viewBox="0 0 1080 900"
          style={{ position: "absolute" }}
        >
          <g
            opacity={Math.min(1, eCapivara * 1.5)}
            transform={`translate(905 860) scale(${0.5 + 0.5 * eCapivara}) translate(-905 -860)`}
          >
            <Capivara
              x={905}
              y={735}
              escala={0.55}
              expressao="feliz"
              bracoEsq={{ ombro: 20, cotovelo: 10 }}
              bracoDir={{ ombro: 150 + aceno, cotovelo: 20 }}
              inclinacao={-6}
            />
          </g>
        </svg>
      </Cena>
    </>
  );
};
