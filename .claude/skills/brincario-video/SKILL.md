---
name: brincario-video
description: Monta vídeos verticais da Brincário (Reels, TikTok e anúncio de 15 s, 1080x1920) no projeto Remotion brincario-videos a partir de uma fala gravada, b-roll e foto do produto — transcreve palavra por palavra, corta pausas, planeja e anima ilustrações no painel de cima sincronizadas com a fala, legenda palavra por palavra, confere as zonas que o Instagram cobre e exporta. Use sempre que a usuária pedir um vídeo novo de produto, um Reels com a fala dela, trocar a fala/broll/produto, transcrever ou cortar silêncios de uma gravação, animar ou ajustar uma cena, mudar legendas ou exportar/renderizar um vídeo da Brincário, mesmo que não diga "Remotion", "skill" ou "modelo".
---

# Vídeos verticais da Brincário

Modelo para transformar **uma fala gravada + b-roll + foto do produto** num vídeo explicativo no
padrão da marca: painel de ilustração animada em cima, a fala num cartão arredondado embaixo,
legendas palavra por palavra. A identidade visual está em [ESTILO.md](ESTILO.md) — leia antes de
planejar ou desenhar qualquer cena. O primeiro vídeo feito com o modelo (Estrela Tátil) está
completo em `brincario-videos/src/videos/estrela/` e serve de exemplo vivo de cada etapa.

## Como trabalhar com a usuária

- **Uma etapa por vez, com confirmação.** Ela pediu explicitamente: antes de começar uma etapa nova,
  pare, resuma o que foi feito e pergunte se pode seguir. Dentro da etapa de cenas, uma cena por vez.
- **Mostre, não descreva.** Ao fim de cada etapa visual, renderize só o trecho em questão e envie o
  arquivo (SendUserFile, `display: render`). Antes de renderizar o vídeo, confira quadros soltos
  (`npx remotion still`) montados lado a lado com ffmpeg — é muito mais barato achar erro assim.
- **Linguagem simples**, em português, sem jargão de programação. Diga o que mudou do pedido e por quê
  (ex.: "a tesoura sumiria 0,4 s depois de aparecer, então mantive os ícones até 'brincadeira'").
- Ela costuma responder por voz: o ditado troca palavras ("Pode ser gay" = "pode seguir"). Interprete
  pelo contexto e diga como entendeu.
- **Antes de sobrescrever, olhe o destino.** O ambiente bloqueia `rm`; para tirar algo do caminho,
  mova para a pasta temporária da sessão. Os vídeos em `out/` ficam fora do git: envie-os à usuária.

## Mapa do projeto

```
Video-brincario/
├── brutos/fala.mp4 · broll/ · produto/      ← o que ela troca a cada vídeo
├── referencia/                              ← vídeo de referência da linguagem visual
└── brincario-videos/                        ← projeto Remotion (rode tudo daqui)
    ├── ESTILO.md → link para o ESTILO.md desta skill
    ├── scripts/
    │   ├── novo_video.py        preparar <slug> | cortar <slug>
    │   ├── transcrever.py       faster-whisper, tempo de cada palavra
    │   ├── propor_cortes.py     pausas > 0,3 s e repetições → cortes.json (só propõe)
    │   ├── aplicar_cortes.py    gera fala_cortada.mp4 (30 fps) + fala_cortada.json
    │   ├── recortar_produto.py  remove o fundo da foto (rembg) → PNG transparente
    │   ├── verificar_zonas.py   confere as faixas do Instagram em todos os quadros
    │   └── modelo_video/        esqueleto copiado para cada vídeo novo
    ├── src/brincario/           biblioteca reutilizável (ver "Biblioteca" abaixo)
    ├── src/videos/<slug>/       um vídeo: dados.ts, Video.tsx, Anuncio.tsx, ROTEIRO.md, cenas/
    └── public/videos/<slug>/    mídia do vídeo: fala_cortada.mp4, produto.png, broll/, json
```

## Ambiente (uma vez por sessão)

```bash
cd brincario-videos
npm install
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
```

- O `remotion.config.ts` já aponta para o Chromium local quando o Remotion não consegue baixar o navegador,
  e grava os quadros em PNG (assim o H.264 sai `yuv420p`, que o Instagram mostra com a cor certa).
- `requirements.txt` fixa `av<16` (versões novas quebram o faster-whisper 1.2.1). O rembg baixa um
  modelo de ~180 MB no primeiro recorte.
