import React from "react";
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores, fonte } from "../../../brincario/tema";
import { entrada, marcos, quando, salto } from "../dados";

// ROTEIRO.md, cena 5: "ela precisa de algo concreto para fazer com essa energia."
// Raios de energia girando em volta da capivara; pílula "algo concreto pra fazer"
// (a caixa de presente chega boiando — ver Barco.tsx).

const Raio: React.FC<{ cor: string }> = ({ cor }) => (
  <path
    d="M-10 -40 L14 -8 L0 -6 L12 36 L-14 2 L0 0 Z"
    fill={cor}
    stroke={cores.texto}
    strokeWidth={5}
    strokeLinejoin="round"
  />
);

export const CenaEnergia: React.FC = () => {
  const frame = useCurrentFrame();
  const tEla = quando("ela", quando("funciona"));
  const tConcreto = quando("concreto");
  const tEnergia = quando("energia");
  const tFim = marcos.virada - 0.05;

  const ePilula = salto(frame, tConcreto);
  const eRaios = entrada(frame, tEla);
  const forte = entrada(frame, tEnergia);
  const paleta = [
    cores.amarelo,
    cores.terracota,
    cores.rosa,
    cores.azul,
    cores.lilas,
    cores.amarelo,
  ];

  return (
    <Cena inicio={tEla} fim={tFim}>
      <svg
        width={1080}
        height={900}
        viewBox="0 0 1080 900"
        style={{ position: "absolute" }}
      >
        {paleta.map((cor, i) => {
          const ang =
            frame / (10 - 4 * forte) + (i * Math.PI * 2) / paleta.length;
          const raio = 230 + 20 * Math.sin(frame / 4 + i);
          const x = 540 + Math.cos(ang) * raio;
          const y = 700 + Math.sin(ang) * raio * 0.45;
          return (
            <g
              key={i}
              transform={`translate(${x} ${y}) scale(${(0.8 + 0.6 * forte) * eRaios}) rotate(${ang * 30})`}
            >
              <Raio cor={cor} />
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          top: 300,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            padding: "16px 36px",
            borderRadius: 40,
            background: cores.cremeClaro,
            border: `6px solid ${cores.texto}`,
            boxShadow: `0 8px 0 ${cores.texto}`,
            fontFamily: fonte,
            fontWeight: 900,
            fontSize: 46,
            color: cores.texto,
            opacity: Math.min(1, ePilula * 1.5),
            transform: `scale(${0.6 + 0.4 * ePilula})`,
          }}
        >
          algo <span style={{ color: cores.terracota }}>concreto</span> para
          fazer
        </div>
      </div>
    </Cena>
  );
};
