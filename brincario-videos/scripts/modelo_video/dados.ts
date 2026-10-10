import transcricao from "../../../public/videos/__SLUG__/fala_cortada.json";
import { criarTempo } from "../../brincario/tempo";

export { entrada, quadroDe, salto } from "../../brincario/tempo";

// Mídia do vídeo (em public/videos/__SLUG__/)
const PASTA = "videos/__SLUG__";
export const midia = {
  fala: `${PASTA}/fala_cortada.mp4`,
  produto: `${PASTA}/produto.png`,
  // b-roll copiado para public/videos/__SLUG__/broll/ — ex.: midia.broll("parque.mp4")
  broll: (arquivo: string) => `${PASTA}/broll/${arquivo}`,
};

export const duracaoFala = transcricao.duracao;
export const { palavras, quando } = criarTempo(transcricao.palavras);
