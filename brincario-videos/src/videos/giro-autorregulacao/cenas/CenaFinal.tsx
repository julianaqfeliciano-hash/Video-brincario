import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { Capivara } from "../../../brincario/componentes/Capivara";
import { CartaoFinal } from "../../../brincario/componentes/CartaoFinal";
import { marcos, quando, salto } from "../dados";

// ROTEIRO.md, cena 13: "Brincar também é cuidar. Está precisando desse estímulo? Clique no link da
// nossa bio." — cartão final no pôr do sol, com a capivara acenando.

export const CenaFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const tBrincar = marcos.final;
  const tCuidar = quando("cuidar", tBrincar);
  const tEsta = quando("esta", tCuidar);
  const tLink = quando("link", tEsta);
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
        pergunta="Está precisando desse estímulo?"
        tPergunta={tEsta}
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
