import React from "react";
import { useCurrentFrame } from "remotion";
import { cores } from "../tema";

/**
 * Criança em estilo desenho animado (ESTILO.md §2.5): contorno índigo, cabeça grande, olhos com
 * brilho que piscam, sobrancelhas e boca expressivas, bochechas rosadas e camiseta com estrela.
 * Desenhada em SVG com a origem no centro da cabeça; use dentro de um <svg> do painel.
 *
 * Braços: `ombro` é o ângulo do braço (0° = para baixo, 90° = para o lado, 160° = para cima) e
 * `cotovelo` dobra o antebraço a partir daí (positivo = para fora).
 */
export type Expressao = "agitada" | "calma" | "feliz" | "surpresa";
export type Braco = { ombro: number; cotovelo: number };

const CONTORNO = 6;

const dir = (graus: number, lado: 1 | -1) => {
  const a = (graus * Math.PI) / 180;
  return { x: Math.sin(a) * lado, y: Math.cos(a) };
};

const BracoSvg: React.FC<{ lado: 1 | -1; braco: Braco; camiseta: string }> = ({
  lado,
  braco,
  camiseta,
}) => {
  const ombro = { x: 78 * lado, y: 138 };
  const d1 = dir(braco.ombro, lado);
  const cot = { x: ombro.x + 72 * d1.x, y: ombro.y + 72 * d1.y };
  const d2 = dir(braco.ombro + braco.cotovelo, lado);
  const mao = { x: cot.x + 66 * d2.x, y: cot.y + 66 * d2.y };
  const manga = { x: ombro.x + 34 * d1.x, y: ombro.y + 34 * d1.y };
  const caminho = `M${ombro.x} ${ombro.y} L${cot.x} ${cot.y} L${mao.x} ${mao.y}`;
  // Polegar: para dentro da mão, em direção ao corpo
  const polegar = {
    x: mao.x - 20 * lado * (d2.y >= 0 ? 1 : -1),
    y: mao.y - 14,
  };
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={caminho} stroke={cores.texto} strokeWidth={30 + CONTORNO * 2} />
      <path d={caminho} stroke={cores.pele} strokeWidth={30} />
      <path
        d={`M${ombro.x} ${ombro.y} L${manga.x} ${manga.y}`}
        stroke={cores.texto}
        strokeWidth={44 + CONTORNO * 2}
      />
      <path
        d={`M${ombro.x} ${ombro.y} L${manga.x} ${manga.y}`}
        stroke={camiseta}
        strokeWidth={44}
      />
      <circle
        cx={polegar.x}
        cy={polegar.y}
        r={10}
        fill={cores.pele}
        stroke={cores.texto}
        strokeWidth={5}
      />
      <circle
        cx={mao.x}
        cy={mao.y}
        r={24}
        fill={cores.pele}
        stroke={cores.texto}
        strokeWidth={5}
      />
    </g>
  );
};

