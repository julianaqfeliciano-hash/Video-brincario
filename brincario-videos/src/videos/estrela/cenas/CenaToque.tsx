import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { Capivara } from "../../../brincario/componentes/Capivara";
import { cores, fonte, fps } from "../../../brincario/tema";
import { entrada, quando } from "../dados";

// ROTEIRO.md, cenas 4–5: "Muitas crianças precisam do toque..." até "...desacelerar." (ainda na chuva)
// A capivara mexe as patinhas; pontinhos coloridos sobem das patas até um balão de pensamento,
// onde o rabisco embolado vira onda calma ("organizar o que estão sentindo"). A barra "agitação"
// começa cheia e desce até a metade em "desacelerar", quando a capivara se acalma.

const CAPIVARA = { x: 460, y: 600, escala: 0.95 };
// Patas na frente do peito (ombro -20°, cotovelo -60° → pata em (±41, 51) no desenho da capivara)
const PATAS = [-1, 1].map((l) => ({
  x: CAPIVARA.x + l * 41 * CAPIVARA.escala,
  y: CAPIVARA.y + 51 * CAPIVARA.escala,
}));
const BALAO = { x: 800, y: 420 };
const BARRA = { x: 240, y: 800, largura: 600, altura: 44 };
const CORES_PONTOS = [
  cores.terracota,
  cores.amarelo,
  cores.azul,
  cores.rosa,
  cores.lilas,
];

const limitar = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

const bezier = (a: number, b: number, c: number, d: number, u: number) =>
  (1 - u) ** 3 * a +
  3 * (1 - u) ** 2 * u * b +
  3 * (1 - u) * u ** 2 * c +
  u ** 3 * d;

