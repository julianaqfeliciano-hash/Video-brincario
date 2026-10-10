import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { quadroDe } from "../tempo";

/**
 * Foto do produto recortada (PNG transparente, scripts/recortar_produto.py) no painel,
 * entrando com saltinho e flutuando devagar sobre uma sombra suave.
 */
export const FotoProduto: React.FC<{
  src: string; // caminho em public/
  topo: number; // y do topo da foto no painel
  tamanho: number; // lado da foto (px)
  progresso: number; // entrada 0→1 (use `salto`)
  inicio: number; // s em que entra (para a flutuação começar daí)
  centroX?: number;
  sombraY?: number;
  sombraLargura?: number;
  sombraAltura?: number;
}> = ({
  src,
  topo,
  tamanho,
  progresso,
  inicio,
  centroX = 540,
  sombraY,
  sombraLargura,
  sombraAltura = 28,
}) => {
  const frame = useCurrentFrame();
  const flutua = Math.sin((frame - quadroDe(inicio)) / 18) * 8;
  const largSombra = sombraLargura ?? Math.round(tamanho * 0.77);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: centroX - largSombra / 2,
          top: sombraY ?? topo + tamanho + 8,
          width: largSombra,
          height: sombraAltura,
          borderRadius: "50%",
          background: "rgba(59,51,46,0.14)",
          filter: "blur(8px)",
          opacity: Math.min(1, progresso),
          transform: `scale(${1 - flutua / 80})`,
        }}
      />
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: centroX - tamanho / 2,
          top: topo + flutua,
          width: tamanho,
          height: tamanho,
          objectFit: "contain",
          opacity: Math.min(1, progresso * 1.5),
          transform: `scale(${0.6 + 0.4 * progresso})`,
        }}
      />
    </>
  );
};
