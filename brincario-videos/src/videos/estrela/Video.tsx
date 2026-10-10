import React from "react";
import { VideoBase, type PropsVideo } from "../../brincario/VideoBase";
import { fps } from "../../brincario/tema";
import { CenaApresentacao } from "./cenas/CenaApresentacao";
import { CenaAutorregulacao } from "./cenas/CenaAutorregulacao";
import { CenaBroll } from "./cenas/CenaBroll";
import { CenaFerramenta } from "./cenas/CenaFerramenta";
import { CenaFinal } from "./cenas/CenaFinal";
import { CenaGancho } from "./cenas/CenaGancho";
import { CenaIcones } from "./cenas/CenaIcones";
import { CenaPinca } from "./cenas/CenaPinca";
import { CenaProduto } from "./cenas/CenaProduto";
import { CenaToque } from "./cenas/CenaToque";
import { duracaoFala, midia, palavras } from "./dados";

// Estrela Tátil Sensorial — plano das cenas em ROTEIRO.md

// Tempo extra com o cartão final parado depois da fala (ROTEIRO.md, cena 16)
const SEGUNDOS_FINAIS = 1;

export const duracaoVideo = Math.ceil((duracaoFala + SEGUNDOS_FINAIS) * fps);

export const Video: React.FC<PropsVideo> = (props) => (
  <VideoBase video={midia.fala} palavras={palavras} recorteY="50%" {...props}>
    {/* Painel de ilustração: cada cena aparece só no seu trecho */}
    <CenaGancho />
    <CenaApresentacao />
    <CenaToque />
    <CenaFerramenta />
    <CenaAutorregulacao />
    <CenaPinca />
    <CenaIcones />
    <CenaBroll />
    <CenaProduto />
    <CenaFinal />
  </VideoBase>
);
