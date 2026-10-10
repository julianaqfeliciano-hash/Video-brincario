import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { MolduraBroll } from "../../../brincario/componentes/MolduraBroll";
import { cores, fonte } from "../../../brincario/tema";
import { entrada, midia, quando, salto } from "../dados";

// ROTEIRO.md, cenas 10–13: "e ainda vira brincadeira. Coroa, pulseira, estrela do mar."
// Trechos de broll/parque.mp4 em moldura arredondada com zoom lento.
// "coroa", "pulseira" e "estrela do mar" duram ~0,5 s cada na fala, então os três trechos entram
// lado a lado, um por palavra, e continuam tocando até "É silenciosa".

const Rotulo: React.FC<{
  x: number;
  y: number;
  texto: string;
  progresso: number;
}> = ({ x, y, texto, progresso }) => (
  <div
    style={{
      position: "absolute",
      left: x - 200,
      width: 400,
      top: y + 20 * (1 - progresso),
      textAlign: "center",
      fontFamily: fonte,
      fontWeight: 800,
      fontSize: 42,
      color: cores.texto,
      opacity: progresso,
    }}
  >
    {texto}
  </div>
);

export const CenaBroll: React.FC = () => {
  const frame = useCurrentFrame();

  const tBrincadeira = quando("brincadeira");
  const tCoroa = quando("coroa");
  const tPulseira = quando("pulseira");
  const tEstrela = quando("estrela", tPulseira);
  const tFim = quando("e", tEstrela) - 0.1; // "É silenciosa"

  // Moldura única com as mãos brincando, de "brincadeira" até "coroa"
  const eBrincadeira = salto(frame, tBrincadeira);

  const LARG = 300;
  const ALT = 500;
  const TOPO = 285;
  const trio = [
    { t: tCoroa, x: 70, trecho: 12.4, rotulo: "coroa" },
    { t: tPulseira, x: 390, trecho: 7.9, rotulo: "pulseira" },
    { t: tEstrela, x: 710, trecho: 15.6, rotulo: "estrela do mar" },
  ];

  return (
    <>
      <Cena inicio={tBrincadeira} fim={tCoroa + 0.15}>
        <MolduraBroll
          src={midia.broll}
          x={540 - 175}
          y={262}
          largura={350}
          altura={590}
          inicio={tBrincadeira}
          fim={tCoroa + 0.15}
          trechoInicio={0.5}
          progresso={eBrincadeira}
        />
      </Cena>

      <Cena inicio={tCoroa} fim={tFim}>
        {trio.map(({ t, x, trecho, rotulo }) => {
          const p = salto(frame, t);
          if (p <= 0.001) return null;
          return (
            <React.Fragment key={rotulo}>
              <MolduraBroll
                src={midia.broll}
                x={x}
                y={TOPO}
                largura={LARG}
                altura={ALT}
                inicio={t}
                fim={tFim}
                trechoInicio={trecho}
                progresso={p}
              />
              <Rotulo
                x={x + LARG / 2}
                y={TOPO + ALT + 22}
                texto={rotulo}
                progresso={entrada(frame, t)}
              />
            </React.Fragment>
          );
        })}
      </Cena>
    </>
  );
};
