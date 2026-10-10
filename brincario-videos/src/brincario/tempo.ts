import { spring } from "remotion";
import { fps } from "./tema";

export type Palavra = { texto: string; inicio: number; fim: number };

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/**
 * Cria as funções de tempo de um vídeo a partir da transcrição cortada.
 * `quando("toque")` devolve o início (s) da primeira ocorrência da palavra (sem acento,
 * maiúscula ou pontuação); `quando("a", t)` procura só a partir de `t`.
 */
export const criarTempo = (palavras: Palavra[]) => {
  const quando = (palavra: string, depois = 0): number => {
    const alvo = normalizar(palavra);
    const p = palavras.find(
      (w) => w.inicio >= depois && normalizar(w.texto) === alvo,
    );
    if (!p)
      throw new Error(
        `Palavra "${palavra}" não encontrada depois de ${depois}s`,
      );
    return p.inicio;
  };
  return { palavras, quando };
};

/** Quadro em que um elemento deve começar a entrar: 2 quadros antes da palavra (ESTILO.md §2.6). */
export const quadroDe = (segundos: number) => Math.round(segundos * fps) - 2;

/** Progresso 0→1 de uma entrada com mola suave, começando no tempo dado (s). */
export const entrada = (
  frame: number,
  segundos: number,
  config = { damping: 18, stiffness: 120 },
) => spring({ frame: frame - quadroDe(segundos), fps, config });

/** Entrada com "saltinho" (passa um pouco do tamanho final). */
export const salto = (frame: number, segundos: number) =>
  entrada(frame, segundos, { damping: 12, stiffness: 140 });
