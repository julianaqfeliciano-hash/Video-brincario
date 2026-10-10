import { Composition } from "remotion";
import { Teste } from "./Teste";
import { AnuncioEstrela, duracaoAnuncio } from "./brincario/AnuncioEstrela";
import { VideoEstrela, duracaoEstrela } from "./brincario/VideoEstrela";

// Vídeos verticais: 1080x1920 (9:16), 30 fps
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Teste"
        component={Teste}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Estrela"
        component={VideoEstrela}
        durationInFrames={duracaoEstrela}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ guias: false, semVideo: false }}
      />
      <Composition
        id="EstrelaAnuncio15s"
        component={AnuncioEstrela}
        durationInFrames={duracaoAnuncio}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
