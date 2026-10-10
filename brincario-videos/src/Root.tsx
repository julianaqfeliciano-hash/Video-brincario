import { Composition } from "remotion";
import { Teste } from "./Teste";

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
    </>
  );
};
