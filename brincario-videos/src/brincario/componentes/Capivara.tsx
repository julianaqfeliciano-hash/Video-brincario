import React from "react";
import { useCurrentFrame } from "remotion";
import { cores } from "../tema";

/**
 * Capivara, mascote da Brincário, em estilo desenho animado (ESTILO.md §2.5): corpo caramelo
 * redondinho, barriga clara, orelhas e patas escuras, focinho largo de capivara, bochechas rosadas
 * e olhos fechados de felicidade. SVG com a origem no centro do corpo; use dentro de um <svg>.
 *
 * Braços: `ombro` é o ângulo do braço (0° = para baixo, 90° = para o lado, 150° = para cima,
 * negativo = para a frente do corpo) e `cotovelo` dobra a pata a partir daí.
 * `segura` desenha um objeto na frente da barriga (origem no centro dela), por baixo das patas.
 */
export type ExpressaoCapivara = "feliz" | "calma" | "agitada" | "surpresa";
export type BracoCapivara = { ombro: number; cotovelo: number };

export const corCapivara = {
  corpo: "#C98A55",
  barriga: "#E5B582",
  escuro: "#7A4B33",
  focinho: "#A9714E",
  contorno: "#4A2C1E",
};

const C = corCapivara;
const LINHA = 6;
const BOCA = "#7A1F3D";

const dir = (graus: number, lado: 1 | -1) => {
  const a = (graus * Math.PI) / 180;
  return { x: Math.sin(a) * lado, y: Math.cos(a) };
};

const Braco: React.FC<{ lado: 1 | -1; braco: BracoCapivara }> = ({
  lado,
  braco,
}) => {
  const ombro = { x: 100 * lado, y: 0 };
  const d1 = dir(braco.ombro, lado);
  const cot = { x: ombro.x + 46 * d1.x, y: ombro.y + 46 * d1.y };
  const d2 = dir(braco.ombro + braco.cotovelo, lado);
  const pata = { x: cot.x + 44 * d2.x, y: cot.y + 44 * d2.y };
  const caminho = `M${ombro.x} ${ombro.y} L${cot.x} ${cot.y} L${pata.x} ${pata.y}`;
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={caminho} stroke={C.contorno} strokeWidth={40 + LINHA * 2} />
      <path d={caminho} stroke={C.corpo} strokeWidth={40} />
      <ellipse
        cx={pata.x}
        cy={pata.y}
        rx={24}
        ry={21}
        fill={C.escuro}
        stroke={C.contorno}
        strokeWidth={5}
      />
      <path
        d={`M${pata.x - 8} ${pata.y + 4} v8 M${pata.x + 4} ${pata.y + 6} v8`}
        stroke={C.contorno}
        strokeWidth={3}
      />
    </g>
  );
};

