import { Composition } from "remotion";
import { Teste } from "./Teste";
import * as Estrela from "./videos/estrela";
import * as GiroAutorregulacao from "./videos/giro-autorregulacao";
// novo_video.py: importações

// Vídeos verticais: 1080x1920 (9:16), 30 fps
const formato = { fps: 30, width: 1080, height: 1920 } as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Teste"
        component={Teste}
        durationInFrames={90}
        {...formato}
      />
      <Composition
        id="Estrela"
        component={Estrela.Video}
        durationInFrames={Estrela.duracaoVideo}
        defaultProps={{ guias: false, semVideo: false, soFundo: false }}
        {...formato}
      />
      <Composition
        id="EstrelaAnuncio15s"
        component={Estrela.Anuncio}
        durationInFrames={Estrela.duracaoAnuncio}
        {...formato}
      />
      <Composition
        id="GiroAutorregulacao"
        component={GiroAutorregulacao.Video}
        durationInFrames={GiroAutorregulacao.duracaoVideo}
        defaultProps={{ guias: false, semVideo: false }}
        {...formato}
      />
      <Composition
        id="GiroAutorregulacaoAnuncio15s"
        component={GiroAutorregulacao.Anuncio}
        durationInFrames={GiroAutorregulacao.duracaoAnuncio}
        {...formato}
      />
      {/* novo_video.py: composições */}
    </>
  );
};
