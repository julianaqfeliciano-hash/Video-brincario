import { spring } from "remotion";
import transcricao from "../../public/legendas/fala_cortada.json";
import { fps } from "./tema";

export const palavras = transcricao.palavras;

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/** Início (s) da primeira ocorrência de `palavra` a partir de `depois` (s). */
export const quando = (palavra: string, depois = 0): number => {
  const alvo = normalizar(palavra);
  const p = palavras.find((w) => w.inicio >= depois && normalizar(w.texto) === alvo);
  if (!p) throw new Error(`Palavra "${palavra}" não encontrada depois de ${depois}s`);
  return p.inicio;
};

/** Quadro em que um elemento deve começar a entrar: 2 quadros antes da palavra (ESTILO.md §2.6). */
export const quadroDe = (segundos: number) => Math.round(segundos * fps) - 2;

/** Progresso 0→1 de uma entrada com mola suave, começando no tempo dado (s). */
export const entrada = (frame: number, segundos: number, config = { damping: 18, stiffness: 120 }) =>
  spring({ frame: frame - quadroDe(segundos), fps, config });

/** Entrada com "saltinho" (passa um pouco do tamanho final). */
export const salto = (frame: number, segundos: number) =>
  entrada(frame, segundos, { damping: 12, stiffness: 140 });
