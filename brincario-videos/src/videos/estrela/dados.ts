import transcricao from "../../../public/videos/estrela/fala_cortada.json";
import { criarTempo } from "../../brincario/tempo";

export { entrada, quadroDe, salto } from "../../brincario/tempo";

// Mídia do vídeo (em public/videos/estrela/)
const PASTA = "videos/estrela";
export const midia = {
  fala: `${PASTA}/fala_cortada.mp4`,
  produto: `${PASTA}/produto.png`,
  broll: `${PASTA}/parque.mp4`,
};

export const duracaoFala = transcricao.duracao;
export const { palavras, quando } = criarTempo(transcricao.palavras);
