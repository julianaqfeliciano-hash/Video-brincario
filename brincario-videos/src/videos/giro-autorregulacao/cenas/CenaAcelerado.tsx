import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { Estalo } from "../../../brincario/componentes/Enfeites";
import { Velocimetro } from "../../../brincario/componentes/Velocimetro";
import { cores, fonte } from "../../../brincario/tema";
import { entrada, marcos, quadroDe, quando, salto } from "../dados";
import { limitar } from "./estilo";

// ROTEIRO.md, cena 4: "Quando a criança está agitada e o corpo dela está acelerado e só pedir calma
// nem sempre funciona," — velocímetro no vermelho; balão "Calma!" estoura com um ✗ em "funciona".

export const CenaAcelerado: React.FC = () => {
  const frame = useCurrentFrame();
  const tInicio = marcos.apresentacao.fim + 0.1;
  const tAcelerado = quando("acelerado");
  const tCalma = quando("calma");
  const tFunciona = quando("funciona");
  const tFim = quando("ela", tFunciona) - 0.1;

  const eGauge = salto(frame, tInicio);
  const sobe = entrada(frame, tAcelerado, { damping: 14, stiffness: 120 });
  const treme = Math.sin(frame * 1.7) * 0.04 * sobe;
  const valor = 0.45 + 0.42 * sobe + treme;

  const eBalao = salto(frame, tCalma);
  const estoura = interpolate(
    frame,
    [quadroDe(tFunciona), quadroDe(tFunciona) + 6],
    [0, 1],
    limitar,
  );
  const eX = salto(frame, tFunciona);

  return (
    <Cena inicio={tInicio} fim={tFim}>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        <Velocimetro x={290} y={500} valor={valor} progresso={eGauge} />

        {/* Balão "Calma!" que estoura */}
        {eBalao > 0.001 && estoura < 1 && (
          <g
            transform={`translate(780 420) scale(${(0.5 + 0.5 * eBalao) * (1 + 0.35 * estoura)})`}
            opacity={(1 - estoura) * Math.min(1, eBalao * 1.5)}
          >
            <path
              d="M-20 70 L-50 120 L20 76 Z"
              fill={cores.branco}
              stroke={cores.texto}
              strokeWidth={6}
              strokeLinejoin="round"
            />
            <ellipse
              rx={170}
              ry={82}
              fill={cores.branco}
              stroke={cores.texto}
              strokeWidth={7}
            />
            <text
              textAnchor="middle"
              y={22}
              fontFamily={fonte}
              fontWeight={900}
              fontSize={64}
              fill={cores.salviaEscura}
            >
              Calma!
            </text>
          </g>
        )}
        {eX > 0.001 && (
          <g
            transform={`translate(780 420) scale(${0.5 + 0.5 * eX}) rotate(${(1 - eX) * -20})`}
            opacity={Math.min(1, eX * 1.5)}
          >
            <path
              d="M-70 -70 L70 70 M70 -70 L-70 70"
              stroke={cores.texto}
              strokeWidth={44}
              strokeLinecap="round"
            />
            <path
              d="M-70 -70 L70 70 M70 -70 L-70 70"
              stroke={cores.terracota}
              strokeWidth={28}
              strokeLinecap="round"
            />
          </g>
        )}
        <Estalo x={780} y={420} tempo={tFunciona} raio={200} />
      </svg>
    </Cena>
  );
};
