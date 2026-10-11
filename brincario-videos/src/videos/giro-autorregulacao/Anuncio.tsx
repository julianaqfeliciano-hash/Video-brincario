import React from "react";
import {
  Anuncio as AnuncioBase,
  duracaoTrechos,
  type Trecho,
} from "../../brincario/Anuncio";
import { fps } from "../../brincario/tema";
import { marcos, quando } from "./dados";
import { Video } from "./Video";

// Versão curta (15 s = 450 quadros) para anúncio: gancho + virada com o Giro +
// "estou agitado, vou usar o Giro Flex. Isso é autorregulação." + cartão final.
// Calculada pelas palavras: cada trecho começa no quadro da primeira palavra e termina antes da
// próxima frase; o último segura o cartão final até completar 15 s.
const TOTAL = 15 * fps;
const inicioEm = (t: number) => Math.ceil(t * fps);
const antesDe = (t: number) => Math.floor(t * fps) - 1;

const gancho: Trecho = { de: 0, ate: antesDe(quando("olhe")) };
const tO = quando("o", quando("energia")); // "O giro tem um movimento fluido e contínuo."
const virada: Trecho = {
  de: inicioEm(tO),
  ate: antesDe(quando("enquanto", tO)),
};
const tEstou = quando("estou", marcos.dica.fim); // "estou agitado, vou usar o Giro Flex..."
const autorregulacao: Trecho = {
  de: inicioEm(tEstou),
  ate: antesDe(quando("ele", quando("autorregulacao", tEstou))),
};
const deFinal = inicioEm(marcos.final); // "Brincar também é cuidar... link da nossa bio."
const final: Trecho = {
  de: deFinal,
  ate: deFinal + TOTAL - duracaoTrechos([gancho, virada, autorregulacao]),
};
const TRECHOS: Trecho[] = [gancho, virada, autorregulacao, final];

export const duracaoAnuncio = duracaoTrechos(TRECHOS);

export const Anuncio: React.FC = () => (
  <AnuncioBase Video={Video} trechos={TRECHOS} />
);