- Rode `npm`/`npx` **dentro de `brincario-videos/`** (rodar na raiz cria um `package.json` solto).
- Checagem rápida depois de mexer no código: `npx tsc --noEmit && npx eslint src`.

## Fluxo de um vídeo novo

Escolha um **slug** curto (ex.: `pulseira-sensorial`); a composição se chama pelo nome em PascalCase
(`PulseiraSensorial`, `PulseiraSensorialAnuncio15s`).

### 1. Preparar e transcrever

```bash
.venv/bin/python scripts/novo_video.py preparar <slug> --fala ../brutos/fala.mp4 --broll ../broll --produto ../produto/<foto>
```

Copia o b-roll, recorta o fundo do produto, transcreve, propõe os cortes, cria `src/videos/<slug>/` a
partir do modelo e registra as composições no `Root.tsx`. O esqueleto já renderiza (fala + legendas,
painel vazio).

Mostre o texto transcrito e **aponte as palavras duvidosas** — o Whisper erra nomes de produto e termos
técnicos ("tátil" → "Tati", "abotoar" → "a botar", "autorregulação" sem rr) e pontuação de pergunta.
Corrija em `public/videos/<slug>/transcricao.json` só o campo `texto`; ao juntar duas palavras numa,
mantenha o `inicio` da primeira e o `fim` da segunda; ao remover uma palavra que não existe, estenda o
`fim` da anterior. Se o texto vier muito ruim, rode de novo com `--modelo medium`.

### 2. Cortar silêncios

Mostre `cortes.json` como tabela (de, até, quanto tira, entre quais palavras) e a duração antes/depois.
Regras: pausas acima de 0,3 s, deixando 0,08 s de respiro de cada lado; em repetições fica a última
versão; destaque pausas no **meio** de uma frase (cortar deixa mais corrido, manter é mais natural).
Ajuste o JSON se ela pedir e só então:

```bash
.venv/bin/python scripts/novo_video.py cortar <slug>
```

### 3. Planejar as ilustrações (ainda sem construir)

Preencha `src/videos/<slug>/ROTEIRO.md` a partir de `fala_cortada.json` (tempos **já cortados**): uma
linha por frase com tempo, frase, visual do painel e animação, e a palavra que dispara cada elemento.
Use o vocabulário do ESTILO.md §2.5 (número que conta, ícones em círculos com setas, linha de chamada
com rótulo, barra/medidor, selos, b-roll em moldura, foto do produto, cartão final) e a estrutura §2.7
(gancho → autoridade → explicação → produto → cartão final). Para escolher trechos de b-roll, monte uma
folha de contato e veja os quadros:

```bash
ffmpeg -i public/videos/<slug>/broll/<arquivo> -vf "fps=1,scale=180:-1,tile=8x3" <pasta-temporária>/folha.png
```

Pontos que costumam aparecer:
- Palavras ditas muito rápido (~0,5 s cada, ex.: "coroa, pulseira, estrela do mar") não comportam um
  trecho de b-roll cada: ponha os trechos **lado a lado**, entrando um por palavra e seguindo até a
  próxima frase.
- Se um elemento entra perto do fim da frase, estenda a cena até a frase seguinte para ele não "piscar".
- Se ela citar uma expressão que não está na fala, avise e proponha onde usar.
- Foto do produto com fundo: o `preparar` já gera `produto.png` recortado; confira sobre o creme.

### 4. Layout base

O esqueleto já tem o layout. Renderize os 5 primeiros segundos e confira o enquadramento do rosto.
Se o rosto ficar alto ou baixo, ajuste `recorteY` no `Video.tsx` (0% = topo do vídeo). A legenda fica
no alto do cartão (y≈1010) para não cobrir a boca e ficar fora das faixas do Instagram.

```bash
npx remotion render <Nome> out/<slug>_0-5s.mp4 --frames=0-149
```

### 5. Construir cena por cena

Cada cena é um componente em `src/videos/<slug>/cenas/`, incluído no `Video.tsx` na ordem do vídeo.
Receita (veja as cenas da Estrela para exemplos completos — mão/cabeça com partículas e barra em
`CenaToque`, pinça com linha de chamada em `CenaPinca`, ícones em `CenaIcones`, fluxo com setas em
`CenaAutorregulacao`, b-roll em `CenaBroll`, selos em `CenaProduto`):

