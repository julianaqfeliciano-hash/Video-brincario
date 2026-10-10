import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { FotoProduto } from "../../../brincario/componentes/FotoProduto";
import {
  IconeLugar,
  IconeMochila,
  IconeSom,
  Selo,
} from "../../../brincario/componentes/Selo";
import { cores, fps } from "../../../brincario/tema";
import { entrada, midia, quadroDe, quando, salto } from "../dados";

// ROTEIRO.md, cenas 14–15: "É silenciosa e cabe na mochila, escola, sala de espera, hora da tarefa."
// Foto da estrela no centro; selos entram em sequência, junto com as palavras.

export const CenaProduto: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;

  const tMar = quando("mar");
  const tE = quando("ela", tMar); // "ela é silenciosa"
  const tSilenciosa = quando("silenciosa");
  const tMochila = quando("mochila");
  const tEscola = quando("escola");
  const tEspera = quando("espera");
  const tTarefa = quando("tarefa");
  const tFim = quando("brincar", tTarefa) - 0.05;

  const eFoto = salto(frame, tE);

  // Cada palavra do terceiro selo acende em terracota quando é dita
  const acende = (seg: number) =>
    interpolateColors(
      entrada(frame, seg, { damping: 20, stiffness: 160 }),
      [0, 1],
      [cores.texto, cores.terracota],
    );
  const apaga = (seg: number, proxima: number) =>
    t >= proxima ? cores.texto : acende(seg);

  return (
    <Cena inicio={tE} fim={tFim}>
      <FotoProduto
        src={midia.produto}
        topo={262}
        tamanho={340}
        progresso={eFoto}
        inicio={tE}
        sombraY={610}
        sombraLargura={260}
      />

      {/* Selos */}
      <div
        style={{
          position: "absolute",
          top: 660,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <Selo icone={<IconeSom />} progresso={salto(frame, tSilenciosa)}>
          Silenciosa
        </Selo>
        <Selo icone={<IconeMochila />} progresso={salto(frame, tMochila)}>
          Cabe na mochila
        </Selo>
      </div>
      <div
        style={{
          position: "absolute",
          top: 766,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Selo icone={<IconeLugar />} progresso={salto(frame, tEscola)}>
          <span style={{ color: apaga(tEscola, tEspera) }}>Escola</span>
          <span style={{ color: cores.salvia }}>·</span>
          <span
            style={{
              color:
                t >= quadroDe(tEspera) / fps
                  ? apaga(tEspera, tTarefa)
                  : cores.texto,
            }}
          >
            Espera
          </span>
          <span style={{ color: cores.salvia }}>·</span>
          <span
            style={{
              color:
                t >= quadroDe(tTarefa) / fps ? acende(tTarefa) : cores.texto,
            }}
          >
            Tarefa
          </span>
        </Selo>
      </div>
    </Cena>
  );
};
