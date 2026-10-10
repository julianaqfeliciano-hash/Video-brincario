import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Paleta e medidas do ESTILO.md (§2.1 e §2.3)
export const cores = {
  creme: "#F6EFE3",
  cremeClaro: "#FBF8F2",
  salvia: "#8FA98B",
  salviaEscura: "#5C7A5E",
  terracota: "#C8694A",
  terracotaClara: "#E8B39D",
  texto: "#3B332E",
  branco: "#FFFFFF",
};

export const fonte = "Nunito";

for (const peso of ["700", "800", "900"]) {
  loadFont({
    family: fonte,
    url: staticFile(`fonts/nunito-latin-${peso}-normal.woff2`),
    weight: peso,
  });
}

export const layout = {
  largura: 1080,
  altura: 1920,
  // Painel de ilustração (conteúdo importante só entre y=250 e y=860)
  painel: { y: 0, altura: 900, areaSeguraTopo: 250 },
  // Cartão com a fala
  cartao: { x: 64, y: 900, largura: 952, altura: 990, raio: 48 },
  // Linha de base da legenda, sobre o vídeo, acima da cabeça
  legendaY: 1010,
};

export const fps = 30;