```tsx
import { useCurrentFrame } from "remotion";
import { Cena } from "../../../brincario/Cena";
import { cores, fonte } from "../../../brincario/tema";
import { entrada, quando, salto } from "../dados";

export const CenaExemplo: React.FC = () => {
  const frame = useCurrentFrame();
  const tInicio = quando("muitas");               // 1ª ocorrência (sem acento/maiúscula/pontuação)
  const tToque = quando("toque", tInicio);        // procura a partir de tInicio
  const tFim = quando("estrela", tToque) - 0.15;  // até logo antes da próxima frase
  const e = entrada(frame, tToque);               // 0→1 com mola suave, 2 quadros antes da palavra
  return (
    <Cena inicio={tInicio} fim={tFim}>
      {/* SVG/HTML em coordenadas do painel: 1080 x 900; texto só entre y=250 e y=860 */}
    </Cena>
  );
};
```

- Tempos **sempre** via `quando(...)`, nunca números fixos: se a fala mudar, a cena acompanha.
- Uma única cor de destaque (terracota) por quadro; elementos entram em sequência; nada de piscar.
- A primeira cena usa `<Cena ... semFadeEntrada>`: o quadro 0 vira a capa do Reels.
- Renderize só a cena: `--frames=<round(inicio*30)-2>-<round(fim*30)>`.

### 6. Ajustes pontuais

Mexa só no arquivo da cena pedida e confira com `git diff --stat` que nada mais mudou. Deixe o ajuste
legível (ex.: `const ATRASO = 0.4` em `CenaIcones` da Estrela). Se o trecho pedido para renderizar não
cobrir o efeito do ajuste, proponha um trecho maior.

### 7. Exportar e conferir

```bash
npx remotion render <Nome> out/<slug>_completo.mp4 --codec=h264
.venv/bin/python scripts/verificar_zonas.py <Nome>          # sai com erro se algo entrar nas faixas
```

`verificar_zonas.py` renderiza sem o vídeo da fala e procura qualquer coisa diferente do creme nos
250 px de cima e nos 400 px de baixo, quadro a quadro; informe também a faixa onde o conteúdo ficou.

**Versão de 15 s (450 quadros):** em `Anuncio.tsx`, defina `TRECHOS` em quadros do vídeo completo —
gancho + produto/benefício + cartão final, cortando nas pausas. Cada trecho começa em
`ceil(inicio_da_primeira_palavra * 30)` (antes disso aparece a legenda do trecho anterior); o último
pode passar do fim do vídeo para segurar o cartão final até fechar 15 s. Confira as emendas em quadros
soltos e renderize `<Nome>Anuncio15s`.

### 8. Entregar

Envie o vídeo completo, o de 15 s e uma imagem com as faixas do Instagram desenhadas (ffmpeg
`drawbox`). Faça commit do código, roteiro e mídia de `public/videos/<slug>/`; `out/` não vai para o git.

## Biblioteca (`src/brincario/`)

| Arquivo | Para quê |
|---|---|
| `tema.ts` | `cores`, `fonte` (Nunito embutida), `layout` (painel, cartão, legenda), `fps` |
| `tempo.ts` | `criarTempo(palavras)` → `quando`; `entrada`/`salto` (molas), `quadroDe` |
| `VideoBase.tsx` | fundo creme + cenas (`children`) + cartão da fala + legendas; props `guias`, `semVideo` |
| `Cena.tsx` | mostra o conteúdo do painel só entre `inicio` e `fim`, com fade curto |
| `Legendas.tsx` | até 3 palavras, quebra em pontuação/pausa, palavra falada em terracota |
| `CartaoFala.tsx` | vídeo da fala recortado no rosto, cantos de 48 px |
| `Anuncio.tsx` | emenda trechos do vídeo completo (versão curta) |
| `componentes/MolduraBroll` | b-roll em moldura arredondada com zoom lento (`trechoInicio` em s) |
| `componentes/FotoProduto` | produto recortado com saltinho, flutuação e sombra |
| `componentes/Selo` | pílula de benefício + ícones `IconeSom`, `IconeMochila`, `IconeLugar` |
| `componentes/CartaoFinal` | "Brincar também é **cuidar**", "Link na bio", @brincario.loja |

Quando uma cena nova se repetir entre vídeos, mova o desenho para `componentes/` em vez de copiar.
Depois de refatorar, confira que um vídeo já pronto não mudou: renderize quadros com
`npx remotion still` antes e depois e compare com `ffmpeg -lavfi psnr` (`inf` = idêntico). Compare
PNGs, não MP4: o codificador não gera os mesmos bits a cada renderização.
