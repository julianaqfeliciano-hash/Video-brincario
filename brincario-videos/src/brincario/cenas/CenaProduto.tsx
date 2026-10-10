import React from "react";
import { Img, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Cena } from "../Cena";
import { cores, fonte, fps } from "../tema";
import { entrada, quadroDe, quando, salto } from "../tempo";

// ROTEIRO.md, cenas 14–15: "É silenciosa e cabe na mochila, escola, sala de espera, hora da tarefa."
// Foto da estrela no centro; selos entram em sequência, junto com as palavras.

const IconeSom: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 34 34">
    <path d="M5 13 H11 L18 7 V27 L11 21 H5 Z" fill={cores.cremeClaro} strokeLinejoin="round" />
    <line x1={23} y1={12} x2={31} y2={22} stroke={cores.cremeClaro} strokeWidth={3.5} strokeLinecap="round" />
    <line x1={31} y1={12} x2={23} y2={22} stroke={cores.cremeClaro} strokeWidth={3.5} strokeLinecap="round" />
  </svg>
);

const IconeMochila: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 34 34">
    <path d="M12 8 Q12 3 17 3 Q22 3 22 8" fill="none" stroke={cores.cremeClaro} strokeWidth={3} />
    <rect x={6} y={8} width={22} height={23} rx={7} fill={cores.cremeClaro} />
    <rect x={11} y={18} width={12} height={8} rx={3} fill={cores.salvia} />
  </svg>
);

const IconeLugar: React.FC = () => (
  <svg width={34} height={34} viewBox="0 0 34 34">
    <path d="M17 31 C9 21 7 17 7 13 A10 10 0 0 1 27 13 C27 17 25 21 17 31 Z" fill={cores.cremeClaro} />
    <circle cx={17} cy={13} r={4} fill={cores.salvia} />
  </svg>
);

const Selo: React.FC<{ icone: React.ReactNode; progresso: number; children: React.ReactNode }> = ({
  icone,
  progresso,
  children,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 16,
      height: 80,
      padding: "0 30px 0 12px",
      borderRadius: 40,
      background: cores.cremeClaro,
      border: `4px solid ${cores.salvia}`,
      boxShadow: "0 10px 26px rgba(59,51,46,0.10)",
      fontFamily: fonte,
      fontWeight: 800,
      fontSize: 40,
      color: cores.texto,
      opacity: Math.min(1, progresso * 1.5),
      transform: `scale(${0.6 + 0.4 * progresso})`,
      whiteSpace: "nowrap",
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        background: cores.salvia,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icone}
    </div>
    {children}
  </div>
);

export const CenaProduto: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;

  const tMar = quando("mar");
  const tE = quando("e", tMar); // "É silenciosa"
  const tSilenciosa = quando("silenciosa");
  const tMochila = quando("mochila");
  const tEscola = quando("escola");
  const tEspera = quando("espera");
  const tTarefa = quando("tarefa");
  const tFim = quando("brincar", tTarefa) - 0.05;

  const eFoto = salto(frame, tE);
  const flutua = Math.sin((frame - quadroDe(tE)) / 18) * 8;

  // Cada palavra do terceiro selo acende em terracota quando é dita
  const acende = (seg: number) =>
    interpolateColors(entrada(frame, seg, { damping: 20, stiffness: 160 }), [0, 1], [cores.texto, cores.terracota]);
  const apaga = (seg: number, proxima: number) => (t >= proxima ? cores.texto : acende(seg));

  return (
    <Cena inicio={tE} fim={tFim}>
      {/* Sombra e foto da estrela */}
      <div
        style={{
          position: "absolute",
          left: 540 - 130,
          top: 610,
          width: 260,
          height: 28,
          borderRadius: "50%",
          background: "rgba(59,51,46,0.14)",
          filter: "blur(8px)",
          opacity: Math.min(1, eFoto),
          transform: `scale(${1 - flutua / 80})`,
        }}
      />
      <Img
        src={staticFile("midia/estrela_recorte.png")}
        style={{
          position: "absolute",
          left: 540 - 170,
          top: 262 + flutua,
          width: 340,
          height: 340,
          objectFit: "contain",
          opacity: Math.min(1, eFoto * 1.5),
          transform: `scale(${0.6 + 0.4 * eFoto})`,
        }}
      />

      {/* Selos */}
      <div
        style={{
          position: "absolute",
          top: 660,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <Selo icone={<IconeSom />} progresso={salto(frame, tSilenciosa)}>
          Silenciosa
        </Selo>
        <Selo icone={<IconeMochila />} progresso={salto(frame, tMochila)}>
          Cabe na mochila
        </Selo>
      </div>
      <div style={{ position: "absolute", top: 766, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <Selo icone={<IconeLugar />} progresso={salto(frame, tEscola)}>
          <span style={{ color: apaga(tEscola, tEspera) }}>Escola</span>
          <span style={{ color: cores.salvia }}>·</span>
          <span style={{ color: t >= quadroDe(tEspera) / fps ? apaga(tEspera, tTarefa) : cores.texto }}>Espera</span>
          <span style={{ color: cores.salvia }}>·</span>
          <span style={{ color: t >= quadroDe(tTarefa) / fps ? acende(tTarefa) : cores.texto }}>Tarefa</span>
        </Selo>
      </div>
    </Cena>
  );
};