const rotuloSvg = {
  fontFamily: fonte,
  fontWeight: 900,
  fontSize: 32,
  letterSpacing: 3.4,
  fill: cores.branco,
  stroke: cores.texto,
  strokeWidth: 8,
  paintOrder: "stroke",
  strokeLinejoin: "round",
} as const;

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
  const tFim = quando("a", tDesacelerar); // termina no "A" de "A estrela tátil"

  const eCena = entrada(frame, tMuitas);
  const eBalao = entrada(frame, tToque, { damping: 12, stiffness: 140 });
  const eBarra = entrada(frame, tQuando);
  const calma = entrada(frame, tDesacelerar, { damping: 26, stiffness: 60 });

  // Patinhas mexendo (mais em "movimento"), param ao desacelerar
  const sMov = t - tMovimento;
  const mexe =
    (1 - calma) *
    (Math.sin(t * 9) * 8 +
      (sMov > 0
        ? 14 * Math.sin(2 * Math.PI * 2.5 * sMov) * Math.exp(-1.5 * sMov)
        : 0));

  // Pontinhos: velocidade normal após "toque", mais rápida no "estímulo", lenta ao "desacelerar"
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

  const PERIODO = 1.4;
  const pontos: React.ReactNode[] = [];
  for (let k = 0; k < 16; k++) {
    const extra = k >= 8;
    const fase = (k % 8) / 8 + (extra ? 1 / 16 : 0);
    const bruto = tempoPontos / PERIODO - fase;
    if (frame < Math.round(tToque * fps) - 2 || bruto < 0) continue;
    const u = bruto % 1;
    const pata = PATAS[k % 2];
    const desvio = ((k * 37) % 7) - 3;
    const x = bezier(
      pata.x,
      pata.x - 60 + desvio * 10,
      BALAO.x - 160,
      BALAO.x + desvio * 6,
      u,
    );
    const y = bezier(
      pata.y,
      pata.y - 220,
      BALAO.y + 140,
      BALAO.y + desvio * 4,
      u,
    );
    const liga = extra
      ? interpolate(t, [tEstimulo - 0.1, tEstimulo + 0.4], [0, 1], limitar)
      : 1;
    pontos.push(
      <circle
        key={k}
        cx={x}
        cy={y}
        r={extra ? 9 : 11}
        fill={CORES_PONTOS[k % CORES_PONTOS.length]}
        stroke={cores.texto}
        strokeWidth={3}
        opacity={Math.sin(Math.PI * u) * liga}
      />,
    );
  }

  // Rabisco no balão: embolado -> onda calma
  const organizado = interpolate(t, [tOrganizar, tSentindo + 0.3], [0, 1], {
    ...limitar,
    easing: (x) => 1 - (1 - x) ** 3,
  });
  const rabisco: string[] = [];
  for (let i = 0; i <= 140; i++) {
    const s = i / 140;
    const giro = 2 * Math.PI * 5 * s + t * 5 * (1 - organizado);
    const raio = 20 * (1 - organizado);
    const x = BALAO.x - 60 + 120 * s + raio * Math.cos(giro);
    const y =
      BALAO.y +
      raio * 1.1 * Math.sin(giro) +
      13 * organizado * Math.sin(2 * Math.PI * 2 * s);
    rabisco.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const corRabisco = interpolateColors(
    organizado,
    [0, 1],
    [cores.terracota, cores.salvia],
  );

  const nivel = 1 - 0.5 * calma;
  const corBarra = interpolateColors(
    calma,
    [0.75, 1],
    [cores.terracota, cores.salvia],
  );

  return (
    <Cena inicio={tMuitas} fim={tFim}>
      <svg width={1080} height={900} viewBox="0 0 1080 900">
        <text
          x={540}
          y={300}
          textAnchor="middle"
          {...rotuloSvg}
          opacity={eCena}
        >
          O QUE ACONTECE POR DENTRO
        </text>

        <g opacity={eCena} transform={`translate(0 ${24 * (1 - eCena)})`}>
          <Capivara
            x={CAPIVARA.x}
            y={CAPIVARA.y}
            escala={CAPIVARA.escala}
            expressao={calma > 0.4 ? "calma" : "agitada"}
            bracoEsq={{ ombro: -20 + mexe, cotovelo: -60 }}
            bracoDir={{ ombro: -20 - mexe, cotovelo: -60 }}
          />
        </g>

        {/* Balão de pensamento */}
        <g
          opacity={Math.min(1, eBalao * 1.5)}
          transform={`translate(${BALAO.x} ${BALAO.y}) scale(${0.5 + 0.5 * eBalao}) translate(${-BALAO.x} ${-BALAO.y})`}
        >
          <circle
            cx={640}
            cy={520}
            r={12}
            fill={cores.branco}
            stroke={cores.texto}
            strokeWidth={5}
          />
          <circle
            cx={680}
            cy={488}
            r={18}
            fill={cores.branco}
            stroke={cores.texto}
            strokeWidth={5}
          />
          <g fill={cores.branco} stroke={cores.texto} strokeWidth={6}>
            <circle cx={BALAO.x - 70} cy={BALAO.y + 10} r={50} />
            <circle cx={BALAO.x - 20} cy={BALAO.y - 40} r={60} />
            <circle cx={BALAO.x + 50} cy={BALAO.y - 30} r={55} />
            <circle cx={BALAO.x + 80} cy={BALAO.y + 25} r={48} />
            <circle cx={BALAO.x + 10} cy={BALAO.y + 40} r={55} />
          </g>
          <g fill={cores.branco}>
            <circle cx={BALAO.x - 70} cy={BALAO.y + 10} r={47} />
            <circle cx={BALAO.x - 20} cy={BALAO.y - 40} r={57} />
            <circle cx={BALAO.x + 50} cy={BALAO.y - 30} r={52} />
            <circle cx={BALAO.x + 80} cy={BALAO.y + 25} r={45} />
            <circle cx={BALAO.x + 10} cy={BALAO.y + 40} r={52} />
            <ellipse cx={BALAO.x} cy={BALAO.y} rx={95} ry={55} />
          </g>
          <polyline
            points={rabisco.join(" ")}
            fill="none"
            stroke={corRabisco}
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {pontos}

        {/* Barra "agitação" */}
        <g opacity={eBarra} transform={`translate(0 ${24 * (1 - eBarra)})`}>
          <text x={BARRA.x} y={BARRA.y - 16} {...rotuloSvg} fontSize={28}>
            AGITAÇÃO
          </text>
          <rect
            x={BARRA.x}
            y={BARRA.y}
            width={BARRA.largura}
            height={BARRA.altura}
            rx={BARRA.altura / 2}
            fill={cores.branco}
            stroke={cores.texto}
            strokeWidth={5}
          />
          <rect
            x={BARRA.x + 7}
            y={BARRA.y + 7}
            width={(BARRA.largura - 14) * nivel}
            height={BARRA.altura - 14}
            rx={(BARRA.altura - 14) / 2}
            fill={corBarra}
          />
        </g>
      </svg>
    </Cena>
  );
};
