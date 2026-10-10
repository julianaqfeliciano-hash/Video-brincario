import React from "react";
import { OffthreadVideo, staticFile } from "remotion";
import { layout } from "./tema";

// Cartão com cantos arredondados que mostra a fala recortada no rosto (ESTILO.md §2.3)
export const CartaoFala: React.FC<{
  video: string;
  // Posição vertical do recorte (0% = topo do vídeo, 100% = base); ajusta onde o rosto fica no cartão
  recorteY?: string;
}> = ({ video, recorteY = "50%" }) => {
  const { x, y, largura, altura, raio } = layout.cartao;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: largura,
        height: altura,
        borderRadius: raio,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(59,51,46,0.18)",
      }}
    >
      <OffthreadVideo
        src={staticFile(video)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `50% ${recorteY}`,
        }}
      />
    </div>
  );
};
