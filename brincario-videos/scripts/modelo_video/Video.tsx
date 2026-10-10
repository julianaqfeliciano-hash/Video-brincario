import React from "react";
import { VideoBase, type PropsVideo } from "../../brincario/VideoBase";
import { fps } from "../../brincario/tema";
import { duracaoFala, midia, palavras } from "./dados";

// __NOME__ — plano das cenas em ROTEIRO.md

// Tempo extra com o cartão final parado depois da fala
const SEGUNDOS_FINAIS = 1;

export const duracaoVideo = Math.ceil((duracaoFala + SEGUNDOS_FINAIS) * fps);

export const Video: React.FC<PropsVideo> = (props) => (
  <VideoBase video={midia.fala} palavras={palavras} recorteY="50%" {...props}>
    {/* Painel de ilustração: uma <Cena...> por linha do ROTEIRO.md, na ordem do vídeo */}
  </VideoBase>
);
