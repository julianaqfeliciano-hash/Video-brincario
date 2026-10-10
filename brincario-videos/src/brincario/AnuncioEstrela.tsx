import React from "react";
import { AbsoluteFill, Sequence, Series } from "remotion";
import { VideoEstrela } from "./VideoEstrela";

// Versão curta (15 s) para anúncio: gancho + estrela + benefícios + cartão final.
// Reaproveita o vídeo completo em trechos (quadros do vídeo completo, cortes nas pausas).
// Cada trecho começa no quadro da primeira palavra, senão aparece a legenda do trecho anterior.
const TRECHOS = [
  { de: 0, ate: 101 }, // "Seu filho não para de mexer as mãos? Calma, isso tem explicação."
  { de: 397, ate: 480 }, // "A estrela tátil vira uma ferramenta de autorregulação."
  { de: 958, ate: 1224 }, // "É silenciosa... Brincar também é cuidar. O link está na bio." + cartão parado
];

export const duracaoAnuncio = TRECHOS.reduce((soma, t) => soma + (t.ate - t.de), 0);

export const AnuncioEstrela: React.FC = () => (
  <AbsoluteFill>
    <Series>
      {TRECHOS.map(({ de, ate }) => (
        <Series.Sequence key={de} durationInFrames={ate - de}>
          {/* Sequence com início negativo: o vídeo completo "começa" no quadro `de` */}
          <Sequence from={-de} layout="none">
            <VideoEstrela />
          </Sequence>
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
