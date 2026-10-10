import React from "react";
import {
  Anuncio as AnuncioBase,
  duracaoTrechos,
  type Trecho,
} from "../../brincario/Anuncio";
import { Video } from "./Video";

// Versão curta (15 s) para anúncio: gancho + estrela + benefícios + cartão final.
// Quadros do vídeo completo; cada trecho começa no quadro da primeira palavra.
const TRECHOS: Trecho[] = [
  { de: 0, ate: 101 }, // "Seu filho não para de mexer as mãos? Calma, isso tem explicação."
  { de: 397, ate: 480 }, // "A estrela tátil vira uma ferramenta de autorregulação."
  { de: 958, ate: 1224 }, // "É silenciosa... Brincar também é cuidar. O link está na bio." + cartão parado
];

export const duracaoAnuncio = duracaoTrechos(TRECHOS);

export const Anuncio: React.FC = () => (
  <AnuncioBase Video={Video} trechos={TRECHOS} />
);
