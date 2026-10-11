import React from "react";
import { FundoMarca } from "../../brincario/componentes/Enfeites";
import { Mar } from "../../brincario/componentes/Mar";
import { VideoBase, type PropsVideo } from "../../brincario/VideoBase";
import { fps } from "../../brincario/tema";
import { Barco } from "./cenas/Barco";
import { CenaAcelerado } from "./cenas/CenaAcelerado";
import { CenaApresentacao } from "./cenas/CenaApresentacao";
import { CenaAutorregulacao } from "./cenas/CenaAutorregulacao";
import { CenaCores } from "./cenas/CenaCores";
import { CenaDica } from "./cenas/CenaDica";
import { CenaEnergia } from "./cenas/CenaEnergia";
import { CenaFarol } from "./cenas/CenaFarol";
import { CenaFinal } from "./cenas/CenaFinal";
import { CenaGancho } from "./cenas/CenaGancho";
import { CenaGiro } from "./cenas/CenaGiro";
import { CenaOlhos } from "./cenas/CenaOlhos";
import { CenaRitmo } from "./cenas/CenaRitmo";
import { CenaTransicao } from "./cenas/CenaTransicao";
import { duracaoFala, marcos, midia, palavras } from "./dados";

// Giro Flex (Giro de autorregulação) — plano das cenas em ROTEIRO.md.
// Cenário: mar agitado que acalma num pôr do sol quando o Giro aparece; a capivara navega
// num barquinho o vídeo todo (cenas/Barco.tsx).

// Tempo extra com o cartão final parado depois da fala
const SEGUNDOS_FINAIS = 1;

export const duracaoVideo = Math.ceil((duracaoFala + SEGUNDOS_FINAIS) * fps);

export const Video: React.FC<PropsVideo> = (props) => (
  <VideoBase
    video={midia.fala}
    palavras={palavras}
    recorteY="52%" // rosto no cartão e marca d'água do teleprompter fora do recorte
    fundo={
      <>
        <Mar virada={marcos.virada} />
        <FundoMarca
          inicio={marcos.apresentacao.inicio}
          fim={marcos.apresentacao.fim}
        />
      </>
    }
    {...props}
  >
    <Barco />
    <CenaGancho />
    <CenaFarol />
    <CenaApresentacao />
    <CenaAcelerado />
    <CenaEnergia />
    <CenaGiro />
    <CenaOlhos />
    <CenaRitmo />
    <CenaDica />
    <CenaAutorregulacao />
    <CenaTransicao />
    <CenaCores />
    <CenaFinal />
  </VideoBase>
);
