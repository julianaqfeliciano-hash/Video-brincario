import React from "react";
import { VideoBase, type PropsVideo } from "../../brincario/VideoBase";
import { FundoMarca } from "../../brincario/componentes/Enfeites";
import { Floresta } from "../../brincario/componentes/Floresta";
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
import { duracaoFala, midia, palavras, quando } from "./dados";

// Estrela Tátil Sensorial — plano das cenas em ROTEIRO.md

// Tempo extra com o cartão final parado depois da fala (ROTEIRO.md, cena 16)
const SEGUNDOS_FINAIS = 1;

export const duracaoVideo = Math.ceil((duracaoFala + SEGUNDOS_FINAIS) * fps);

// A floresta triste vira dia de sol quando a capivara começa a usar a estrela ("A estrela tátil...")
const VIRADA = quando("estrela", quando("desacelerar"));
// Na apresentação ("Eu sou a Juliana, psicóloga infantil.") a chuva some: só o fundo da marca
const APRESENTACAO = { inicio: quando("eu"), fim: quando("muitas") - 0.1 };

export const Video: React.FC<PropsVideo> = (props) => (
  <VideoBase
    video={midia.fala}
    palavras={palavras}
    recorteY="52%" // rosto no cartão e marca d'água do teleprompter fora do recorte
    recorte={midia.recorte} // só a Juliana, sem a parede, por cima da floresta
    fundo={
      <>
        <Floresta virada={VIRADA} />
        <FundoMarca inicio={APRESENTACAO.inicio} fim={APRESENTACAO.fim} />
      </>
    }
    {...props}
  >
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
