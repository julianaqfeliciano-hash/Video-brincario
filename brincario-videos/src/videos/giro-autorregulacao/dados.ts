import transcricao from "../../../public/videos/giro-autorregulacao/fala_cortada.json";
import { criarTempo } from "../../brincario/tempo";

export { entrada, quadroDe, salto } from "../../brincario/tempo";

// Mídia do vídeo (em public/videos/giro-autorregulacao/)
const PASTA = "videos/giro-autorregulacao";
export const midia = {
  fala: `${PASTA}/fala_cortada.mp4`,
  produto: `${PASTA}/produto.png`, // Giro laranja e azul (principal)
  produtoVerde: `${PASTA}/produto-verde-dourado.png`,
  produtoAzul: `${PASTA}/produto-azul-verde.png`,
  // b-roll copiado para public/videos/giro-autorregulacao/broll/ — ex.: midia.broll("parque.mp4")
  broll: (arquivo: string) => `${PASTA}/broll/${arquivo}`,
};

export const duracaoFala = transcricao.duracao;
export const { palavras, quando } = criarTempo(transcricao.palavras);

// Momentos que mais de uma cena (e o barco) usam
export const marcos = {
  // O mar acalma quando a caixa abre e o Giro aparece ("O giro tem um movimento fluido...")
  virada: quando("giro"),
  apresentacao: { inicio: quando("eu"), fim: quando("quando") - 0.1 },
  caixaChega: quando("concreto"),
  olhos: { inicio: quando("olhos"), fim: quando("maos", quando("olhos")) },
  // Fim da dica: o "Com" de "Com o tempo..." — procurado depois de "...junto com o movimento."
  dica: {
    inicio: quando("dica"),
    fim: quando("com", quando("movimento", quando("respire"))),
  },
  final: quando("brincar"),
};
