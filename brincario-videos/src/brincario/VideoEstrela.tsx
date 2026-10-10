import React from "react";
import { AbsoluteFill } from "remotion";
import transcricao from "../../public/legendas/fala_cortada.json";
import { CartaoFala } from "./CartaoFala";
import { Legendas } from "./Legendas";
import { CenaApresentacao } from "./cenas/CenaApresentacao";
import { CenaAutorregulacao } from "./cenas/CenaAutorregulacao";
import { CenaBroll } from "./cenas/CenaBroll";
import { CenaFinal } from "./cenas/CenaFinal";
import { CenaFerramenta } from "./cenas/CenaFerramenta";
import { CenaGancho } from "./cenas/CenaGancho";
import { CenaIcones } from "./cenas/CenaIcones";
import { CenaPinca } from "./cenas/CenaPinca";
import { CenaProduto } from "./cenas/CenaProduto";
import { CenaToque } from "./cenas/CenaToque";
import { cores, fps, layout } from "./tema";

// Tempo extra com o cartão final parado depois da fala (ROTEIRO.md, cena 16)
const SEGUNDOS_FINAIS = 1;

export const duracaoEstrela = Math.ceil((transcricao.duracao + SEGUNDOS_FINAIS) * fps);

export const VideoEstrela: React.FC<{ guias?: boolean }> = ({ guias = false }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: cores.creme }}>
      {/* Painel de ilustração: cada cena aparece só no seu trecho (ROTEIRO.md) */}
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

      <CartaoFala video="midia/fala_cortada.mp4" recorteY="50%" />
      <Legendas palavras={transcricao.palavras} />

      {guias && <Guias />}
    </AbsoluteFill>
  );
};

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
      <div style={{ ...faixa, top: layout.altura - 400, height: 400, borderTopWidth: 3 }} />
    </>
  );
};
