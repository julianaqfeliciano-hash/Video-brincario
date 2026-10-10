import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Paleta e medidas do ESTILO.md (§2.1 e §2.3) — versão "viva": mesmas funções de cor, tons mais brilhantes
export const cores = {
  creme: "#FFF3D6", // fundo amanteigado
  cremeClaro: "#FFFFFF", // cartões, selos e balões
  salvia: "#2EC4A0", // verde-menta (ilustrações, ícones)
  salviaEscura: "#13836B", // rótulos pequenos, linhas de chamada
  terracota: "#FF5E3A", // coral vivo: o destaque
  terracotaClara: "#FFB59E",
  texto: "#2B2350", // índigo escuro: texto e contorno dos desenhos
  branco: "#FFFFFF",
  // Cores de apoio (ilustrações, confetes, fundos de ícones)
  amarelo: "#FFC530",
  lilas: "#8E6CFF",
  azul: "#3DA5FF",
  rosa: "#FF7AB8",
  // Personagens
  pele: "#F9C9A5",
  peleSombra: "#EBA57E",
  cabelo: "#5A3524",
  bochecha: "#FF8FA3",
};

export const fonte = "Nunito";

// Texto branco com contorno índigo: legível sobre fundos escuros (ex.: floresta na chuva)
export const textoClaro = {
  color: "#FFFFFF",
  WebkitTextStroke: "10px #2B2350",
  paintOrder: "stroke fill",
} as const;

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
