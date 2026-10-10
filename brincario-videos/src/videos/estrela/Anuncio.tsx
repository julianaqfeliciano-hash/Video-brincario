import React from "react";
import {
  Anuncio as AnuncioBase,
  duracaoTrechos,
  type Trecho,
} from "../../brincario/Anuncio";
import { fps } from "../../brincario/tema";
import { quando } from "./dados";
import { Video } from "./Video";

// Versão curta (15 s = 450 quadros) para anúncio: gancho + estrela + "silenciosa e cabe na mochila"
// + cartão final.
// Calculada pelas palavras: cada trecho começa no quadro da primeira palavra e termina antes da
// próxima frase; o último segura o cartão final até completar 15 s.
const TOTAL = 15 * fps;
const inicioEm = (t: number) => Math.ceil(t * fps);
const antesDe = (t: number) => Math.floor(t * fps) - 1;

const gancho: Trecho = { de: 0, ate: antesDe(quando("eu")) }; // "Seu filho... tem uma explicação."
const tEstrela = quando("a", quando("desacelerar"));
const estrela: Trecho = {
  de: inicioEm(tEstrela), // "A estrela tátil vira uma ferramenta de autorregulação."
  ate: antesDe(quando("a", quando("autorregulacao"))),
};
const tEla = quando("ela", quando("mar"));
const beneficios: Trecho = {
  de: inicioEm(tEla), // "ela é silenciosa e cabe na mochila."
  ate: antesDe(quando("escola", tEla)),
};
const deFinal = inicioEm(quando("brincar", tEla)); // "brincar também é cuidar... O link está na bio."
const final: Trecho = {
  de: deFinal,
  ate: deFinal + TOTAL - duracaoTrechos([gancho, estrela, beneficios]),
};
const TRECHOS: Trecho[] = [gancho, estrela, beneficios, final];

export const duracaoAnuncio = duracaoTrechos(TRECHOS);

export const Anuncio: React.FC = () => (
  <AnuncioBase Video={Video} trechos={TRECHOS} />
);
