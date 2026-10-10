import React from "react";
import { AbsoluteFill } from "remotion";
import { CartaoFala } from "./CartaoFala";
import { FundoAlegre } from "./componentes/Enfeites";
import { Legendas } from "./Legendas";
import { cores, layout } from "./tema";
import type { Palavra } from "./tempo";

export type PropsVideo = {
  // Mostra as faixas que o Instagram cobre (só para conferência)
  guias?: boolean;
  // Esconde o vídeo da fala (conferência automática das zonas: scripts/verificar_zonas.py)
  semVideo?: boolean;
  // Só o cenário de fundo, sem cenas, fala e legendas (referência da conferência das zonas)
  soFundo?: boolean;
};

/**
 * Estrutura comum dos vídeos da Brincário (ESTILO.md §2.3): fundo creme, painel de ilustração
 * em cima (as cenas vão em `children`), cartão com a fala embaixo e legendas palavra por palavra.
 */
export const VideoBase: React.FC<
  PropsVideo & {
    video: string; // caminho em public/ da fala cortada
    palavras: Palavra[];
    recorteY?: string; // ajuste vertical do rosto no cartão
    fundo?: React.ReactNode; // cenário próprio (ex.: <Floresta />); padrão: fundo creme alegre
    children?: React.ReactNode;
  }
> = ({
  video,
  palavras,
  recorteY = "50%",
  guias = false,
  semVideo = false,
  soFundo = false,
  fundo,
  children,
}) => (
  <AbsoluteFill style={{ backgroundColor: cores.creme }}>
    {fundo ?? <FundoAlegre />}
    {!soFundo && (
      <>
        {children}
        <CartaoFala video={video} recorteY={recorteY} semVideo={semVideo} />
        <Legendas palavras={palavras} />
      </>
    )}
    {guias && <Guias />}
  </AbsoluteFill>
);

// Zonas que o Instagram cobre com a interface (só para conferência, não vai no vídeo final)
const Guias: React.FC = () => {
  const faixa: React.CSSProperties = {
    position: "absolute",
    left: 0,
    width: layout.largura,
    background: "rgba(200,40,40,0.18)",
    borderColor: "rgba(200,40,40,0.8)",
    borderStyle: "dashed",
    borderWidth: 0,
  };
  return (
    <>
      <div style={{ ...faixa, top: 0, height: 250, borderBottomWidth: 3 }} />
      <div
        style={{
          ...faixa,
          top: layout.altura - 400,
          height: 400,
          borderTopWidth: 3,
        }}
      />
    </>
  );
};
