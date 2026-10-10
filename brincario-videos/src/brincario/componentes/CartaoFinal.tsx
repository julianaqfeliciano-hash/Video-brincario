import React from "react";
import { interpolateColors, useCurrentFrame } from "remotion";
import { Cena } from "../Cena";
import { cores, fonte } from "../tema";
import { entrada, salto } from "../tempo";

/**
 * Cartão final da marca (ESTILO.md §2.7): frase com uma palavra em terracota, botão e @.
 * Fica até o fim do vídeo. Os tempos (s) vêm de `quando(...)` do vídeo.
 */
export const CartaoFinal: React.FC<{
  inicio: number; // entra o cartão com a frase
  tDestaque: number; // a palavra de destaque fica terracota
  tBotao: number; // entra o botão
  tArroba: number; // entra o @
  pergunta?: string; // frase opcional acima do botão (ex.: "Quer ajudar seu filho?")
  tPergunta?: number;
  linha1?: string;
  antesDestaque?: string;
  destaque?: string;
  botao?: string;
  arroba?: string;
}> = ({
  inicio,
  tDestaque,
  tBotao,
  tArroba,
  linha1 = "Brincar também",
  antesDestaque = "é ",
  destaque = "cuidar",
  botao = "Link na bio",
  arroba = "@brincario.loja",
  pergunta,
  tPergunta,
}) => {
  const frame = useCurrentFrame();

  const eCartao = salto(frame, inicio);
  const eFrase = entrada(frame, inicio);
  const corDestaque = interpolateColors(
    entrada(frame, tDestaque),
    [0, 1],
    [cores.texto, cores.terracota],
  );
  const eBotao = salto(frame, tBotao);
  const eArroba = entrada(frame, tArroba);
  const ePergunta = tPergunta === undefined ? 0 : salto(frame, tPergunta);

  return (
    <Cena inicio={inicio} fim={9999}>
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 280,
          width: 900,
          height: 570,
          borderRadius: 56,
          background: cores.cremeClaro,
          border: `6px solid ${cores.texto}`,
          boxShadow: `0 12px 0 ${cores.texto}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: pergunta ? 26 : 40,
          fontFamily: fonte,
          opacity: Math.min(1, eCartao * 1.5),
          transform: `scale(${0.85 + 0.15 * eCartao})`,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 84,
            lineHeight: 1.08,
            textAlign: "center",
            color: cores.texto,
            opacity: eFrase,
            transform: `translateY(${24 * (1 - eFrase)}px)`,
          }}
        >
          {linha1}
          <br />
          {antesDestaque}
          <span style={{ color: corDestaque }}>{destaque}</span>
        </div>

        {pergunta && (
          <div
            style={{
              fontWeight: 900,
              fontSize: 50,
              color: cores.terracota,
              opacity: Math.min(1, ePergunta * 1.5),
              transform: `scale(${0.6 + 0.4 * ePergunta})`,
            }}
          >
            {pergunta}
          </div>
        )}

        <div
          style={{
            background: cores.salviaEscura,
            color: cores.branco,
            fontWeight: 900,
            fontSize: 48,
            padding: "18px 56px",
            borderRadius: 48,
            opacity: Math.min(1, eBotao * 1.5),
            transform: `scale(${0.6 + 0.4 * eBotao})`,
          }}
        >
          {botao}
        </div>

        <div
          style={{
            fontWeight: 800,
            fontSize: 44,
            color: cores.salviaEscura,
            opacity: eArroba,
            transform: `translateY(${20 * (1 - eArroba)}px)`,
          }}
        >
          {arroba}
        </div>
      </div>
    </Cena>
  );
};
