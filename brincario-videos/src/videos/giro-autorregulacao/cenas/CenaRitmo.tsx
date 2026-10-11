import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { Velocimetro } from "../../../brincario/componentes/Velocimetro";
import { cores, fps } from "../../../brincario/tema";
import { entrada, quando, salto } from "../dados";
import { limitar, textoSvg } from "./estilo";

// ROTEIRO.md, cena 8: "as mãos sentem um ritmo e é um estímulo previsível que ajuda o corpo a
// desacelerar." — ondinhas de ritmo saindo das patas; o velocímetro volta e desce para o verde.

export const CenaRitmo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const tAs = quando("as", quando("olhos"));
  const tRitmo = quando("ritmo", tAs);
  const tPrevisivel = quando("previsivel", tRitmo);
  const tDesacelerar = quando("desacelerar", tPrevisivel);
  const tFim = quando("uma", tDesacelerar) - 0.05; // "Uma dica"

  const eGauge = salto(frame, tAs);
  const desce = entrada(frame, tDesacelerar, { damping: 22, stiffness: 50 });
  const valor = 0.85 - 0.7 * desce + Math.sin(frame * 1.5) * 0.03 * (1 - desce);
  const eRotulo = salto(frame, tPrevisivel);
  const ritmoLiga = interpolate(
    t,
    [tRitmo - 0.1, tRitmo + 0.2],
    [0, 1],
    limitar,
  );

  // Pulsos regulares ("tum-tum") saindo das patas, a cada 0,6 s
  const pulsos = [0, 1, 2].map((i) => {
    const fase = ((t - tRitmo) / 0.6 + i / 3) % 1;
    return { r: 40 + 150 * fase, o: (1 - fase) * ritmoLiga };
  });

  return (
    <Cena inicio={tAs} fim={tFim}>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        {t >= tRitmo - 0.1 &&
          pulsos.map((p, i) => (
            <ellipse
              key={i}
              cx={540}
              cy={716}
              rx={p.r * 1.3}
              ry={p.r * 0.55}
              fill="none"
              stroke={cores.branco}
              strokeWidth={8}
              opacity={p.o}
            />
          ))}
        <Velocimetro x={290} y={500} valor={valor} progresso={eGauge} />
        <g
          transform={`translate(790 430) scale(${0.5 + 0.5 * eRotulo})`}
          opacity={Math.min(1, eRotulo * 1.5)}
        >
          <rect
            x={-190}
            y={-62}
            width={380}
            height={124}
            rx={34}
            fill={cores.texto}
            transform="translate(0 9)"
          />
          <rect
            x={-190}
            y={-62}
            width={380}
            height={124}
            rx={34}
            fill={cores.cremeClaro}
            stroke={cores.texto}
            strokeWidth={7}
          />
          <text y={-6} {...textoSvg(40)} fill={cores.texto} stroke="none">
            estímulo
          </text>
          <text
            y={40}
            {...textoSvg(40)}
            fill={cores.salviaEscura}
            stroke="none"
          >
            previsível
          </text>
        </g>
      </svg>
    </Cena>
  );
};
