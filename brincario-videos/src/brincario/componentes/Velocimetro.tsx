import React from "react";
import { cores, fonte } from "../tema";

/**
 * Velocímetro "adesivo" (meia-lua verde → amarelo → vermelho) com ponteiro.
 * `valor` 0 = calmo (verde) … 1 = acelerado (vermelho). Use dentro de um <svg>.
 */
export const Velocimetro: React.FC<{
  x: number;
  y: number; // centro do eixo do ponteiro
  raio?: number;
  valor: number;
  rotulo?: string;
  progresso?: number; // entrada 0→1
}> = ({ x, y, raio = 130, valor, rotulo = "AGITAÇÃO", progresso = 1 }) => {
  const arco = (de: number, ate: number) => {
    const p = (a: number) => {
      const ang = Math.PI * (1 - a); // 0 → esquerda, 1 → direita
      return `${(raio * Math.cos(ang)).toFixed(1)} ${(-raio * Math.sin(ang)).toFixed(1)}`;
    };
    return `M${p(de)} A${raio} ${raio} 0 0 1 ${p(ate)}`;
  };
  const angPonteiro = -90 + 180 * Math.max(0, Math.min(1, valor));
  return (
    <g
      transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * progresso})`}
      opacity={Math.min(1, progresso * 1.5)}
    >
      <path
        d={`M${-raio - 34} 26 A${raio + 34} ${raio + 34} 0 0 1 ${raio + 34} 26 Z`}
        fill={cores.texto}
        transform="translate(0 9)"
      />
      <path
        d={`M${-raio - 34} 26 A${raio + 34} ${raio + 34} 0 0 1 ${raio + 34} 26 Z`}
        fill={cores.cremeClaro}
        stroke={cores.texto}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      <g fill="none" strokeWidth={30} strokeLinecap="round">
        <path d={arco(0.03, 0.33)} stroke={cores.salvia} />
        <path d={arco(0.36, 0.64)} stroke={cores.amarelo} />
        <path d={arco(0.67, 0.97)} stroke={cores.terracota} />
      </g>
      <g transform={`rotate(${angPonteiro})`}>
        <path
          d={`M-9 0 L0 ${-raio + 26} L9 0 Z`}
          fill={cores.texto}
          stroke={cores.texto}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      </g>
      <circle r={16} fill={cores.texto} />
      <text
        y={66}
        textAnchor="middle"
        fontFamily={fonte}
        fontWeight={900}
        fontSize={30}
        letterSpacing={3}
        fill={cores.branco}
        stroke={cores.texto}
        strokeWidth={8}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {rotulo}
      </text>
    </g>
  );
};
