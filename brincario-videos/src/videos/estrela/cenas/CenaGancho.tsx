import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { Brilho, Estalo } from "../../../brincario/componentes/Enfeites";
import { Personagem } from "../../../brincario/componentes/Personagem";
import { cores, fonte, fps } from "../../../brincario/tema";
import { entrada, quando, salto } from "../dados";

// ROTEIRO.md, cenas 1–2: "Seu filho não para de mexer as mãos? Calma, isso tem explicação."
// Título + criança agitada com as mãos para cima; em "Calma" ela relaxa, abaixa as mãos e sorri;
// em "explicação" entra a pílula "tem explicação" com um estalo. O quadro 0 já é a capa.

const limitar = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const CenaGancho: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;

  const tMaos = quando("maos");
  const tCalma = quando("calma");
  const tExplicacao = quando("explicacao");
  const tFim = quando("eu", tExplicacao) - 0.1;

  const corMaos = interpolateColors(
    entrada(frame, tMaos, { damping: 20, stiffness: 160 }),
    [0, 1],
    [cores.texto, cores.terracota],
  );
  const sublinhado = entrada(frame, tMaos);
  const calma = entrada(frame, tCalma, { damping: 26, stiffness: 40 });
  const ePilula = salto(frame, tExplicacao);

  // Braços: para cima e agitados -> descansando
  const agita = (fase: number) =>
    (1 - calma) * Math.sin(2 * Math.PI * 3.4 * t + fase);
  const braco = (fase: number) => ({
    ombro: interpolate(calma, [0, 1], [158, 18]) + 10 * agita(fase),
    cotovelo: interpolate(calma, [0, 1], [0, 8]) + 28 * agita(fase + 1),
  });
  const expressao = calma < 0.35 ? "agitada" : "calma";

  // Linhas de movimento e gotinhas de agitação perto das mãos
  const agitacao = 1 - calma;
  const marcas = [
    { x: 300, y: 500, r: 0 },
    { x: 640, y: 500, r: 1 },
  ];

  return (
    <Cena inicio={0} fim={tFim} semFadeEntrada>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        {marcas.map(({ x, y, r }) =>
          [0, 1, 2].map((i) => {
            const lado = r === 0 ? -1 : 1;
            const raio = 38 + i * 16;
            return (
              <path
                key={`${r}-${i}`}
                d={`M${x + lado * raio * 0.5} ${y - raio * 0.85} A${raio} ${raio} 0 0 ${lado === 1 ? 1 : 0} ${x + lado * raio * 0.5} ${y + raio * 0.85}`}
                fill="none"
                stroke={i === 1 ? cores.amarelo : cores.terracota}
                strokeWidth={7}
                strokeLinecap="round"
                opacity={agitacao * (0.55 + 0.45 * Math.sin(t * 14 + i))}
              />
            );
          }),
        )}
        <Personagem
          x={470}
          y={520}
          escala={0.72}
          expressao={expressao}
          olhosFechados={calma > 0.6}
          camiseta={cores.azul}
          bracoEsq={braco(0)}
          bracoDir={braco(0.5)}
          inclinacao={4 * agita(0.6)}
        />
        {/* Brilhos de alívio quando ela se acalma */}
        {[
          { x: 330, y: 410 },
          { x: 600, y: 390 },
          { x: 610, y: 640 },
        ].map((b, i) => (
          <Brilho
            key={i}
            x={b.x}
            y={b.y}
            r={18 * entrada(frame, tCalma + 0.2 + i * 0.12)}
            cor={i === 1 ? cores.amarelo : cores.rosa}
          />
        ))}
        <Estalo x={800} y={500} tempo={tExplicacao} raio={170} />
      </svg>

      <div
        style={{
          position: "absolute",
          top: 268,
          width: 1080,
          textAlign: "center",
          fontFamily: fonte,
          fontWeight: 900,
          fontSize: 76,
          lineHeight: 1.08,
          color: cores.texto,
          isolation: "isolate",
        }}
      >
        Não para de mexer
        <br />
        as{" "}
        <span style={{ position: "relative", color: corMaos }}>
          <span
            style={{
              position: "absolute",
              left: -6,
              right: -6,
              bottom: 6,
              height: 26,
              borderRadius: 13,
              background: cores.amarelo,
              transformOrigin: "left center",
              transform: `scaleX(${sublinhado})`,
              zIndex: -1,
            }}
          />
          mãos?
        </span>
      </div>

      {/* Balão de fala saindo da personagem */}
      <div
        style={{
          position: "absolute",
          left: 600,
          top: 448,
          transformOrigin: "0% 100%",
          opacity: Math.min(1, ePilula * 1.5),
          transform: `scale(${0.4 + 0.6 * ePilula}) rotate(${interpolate(ePilula, [0, 1], [-10, 0], limitar)}deg)`,
        }}
      >
        <svg
          width={60}
          height={50}
          viewBox="0 0 60 50"
          style={{ position: "absolute", left: -34, top: 52 }}
        >
          <path
            d="M58 4 L4 44 L52 30 Z"
            fill={cores.cremeClaro}
            stroke={cores.texto}
            strokeWidth={5}
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            height: 92,
            padding: "0 34px 0 16px",
            borderRadius: 46,
            background: cores.cremeClaro,
            border: `5px solid ${cores.texto}`,
            boxShadow: `0 7px 0 ${cores.texto}`,
            fontFamily: fonte,
            fontWeight: 900,
            fontSize: 42,
            color: cores.texto,
            whiteSpace: "nowrap",
          }}
        >
          <svg width={56} height={56} viewBox="0 0 46 46">
            <circle cx={23} cy={23} r={23} fill={cores.amarelo} />
            <path
              d="M23 10 A9 9 0 0 1 29 26 V30 H17 V26 A9 9 0 0 1 23 10 Z"
              fill={cores.cremeClaro}
              stroke={cores.texto}
              strokeWidth={2.5}
            />
            <rect
              x={18}
              y={32}
              width={10}
              height={4}
              rx={2}
              fill={cores.texto}
            />
          </svg>
          tem explicação!
        </div>
      </div>
    </Cena>
  );
};
