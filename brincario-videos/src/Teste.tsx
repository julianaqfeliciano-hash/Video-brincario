import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Teste: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrada = spring({ frame, fps, config: { damping: 12 } });
  const opacidadeTitulo = interpolate(frame, [10, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo
        src={staticFile("midia/fala.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 260,
        }}
      >
        <Img
          src={staticFile("midia/estrela.png")}
          style={{
            width: 520,
            transform: `scale(${entrada}) rotate(${(1 - entrada) * -90}deg)`,
          }}
        />
        <div
          style={{
            marginTop: 40,
            opacity: opacidadeTitulo,
            fontFamily: "sans-serif",
            fontWeight: 900,
            fontSize: 84,
            color: "#fff",
            textAlign: "center",
            textShadow: "0 6px 24px rgba(0,0,0,0.7)",
          }}
        >
          Estrela Tátil Sensorial
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