export const Capivara: React.FC<{
  x: number;
  y: number;
  escala?: number;
  expressao?: ExpressaoCapivara;
  bracoEsq?: BracoCapivara;
  bracoDir?: BracoCapivara;
  olhar?: { x: number; y: number }; // -1..1, só com olhos abertos
  inclinacao?: number; // graus
  segura?: React.ReactNode;
}> = ({
  x,
  y,
  escala = 1,
  expressao = "feliz",
  bracoEsq = { ombro: 15, cotovelo: 10 },
  bracoDir = { ombro: 15, cotovelo: 10 },
  olhar = { x: 0, y: 0 },
  inclinacao = 0,
  segura,
}) => {
  const frame = useCurrentFrame();
  const agitada = expressao === "agitada";
  const surpresa = expressao === "surpresa";
  const balanco = agitada
    ? Math.sin(frame * 0.9) * 4
    : Math.sin(frame / 12) * 3;
  const piscando = (frame + 42) % 84 < 4; // o quadro 0 (capa) nunca pega uma piscada

  const olho = (lado: 1 | -1) => {
    const cx = 56 * lado;
    const cy = -112;
    if (!agitada && !surpresa) {
      return (
        <path
          key={lado}
          d={`M${cx - 13} ${cy + 3} Q${cx} ${cy - 9} ${cx + 13} ${cy + 3}`}
          stroke={C.contorno}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    const r = surpresa ? 10 : 8;
    return (
      <g
        key={lado}
        transform={`translate(${cx} ${cy}) scale(1 ${piscando ? 0.15 : 1})`}
      >
        <ellipse
          cx={olhar.x * 3}
          cy={olhar.y * 3}
          rx={r}
          ry={r * 1.15}
          fill={C.contorno}
        />
        <circle
          cx={olhar.x * 3 + 3}
          cy={olhar.y * 3 - 3.5}
          r={3}
          fill={cores.branco}
        />
      </g>
    );
  };

  // Boca logo abaixo do focinho (y ≈ -6)
  const boca = () => {
    if (agitada || surpresa) {
      const ry = surpresa ? 12 : 8 + Math.sin(frame * 1.3) * 2;
      return (
        <ellipse
          cx={0}
          cy={2}
          rx={8}
          ry={ry}
          fill={BOCA}
          stroke={C.contorno}
          strokeWidth={4}
        />
      );
    }
    if (expressao === "calma") {
      return (
        <path
          d="M-16 -4 Q-8 4 0 -4 Q8 4 16 -4"
          stroke={C.contorno}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    return (
      <g>
        <path
          d="M-18 -6 Q0 22 18 -6 Z"
          fill={BOCA}
          stroke={C.contorno}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <ellipse cx={0} cy={6} rx={7} ry={4} fill={cores.rosa} />
      </g>
    );
  };

  return (
    <g
      transform={`translate(${x} ${y + balanco * escala}) scale(${escala}) rotate(${inclinacao})`}
    >
      {/* Orelhas */}
      {[-1, 1].map((lado) => (
        <g key={lado}>
          <circle
            cx={86 * lado}
            cy={-152}
            r={21}
            fill={C.escuro}
            stroke={C.contorno}
            strokeWidth={LINHA}
          />
          <circle
            cx={86 * lado}
            cy={-150}
            r={9}
            fill={C.contorno}
            opacity={0.55}
          />
        </g>
      ))}
      {/* Pezinhos */}
      {[-1, 1].map((lado) => (
        <ellipse
          key={lado}
          cx={52 * lado}
          cy={168}
          rx={34}
          ry={17}
          fill={C.escuro}
          stroke={C.contorno}
          strokeWidth={LINHA}
        />
      ))}
      {/* Corpo */}
      <path
        d="M0 -172 C96 -172 132 -112 134 -30 C138 60 142 128 112 156 C80 178 -80 178 -112 156 C-142 128 -138 60 -134 -30 C-132 -112 -96 -172 0 -172 Z"
        fill={C.corpo}
        stroke={C.contorno}
        strokeWidth={LINHA}
        strokeLinejoin="round"
      />
      <ellipse cx={0} cy={78} rx={86} ry={82} fill={C.barriga} opacity={0.85} />
      {/* Topetinho e pelinhos */}
      <path
        d="M-14 -170 Q-8 -192 0 -172 Q8 -194 16 -170"
        fill="none"
        stroke={C.contorno}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [-110, -40],
        [114, 10],
        [-98, 96],
      ].map(([px, py], i) => (
        <path
          key={i}
          d={`M${px} ${py} q${px > 0 ? 8 : -8} 6 0 14`}
          fill="none"
          stroke={C.contorno}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.45}
        />
      ))}

      {/* Rosto */}
      <ellipse
        cx={-88}
        cy={-72}
        rx={20}
        ry={12}
        fill={cores.bochecha}
        opacity={0.7}
      />
      <ellipse
        cx={88}
        cy={-72}
        rx={20}
        ry={12}
        fill={cores.bochecha}
        opacity={0.7}
      />
      {agitada &&
        [-1, 1].map((lado) => (
          <path
            key={lado}
            d={`M${76 * lado} -134 L${38 * lado} -144`}
            stroke={C.contorno}
            strokeWidth={6}
            strokeLinecap="round"
          />
        ))}
      {olho(-1)}
      {olho(1)}
      {/* Focinho largo e achatado: nariz escuro em cima, narinas pequenas e linha até a boca */}
      <rect
        x={-60}
        y={-94}
        width={120}
        height={84}
        rx={40}
        fill={C.focinho}
        stroke={C.contorno}
        strokeWidth={5}
      />
      <path
        d="M-40 -76 Q-40 -92 0 -92 Q40 -92 40 -76 Q40 -60 0 -60 Q-40 -60 -40 -76 Z"
        fill={C.escuro}
      />
      <path
        d="M-26 -78 q6 -7 11 2"
        stroke={C.contorno}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M26 -78 q-6 -7 -11 2"
        stroke={C.contorno}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx={-12}
        cy={-86}
        rx={12}
        ry={4}
        fill={cores.branco}
        opacity={0.3}
      />
      <path
        d="M0 -60 V-34"
        stroke={C.contorno}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <g transform="translate(0 -26)">{boca()}</g>
      {agitada && (
        <path
          d="M124 -126 Q112 -106 124 -100 Q136 -106 124 -126 Z"
          fill={cores.azul}
          stroke={C.contorno}
          strokeWidth={3}
          transform={`translate(0 ${(frame % 30) * 0.8})`}
          opacity={1 - (frame % 30) / 30}
        />
      )}

      {/* Objeto segurado + patas por cima */}
      {segura && <g transform="translate(0 40)">{segura}</g>}
      <Braco lado={-1} braco={bracoEsq} />
      <Braco lado={1} braco={bracoDir} />
    </g>
  );
};