export const Personagem: React.FC<{
  x: number;
  y: number;
  escala?: number;
  expressao?: Expressao;
  olhosFechados?: boolean;
  camiseta?: string;
  cabelo?: "coques" | "curto";
  bracoEsq?: Braco;
  bracoDir?: Braco;
  olhar?: { x: number; y: number }; // -1..1
  inclinacao?: number; // graus
  shorts?: string;
  tenis?: string;
}> = ({
  x,
  y,
  escala = 1,
  expressao = "feliz",
  olhosFechados = false,
  camiseta = cores.salvia,
  cabelo = "coques",
  bracoEsq = { ombro: 20, cotovelo: 10 },
  bracoDir = { ombro: 20, cotovelo: 10 },
  olhar = { x: 0, y: 0 },
  inclinacao = 0,
  shorts = cores.lilas,
  tenis = cores.terracota,
}) => {
  const frame = useCurrentFrame();
  // Respiração (agitada = balanço rápido) e piscada a cada ~2,8 s
  const balanco =
    expressao === "agitada"
      ? Math.sin(frame * 0.9) * 4
      : Math.sin(frame / 12) * 3;
  const piscando = (frame + 42) % 84 < 4; // deslocado: o quadro 0 (capa) nunca pega uma piscada
  const sobrancelhaY = expressao === "surpresa" ? -40 : -30;

  const olho = (lado: 1 | -1) => {
    const cx = 34 * lado;
    if (olhosFechados) {
      return (
        <path
          key={lado}
          d={`M${cx - 15} 14 Q${cx} 0 ${cx + 15} 14`}
          stroke={cores.texto}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
        />
      );
    }
    const px = cx + olhar.x * 6;
    const py = 12 + olhar.y * 6;
    return (
      <g
        key={lado}
        transform={`translate(${cx} 10) scale(1 ${piscando ? 0.12 : 1}) translate(${-cx} -10)`}
      >
        <ellipse
          cx={cx}
          cy={10}
          rx={18}
          ry={21}
          fill={cores.branco}
          stroke={cores.texto}
          strokeWidth={4}
        />
        <circle cx={px} cy={py} r={10} fill={cores.texto} />
        <circle cx={px + 3.5} cy={py - 4} r={3.5} fill={cores.branco} />
      </g>
    );
  };

  const sobrancelha = (lado: 1 | -1) => {
    const fora = 52 * lado;
    const dentro = 18 * lado;
    const d =
      expressao === "agitada"
        ? `M${fora} ${sobrancelhaY + 6} L${dentro} ${sobrancelhaY - 6}` // preocupada: ponta de dentro sobe
        : `M${fora} ${sobrancelhaY + 4} Q${34 * lado} ${sobrancelhaY - 10} ${dentro} ${sobrancelhaY + 2}`;
    return (
      <path
        key={lado}
        d={d}
        stroke={cores.texto}
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
    );
  };

  const boca = () => {
    switch (expressao) {
      case "agitada":
        return (
          <ellipse
            cx={0}
            cy={58}
            rx={11}
            ry={13 + Math.sin(frame * 1.3) * 2}
            fill="#7A1F3D"
            stroke={cores.texto}
            strokeWidth={4}
          />
        );
      case "surpresa":
        return (
          <ellipse
            cx={0}
            cy={60}
            rx={15}
            ry={18}
            fill="#7A1F3D"
            stroke={cores.texto}
            strokeWidth={4}
          />
        );
      case "calma":
        return (
          <path
            d="M-20 52 Q0 68 20 52"
            stroke={cores.texto}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
          />
        );
      default:
        return (
          <g>
            <path
              d="M-28 48 Q0 84 28 48 Z"
              fill="#7A1F3D"
              stroke={cores.texto}
              strokeWidth={4}
              strokeLinejoin="round"
            />
            <ellipse cx={0} cy={66} rx={11} ry={6} fill={cores.rosa} />
          </g>
        );
    }
  };

  return (
    <g
      transform={`translate(${x} ${y + balanco * escala}) scale(${escala}) rotate(${inclinacao})`}
    >
      {/* Braços (atrás do corpo) */}
      <BracoSvg lado={-1} braco={bracoEsq} camiseta={camiseta} />
      <BracoSvg lado={1} braco={bracoDir} camiseta={camiseta} />

      {/* Pernas, tênis e shorts */}
      {[-1, 1].map((lado) => (
        <g key={lado}>
          <rect
            x={lado === -1 ? -62 : 26}
            y={330}
            width={36}
            height={78}
            rx={14}
            fill={cores.pele}
            stroke={cores.texto}
            strokeWidth={CONTORNO}
          />
          <path
            transform={`scale(${lado} 1)`}
            d="M14 432 Q12 398 46 398 Q80 398 90 420 Q93 434 78 434 L18 434 Q14 434 14 432 Z"
            fill={tenis}
            stroke={cores.texto}
            strokeWidth={CONTORNO}
            strokeLinejoin="round"
          />
        </g>
      ))}
      <path
        d="M-90 286 L90 286 L88 352 L12 352 L0 336 L-12 352 L-88 352 Z"
        fill={shorts}
        stroke={cores.texto}
        strokeWidth={CONTORNO}
        strokeLinejoin="round"
      />

      {/* Corpo com camiseta e estrela */}
      <path
        d="M-92 300 L-84 158 Q-80 108 -34 102 L34 102 Q80 108 84 158 L92 300 Z"
        fill={camiseta}
        stroke={cores.texto}
        strokeWidth={CONTORNO}
        strokeLinejoin="round"
      />
      <path
        d="M-24 104 Q0 128 24 104"
        fill={cores.branco}
        stroke={cores.texto}
        strokeWidth={5}
      />
      <path
        d="M0 168 L9 186 L29 188 L14 201 L19 221 L0 210 L-19 221 L-14 201 L-29 188 L-9 186 Z"
        fill={cores.amarelo}
        stroke={cores.texto}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <rect
        x={-20}
        y={70}
        width={40}
        height={40}
        rx={12}
        fill={cores.pele}
        stroke={cores.texto}
        strokeWidth={CONTORNO}
      />

      {/* Cabeça */}
      {cabelo === "coques" && (
        <>
          <circle
            cx={-80}
            cy={-78}
            r={36}
            fill={cores.cabelo}
            stroke={cores.texto}
            strokeWidth={CONTORNO}
          />
          <circle
            cx={80}
            cy={-78}
            r={36}
            fill={cores.cabelo}
            stroke={cores.texto}
            strokeWidth={CONTORNO}
          />
          <circle
            cx={-56}
            cy={-62}
            r={9}
            fill={cores.rosa}
            stroke={cores.texto}
            strokeWidth={4}
          />
          <circle
            cx={56}
            cy={-62}
            r={9}
            fill={cores.rosa}
            stroke={cores.texto}
            strokeWidth={4}
          />
        </>
      )}
      <circle
        cx={-90}
        cy={14}
        r={20}
        fill={cores.pele}
        stroke={cores.texto}
        strokeWidth={CONTORNO}
      />
      <circle
        cx={90}
        cy={14}
        r={20}
        fill={cores.pele}
        stroke={cores.texto}
        strokeWidth={CONTORNO}
      />
      <circle
        cx={0}
        cy={0}
        r={92}
        fill={cores.pele}
        stroke={cores.texto}
        strokeWidth={CONTORNO}
      />
      {cabelo === "coques" ? (
        <path
          d="M-92 8 C-100 -78 -48 -108 0 -106 C48 -108 100 -78 92 8 C80 -34 46 -56 12 -50 C-4 -64 -40 -58 -60 -42 C-78 -30 -88 -14 -92 8 Z"
          fill={cores.cabelo}
          stroke={cores.texto}
          strokeWidth={CONTORNO}
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M-92 4 C-104 -70 -60 -112 -6 -108 L6 -126 L22 -104 L40 -118 L46 -98 C86 -88 102 -48 92 4 C78 -36 40 -52 0 -48 C-40 -52 -76 -36 -92 4 Z"
          fill={cores.cabelo}
          stroke={cores.texto}
          strokeWidth={CONTORNO}
          strokeLinejoin="round"
        />
      )}
      <ellipse
        cx={-58}
        cy={42}
        rx={16}
        ry={10}
        fill={cores.bochecha}
        opacity={0.75}
      />
      <ellipse
        cx={58}
        cy={42}
        rx={16}
        ry={10}
        fill={cores.bochecha}
        opacity={0.75}
      />
      {sobrancelha(-1)}
      {sobrancelha(1)}
      {olho(-1)}
      {olho(1)}
      <path
        d="M-6 32 Q0 38 6 32"
        stroke={cores.peleSombra}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      {boca()}
    </g>
  );
};
