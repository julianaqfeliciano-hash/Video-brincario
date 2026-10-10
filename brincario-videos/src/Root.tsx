import { Composition } from "remotion";
import { Teste } from "./Teste";
import * as Estrela from "./videos/estrela";
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
      {/* novo_video.py: composições */}
    </>
  );
};
