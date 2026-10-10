import React from "react";
import { AbsoluteFill, Sequence, Series } from "remotion";

export type Trecho = { de: number; ate: number }; // quadros do vídeo completo

/**
 * Versão curta para anúncio: emenda trechos do vídeo completo, sem duplicar cenas.
 * Comece cada trecho no quadro da primeira palavra (senão aparece a legenda do trecho anterior)
 * e termine numa pausa. O último trecho pode passar do fim do vídeo para segurar o cartão final.
 */
export const Anuncio: React.FC<{ Video: React.FC; trechos: Trecho[] }> = ({
  Video,
  trechos,
}) => (
  <AbsoluteFill>
    <Series>
      {trechos.map(({ de, ate }) => (
        <Series.Sequence key={de} durationInFrames={ate - de}>
          {/* Sequence com início negativo: o vídeo completo "começa" no quadro `de` */}
          <Sequence from={-de} layout="none">
            <Video />
          </Sequence>
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);

export const duracaoTrechos = (trechos: Trecho[]) =>
  trechos.reduce((soma, t) => soma + (t.ate - t.de), 0);
