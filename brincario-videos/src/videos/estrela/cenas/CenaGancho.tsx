import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores, fonte, fps } from "../../../brincario/tema";
import { entrada, quando, salto } from "../dados";

// ROTEIRO.md, cenas 1–2: "Seu filho não para de mexer as mãos? Calma, isso tem explicação."
// Título + criança com as mãozinhas inquietas; em "Calma" as mãos desaceleram e descansam;
// em "explicação" entra a pílula "tem explicação". O título já aparece pronto no quadro 0 (capa).

const OMBRO = { x: 70, y: 642 };
const BRACO = 118;

const Crianca: React.FC<{ t: number; calma: number }> = ({ t, calma }) => {
  // Ângulo do braço direito (0° = horizontal p/ fora, positivo = para baixo)
  const amplitude = 22 * (1 - calma);
  const base = -35 + (70 + 35) * calma; // mãos para cima e agitadas -> descansando ao lado do corpo
  const angulo = (fase: number) =>
    ((base + amplitude * Math.sin(2 * Math.PI * 3.6 * t + fase)) * Math.PI) /
    180;
  const mao = (lado: 1 | -1, fase: number) => {
    const a = angulo(fase);
    return {
      x: 540 + lado * (OMBRO.x + BRACO * Math.cos(a)),
      y: OMBRO.y + BRACO * Math.sin(a),
    };
  };
  const dir = mao(1, 0);
  const esq = mao(-1, 1.7);

  const linhas = (m: { x: number; y: number }, lado: 1 | -1) =>
    [0, 1, 2].map((i) => {
      const r = 42 + i * 14;
      const ini = -50 + i * 6;
      const fim = 30 - i * 6;
      const p = (graus: number) => {
        const a = (graus * Math.PI) / 180;
        return `${m.x + lado * r * Math.cos(a)} ${m.y + r * Math.sin(a)}`;
      };
      return (
        <path
          key={i}
          d={`M ${p(ini)} A ${r} ${r} 0 0 ${lado === 1 ? 1 : 0} ${p(fim)}`}
          fill="none"
          stroke={cores.terracota}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={(1 - calma) * (0.55 + 0.45 * Math.sin(t * 14 + i))}
        />
      );
    });

  return (
    <g>
      {/* Braços */}
      {[
        { m: dir, lado: 1 },
        { m: esq, lado: -1 },
      ].map(({ m, lado }) => (
        <line
          key={lado}
          x1={540 + lado * OMBRO.x}
          y1={OMBRO.y}
          x2={m.x}
          y2={m.y}
          stroke={cores.salvia}
          strokeWidth={34}
          strokeLinecap="round"
        />
      ))}
      {/* Corpo */}
      <rect
        x={540 - 88}
        y={612}
        width={176}
        height={168}
        rx={60}
        fill={cores.salvia}
      />
      {/* Cabeça */}
      <circle cx={540} cy={548} r={62} fill={cores.terracotaClara} />
      <path
        d="M480 540 Q482 480 540 482 Q598 480 600 540 Q585 510 540 512 Q495 510 480 540 Z"
        fill={cores.salviaEscura}
      />
      <circle cx={518} cy={556} r={6} fill={cores.texto} />
      <circle cx={562} cy={556} r={6} fill={cores.texto} />
      <path
        d="M524 578 Q540 590 556 578"
        fill="none"
        stroke={cores.texto}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Mãos */}
      <circle cx={dir.x} cy={dir.y} r={24} fill={cores.terracotaClara} />
      <circle cx={esq.x} cy={esq.y} r={24} fill={cores.terracotaClara} />
      {linhas(dir, 1)}
      {linhas(esq, -1)}
    </g>
  );
};

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
  const calma = entrada(frame, tCalma, { damping: 26, stiffness: 40 });
  const ePilula = salto(frame, tExplicacao);

  return (
    <Cena inicio={0} fim={tFim} semFadeEntrada>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        <Crianca t={t} calma={calma} />
      </svg>

      <div
        style={{
          position: "absolute",
          top: 272,
          width: 1080,
          textAlign: "center",
          fontFamily: fonte,
          fontWeight: 900,
          fontSize: 74,
          lineHeight: 1.08,
          color: cores.texto,
        }}
      >
        Não para de mexer
        <br />
        as <span style={{ color: corMaos }}>mãos?</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 790,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            height: 66,
            padding: "0 30px 0 12px",
            borderRadius: 33,
            background: cores.cremeClaro,
            border: `4px solid ${cores.salvia}`,
            fontFamily: fonte,
            fontWeight: 800,
            fontSize: 36,
            color: cores.texto,
            opacity: Math.min(1, ePilula * 1.5),
            transform: `scale(${0.6 + 0.4 * ePilula})`,
          }}
        >
          <svg width={46} height={46} viewBox="0 0 46 46">
            <circle cx={23} cy={23} r={23} fill={cores.salvia} />
            <path
              d="M23 10 A9 9 0 0 1 29 26 V30 H17 V26 A9 9 0 0 1 23 10 Z"
              fill={cores.cremeClaro}
            />
            <rect
              x={18}
              y={32}
              width={10}
              height={4}
              rx={2}
              fill={cores.cremeClaro}
            />
          </svg>
          tem explicação
        </div>
      </div>
    </Cena>
  );
};
