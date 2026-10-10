import React from "react";
import {
  Anuncio as AnuncioBase,
  duracaoTrechos,
  type Trecho,
} from "../../brincario/Anuncio";
import { Video } from "./Video";

// Versão curta (15 s = 450 quadros) para anúncio: gancho + produto + cartão final.
// Quadros do vídeo completo; cada trecho começa no quadro da primeira palavra e termina numa pausa.
// Provisório: os primeiros 15 s. Definir os trechos no passo de exportação.
const TRECHOS: Trecho[] = [{ de: 0, ate: 450 }];

export const duracaoAnuncio = duracaoTrechos(TRECHOS);

export const Anuncio: React.FC = () => (
  <AnuncioBase Video={Video} trechos={TRECHOS} />
);
