import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores, fonte, fps } from "../../../brincario/tema";
import { entrada, quando } from "../dados";

// ROTEIRO.md, cenas 4–5: "Muitas crianças precisam do toque..." até "...desacelerar."
// Mão à esquerda, perfil de cabeça à direita; pontinhos terracota viajam dos dedos à cabeça.
// Embaixo, a barra "agitação" começa cheia e desce até a metade em "desacelerar".

const MAO = { x: 150, y: 440 };
const CABECA = { x: 650, y: 330, escala: 0.85 };
const ALVO = {
  x: CABECA.x + 150 * CABECA.escala,
  y: CABECA.y + 150 * CABECA.escala,
};
const PONTAS = [
  { x: 240, y: 23 },
  { x: 255, y: 59 },
  { x: 240, y: 95 },
  { x: 215, y: 129 },
].map((p) => ({ x: MAO.x + p.x, y: MAO.y + p.y }));

const BARRA = { x: 240, y: 762, largura: 600, altura: 44 };

const limitar = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const bezier = (a: number, b: number, c: number, d: number, u: number) =>
  (1 - u) ** 3 * a +
  3 * (1 - u) ** 2 * u * b +
  3 * (1 - u) * u ** 2 * c +
  u ** 3 * d;

export const CenaToque: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;

  const tMuitas = quando("muitas");
  const tToque = quando("toque");
  const tMovimento = quando("movimento");
  const tOrganizar = quando("organizar");
  const tSentindo = quando("sentindo");
  const tQuando = quando("quando", tSentindo);
  const tEstimulo = quando("estimulo");
  const tDesacelerar = quando("desacelerar");
  const tFim = quando("estrela", tDesacelerar) - 0.15;

  // Entradas
  const eIlustracao = entrada(frame, tMuitas);
  const eBarra = entrada(frame, tQuando);

  // Mão balança em "movimento" (oscilação que se acalma)
  const sMov = t - tMovimento;
  const giroMao =
    sMov > 0
      ? 7 * Math.sin(2 * Math.PI * 2.5 * sMov) * Math.exp(-2.2 * sMov)
      : 0;

  // Velocidade dos pontinhos: normal após "toque", mais rápida no "estímulo", mais lenta ao "desacelerar"
  const velocidade = (s: number) =>
    interpolate(
      s,
      [tEstimulo - 0.2, tEstimulo + 0.4, tDesacelerar, tDesacelerar + 0.8],
      [1, 1.7, 1.7, 0.55],
      limitar,
    );
  let tempoPontos = 0;
  for (let q = Math.round(tToque * fps); q < frame; q++)
    tempoPontos += velocidade(q / fps) / fps;

  const PERIODO = 1.5;
  const pontos: React.ReactNode[] = [];
  const totalPontos = 16;
  for (let k = 0; k < totalPontos; k++) {
    // Metade dos pontos só aparece a partir do "estímulo"
    const extra = k >= totalPontos / 2;
    const fase =
      (k % (totalPontos / 2)) / (totalPontos / 2) +
      (extra ? 0.5 / (totalPontos / 2) : 0);
    const bruto = tempoPontos / PERIODO - fase;
    if (frame < Math.round(tToque * fps) - 2 || bruto < 0) continue;
    const u = bruto % 1;
    const ponta = PONTAS[k % PONTAS.length];
    const desvio = ((k * 37) % 7) - 3;
    const x = bezier(
      ponta.x,
      ponta.x + 140,
      ALVO.x - 170,
      ALVO.x + desvio * 4,
      u,
    );
    const y = bezier(
      ponta.y,
      ponta.y - 170 - desvio * 10,
      ALVO.y - 160,
      ALVO.y + desvio * 5,
      u,
    );
    const ligaExtra = extra
      ? interpolate(t, [tEstimulo - 0.1, tEstimulo + 0.4], [0, 1], limitar)
      : 1;
    const opacidade = Math.sin(Math.PI * u) * ligaExtra;
    pontos.push(
      <circle
        key={k}
        cx={x}
        cy={y}
        r={extra ? 8 : 10}
        fill={cores.terracota}
        opacity={opacidade}
      />,
    );
  }

  // Rabisco na cabeça: embolado (agitado) -> onda calma entre "organizar" e "sentindo"
  const organizado = interpolate(t, [tOrganizar, tSentindo + 0.3], [0, 1], {
    ...limitar,
    easing: (x) => 1 - (1 - x) ** 3,
  });
  const pontosRabisco: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const s = i / 160;
    const giro = 2 * Math.PI * 6 * s + t * 5 * (1 - organizado);
    const raio = 24 * (1 - organizado);
    const x = 95 + 130 * s + raio * Math.cos(giro);
    const y =
      150 +
      raio * 1.15 * Math.sin(giro) +
      14 * organizado * Math.sin(2 * Math.PI * 2 * s);
    pontosRabisco.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const corRabisco = interpolateColors(
    organizado,
    [0, 1],
    [cores.terracota, cores.salviaEscura],
  );

  // Barra de agitação: cheia até "desacelerar", depois desce até a metade
  const desce = entrada(frame, tDesacelerar, { damping: 26, stiffness: 60 });
  const nivel = 1 - 0.5 * desce;
  // A cor só troca no fim da descida, para não passar por um tom acinzentado no meio
  const corBarra = interpolateColors(
    desce,
    [0.75, 1],
    [cores.terracota, cores.salvia],
  );

  return (
    <Cena inicio={tMuitas} fim={tFim}>
      <svg width={1080} height={900} viewBox="0 0 1080 900">
        {/* Rótulo da cena */}
        <text
          x={540}
          y={292}
          textAnchor="middle"
          fontFamily={fonte}
          fontWeight={700}
          fontSize={28}
          letterSpacing={3.4}
          fill={cores.branco}
          stroke={cores.texto}
          strokeWidth={8}
          paintOrder="stroke"
          strokeLinejoin="round"
          opacity={eIlustracao}
        >
          O QUE ACONTECE POR DENTRO
        </text>

        <g
          opacity={eIlustracao}
          transform={`translate(0 ${24 * (1 - eIlustracao)})`}
        >
          {/* Mão estilizada (gira a partir do punho) */}
          <g
            transform={`translate(${MAO.x} ${MAO.y}) rotate(${giroMao} -40 75)`}
          >
            <rect
              x={-110}
              y={28}
              width={130}
              height={94}
              rx={22}
              fill={cores.terracotaClara}
            />
            <rect
              x={0}
              y={0}
              width={160}
              height={150}
              rx={52}
              fill={cores.salvia}
            />
            <rect
              x={110}
              y={8}
              width={130}
              height={30}
              rx={15}
              fill={cores.salvia}
            />
            <rect
              x={110}
              y={44}
              width={145}
              height={30}
              rx={15}
              fill={cores.salvia}
            />
            <rect
              x={110}
              y={80}
              width={130}
              height={30}
              rx={15}
              fill={cores.salvia}
            />
            <rect
              x={110}
              y={114}
              width={105}
              height={30}
              rx={15}
              fill={cores.salvia}
            />
            <rect
              x={95}
              y={-62}
              width={30}
              height={92}
              rx={15}
              fill={cores.salvia}
              transform="rotate(32 110 30)"
            />
          </g>

          {/* Perfil de cabeça, virado para a mão */}
          <g
            transform={`translate(${CABECA.x} ${CABECA.y}) scale(${CABECA.escala})`}
          >
            <path
              d="M230 400 L230 330 C300 300 320 120 230 50 C170 0 60 0 30 80 L20 140 L-12 205 L22 218 L18 242 L28 252 L24 290 C30 322 62 332 112 326 L122 400 Z"
              fill={cores.cremeClaro}
              stroke={cores.salviaEscura}
              strokeWidth={7}
              strokeLinejoin="round"
            />
            <polyline
              points={pontosRabisco.join(" ")}
              fill="none"
              stroke={corRabisco}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {pontos}

        {/* Barra "agitação" */}
        <g opacity={eBarra} transform={`translate(0 ${24 * (1 - eBarra)})`}>
          <text
            x={BARRA.x}
            y={BARRA.y - 16}
            fontFamily={fonte}
            fontWeight={700}
            fontSize={28}
            letterSpacing={3.4}
            fill={cores.branco}
            stroke={cores.texto}
            strokeWidth={8}
            paintOrder="stroke"
            strokeLinejoin="round"
          >
            AGITAÇÃO
          </text>
          <rect
            x={BARRA.x}
            y={BARRA.y}
            width={BARRA.largura}
            height={BARRA.altura}
            rx={BARRA.altura / 2}
            fill={cores.cremeClaro}
            stroke={cores.salvia}
            strokeWidth={4}
          />
          <rect
            x={BARRA.x + 6}
            y={BARRA.y + 6}
            width={(BARRA.largura - 12) * nivel}
            height={BARRA.altura - 12}
            rx={(BARRA.altura - 12) / 2}
            fill={corBarra}
          />
        </g>
      </svg>
    </Cena>
  );
};
