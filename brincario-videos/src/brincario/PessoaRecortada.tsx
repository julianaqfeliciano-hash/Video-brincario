import React from "react";
import { Html5Audio, OffthreadVideo, staticFile } from "remotion";
import { layout } from "./tema";

export type Recorte = {
  video: string; // WebM com transparência (scripts/recortar_pessoa.py), caminho em public/
  proporcao: number; // altura ÷ largura do vídeo original (ex.: 850 / 478)
};

/**
 * A pessoa recortada (sem a parede de fundo), por cima do cenário. Usa o mesmo enquadramento que
 * o cartão da fala teria (mesma escala e `recorteY`), mas sem cartão: o corpo vai até a borda de
 * baixo da tela. O vídeo recortado é mudo; o som vem do vídeo original (`audio`).
 */
export const PessoaRecortada: React.FC<{
  recorte: Recorte;
  audio: string; // vídeo original da fala (com som), caminho em public/
  recorteY?: string;
  semVideo?: boolean;
}> = ({ recorte, audio, recorteY = "50%", semVideo = false }) => {
  const { x, y, largura, altura } = layout.cartao;
  const alturaVideo = largura * recorte.proporcao;
  const topo = y - (alturaVideo - altura) * (parseFloat(recorteY) / 100);
  return (
    <>
      <Html5Audio src={staticFile(audio)} />
      {!semVideo && (
        <OffthreadVideo
          src={staticFile(recorte.video)}
          transparent
          muted
          style={{
            position: "absolute",
            left: x,
            top: topo,
            width: largura,
            height: alturaVideo,
            // Sombra suave que segue o contorno do corpo e destaca a pessoa do cenário
            filter: "drop-shadow(0 14px 24px rgba(20, 16, 50, 0.45))",
          }}
        />
      )}
    </>
  );
};
