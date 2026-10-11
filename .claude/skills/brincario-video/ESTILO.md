# ESTILO — vídeos verticais da Brincário

Padrão visual dos vídeos explicativos da Brincário (Reels/TikTok/anúncios, 1080x1920, 30 fps).
Derivado da análise de `referencia/exemplo.mp4` (1 quadro por segundo, 115 quadros): copiamos a
**linguagem visual** — divisão da tela, ritmo, como as coisas entram — e não os elementos daquele
vídeo (fundo escuro, laranja, prédios, músculos, logotipo do TikTok etc.).

Público: pais e mães (e terapeutas) de crianças pequenas. Tom: acolhedor, calmo, seguro, nunca
alarmista. O vídeo deve parecer uma conversa com uma especialista, não uma propaganda gritada.

---

## 1. O que a referência faz (análise)

| Aspecto | Observado na referência |
|---|---|
| Divisão da tela | Painel de ilustração em cima (~47% da altura) e apresentador embaixo, num cartão com cantos arredondados (~53%). O cartão tem margem lateral de ~7% e margem inferior pequena. |
| Abertura de bloco | Cada bloco novo começa com o apresentador em **tela cheia** e um título curto no topo ("Se eu fosse um CORRETOR"). Em 1–2 s o vídeo encolhe para o cartão de baixo e o painel aparece. |
| Painel | Fundo liso com a cor do tema, uma ideia por vez e muito espaço vazio. Os elementos se repetem: rótulo pequeno em versalete ("RESIDENCIAL", "EFEITO DO BOTOX", "ANTES"/"HOJE"), **número grande** com unidade pequena (07 → 17 andares, 3 dias, 35 g, 72 m²), ilustração com **linhas de chamada** e rótulos, gráficos que se desenham, fluxo de ícones em círculos com setas ("você fala → a IA desenha → todos entendem") e uma pílula discreta "conteúdo ilustrativo". |
| Legendas | Sobre o vídeo do apresentador, centralizadas, um pouco abaixo do rosto. Letra sem serifa muito grossa, branca, com sombra escura suave e sem caixa de fundo. As palavras aparecem **uma a uma** e se acumulam até 2 ou 3 palavras; o grupo some na pausa ou na pontuação. Mantém a caixa da fala (minúsculas) e a pontuação. |
| Tipografia do painel | Títulos grossos. Números enormes, cerca de 3 vezes o tamanho do título, com a unidade bem menor ao lado. Rótulos pequenos em versalete com letras espaçadas. Destaque de **uma** palavra por cor ("Botox **relaxa** o músculo", "ganha mais **atenção.**"). |
| Entradas | Tudo entra **no instante da palavra falada**. O texto surge com fade e uma leve subida (~0,2–0,3 s). Números **contam** até o valor. Ícones e selos entram com um pequeno salto de escala (mola). Gráficos e linhas **se desenham**. Os elementos entram em sequência, nunca todos juntos. O "✓" aparece com um pop. |
| Saídas e transições | Dentro de um bloco, o painel **evolui**: elementos se somam, um cede lugar ao próximo com fade ou deslize curto e o fundo permanece. Entre blocos há **corte seco**. A legenda nunca tem transição chamativa. |
| Ritmo | ~115 s no total, com cortes de bloco aos 41, 68, 80, 94 e 111 s (blocos de 12–27 s). Dentro do bloco, algo muda no painel **a cada 1,5–3 s**. Não há tempo morto: as pausas são cortadas. |
| Fechamento | Chamada para ação desenhada como interface (caixa de comentário, botão), depois um cartão final limpo com a marca e o @. |

---

## 2. Adaptação para a Brincário

### 2.1 Paleta (versão "viva", aprovada depois do 1º vídeo)

A primeira versão (sálvia/terracota apagados) ficou "sem emoção". A paleta atual mantém os nomes
dos tokens em `src/brincario/tema.ts`, com tons brilhantes:

| Token | Hex | Uso |
|---|---|---|
| `creme` | `#FFF3D6` | Fundo amanteigado (fundo da marca) |
| `cremeClaro` | `#FFFFFF` | Cartões, selos, balões ("adesivos") |
| `salvia` | `#2EC4A0` | Verde-menta: ilustrações, ícones, barra calma |
| `salviaEscura` | `#13836B` | Botões e detalhes |
| `terracota` | `#FF5E3A` | Coral vivo: **o destaque** (palavra falada, palavra-chave, número) |
| `terracotaClara` | `#FFB59E` | Fundos de destaque suaves |
| `texto` | `#2B2350` | Índigo escuro: texto e **contorno de tudo** |
| `amarelo` `lilas` `azul` `rosa` | `#FFC530` `#8E6CFF` `#3DA5FF` `#FF7AB8` | Apoio: confetes, insígnias, pontinhos, grifos |

Regras:
- Destaque de texto continua sendo **um** por quadro (coral); as cores de apoio vão em enfeites e ilustrações.
- **Estilo "adesivo"**: cartões, selos, círculos e balões brancos com contorno índigo de 5–7 px e
  sombra sólida deslocada para baixo (`0 7px 0 #2B2350`).
- Texto sobre cenário (céu, floresta) usa `textoClaro` (branco com contorno índigo de 8–10 px) —
  lê bem tanto no escuro quanto no claro.
- O vídeo da apresentadora não leva filtro de cor.

### 2.2 Tipografia

- Família: **Nunito** (arredondada, gratuita no Google Fonts, carregada com `@remotion/google-fonts/Nunito`).
  - Legendas: Nunito **Black (900)**.
  - Títulos do painel: Nunito **ExtraBold (800)**.
  - Números grandes: Nunito **Black (900)** com algarismos tabulares, para não "pular" durante a contagem.
  - Rótulos pequenos: Nunito **Bold (700)**, versalete, espaçamento entre letras de 0,12 em.
- Tamanhos de referência (em 1080x1920):
  - legenda: 64 px
  - título do painel: 64–72 px
  - número grande: 200–240 px, com a unidade a ~35% do tamanho do número
  - rótulo: 28 px
  - selo: 40 px
- Frases curtas, em linguagem de mãe e pai: "Cabe na mochila", não "Dimensões compactas".

### 2.3 Layout (1080x1920)

```
y=0     ┌──────────────────────────────┐
        │  (zona coberta pelo Instagram)│  0–250 px: só fundo e ilustração, sem texto
y=250   │                              │
        │   PAINEL — fundo creme        │  conteúdo importante entre 250 e ~860 px
        │   ilustração / número / ícone │
y=900   ├──┬────────────────────────┬──┤
        │  │    legenda (y≈1010)    │  │  legenda sobre o vídeo, acima da cabeça
        │  │                        │  │  cartão da apresentadora
        │  │  vídeo da fala, rosto  │  │  x: 64 → 1016 (largura 952)
        │  │  centralizado          │  │  y: 900 → 1890 (altura 990)
        │  │                        │  │  cantos 48 px, sombra suave
y=1520  │  │· · · · · · · · · · · · │  │  1520–1920 px: interface do Instagram,
        │  │                        │  │  nada importante aqui (o rosto pode passar)
y=1890  │  └────────────────────────┘  │
y=1920  └──────────────────────────────┘
```

- O fundo creme ocupa a tela inteira, e o cartão do vídeo "flutua" sobre ele (sombra `0 20px 60px rgba(59,51,46,.18)`).
- **Pessoa recortada (preferida pela usuária a partir do vídeo do Giro):** em vez do cartão, a fala
  aparece sem a parede de fundo — só o corpo e a gesticulação, por cima do cenário (mar, floresta),
  no mesmo enquadramento do cartão e descendo até a borda de baixo, com sombra suave
  (`scripts/recortar_pessoa.py` + `VideoBase.recorte`).
- O vídeo é recortado (`object-fit: cover`) com o **rosto centralizado** no terço superior do cartão.
- A legenda fica centralizada horizontalmente em **y ≈ 1010**, no alto do cartão, sobre o fundo atrás da cabeça. Com o rosto grande no cartão, essa é a posição que não cobre a boca e fica fora das zonas do Instagram.
- Abertura (gancho): nos primeiros 1–2 s a apresentadora pode aparecer em tela cheia, com o título no painel sobreposto, e então "encolher" até o cartão (mola, ~0,6 s).

### 2.4 Legendas

- Palavra por palavra, usando os tempos de `transcricao.json`.
- **Máximo 3 palavras na tela.** Um grupo novo começa depois de pontuação, de pausa maior que 0,35 s ou ao chegar a 3 palavras.
- Palavra **sendo falada**: terracota (`#C8694A`), escala 1,08 com mola rápida. Palavras já ditas do grupo: brancas. Palavras ainda não ditas: **não aparecem**.
- Branco com contorno marrom fino (`texto`, 3 px) e sombra suave, sem caixa de fundo.
- A legenda mantém minúsculas e pontuação da fala. Nomes de produto com inicial maiúscula ("Estrela Tátil").

### 2.5 Ilustrações

- **Desenho animado com contorno índigo** (5–7 px, pontas redondas), cores chapadas e vivas,
  olhos com brilho, bochechas rosadas. Sem 3D e sem realismo.
- **Mascote: a capivara escoteira** (`componentes/Capivara.tsx`) é a protagonista de toda cena com
  personagem — não usar crianças. Corpo caramelo, focinho largo com nariz escuro, olhos fechados de
  felicidade, uniforme de escoteiro (boné cáqui com broche de estrela, lenço laranja, camisa cáqui,
  faixa de insígnias coloridas, bermuda). Expressões: `feliz`, `calma`, `agitada` (olhos abertos,
  sobrancelhas preocupadas, gotinha de suor), `surpresa`. Ela segura o produto com `segura`.
- Mãos que tocam o produto são **patinhas de capivara** (almofadinhas rosa nas pontas).
- **Cenário com história** (`componentes/Floresta.tsx` ou `componentes/Mar.tsx`): floresta triste e chuvosa (chuva, árvores
  secas, neblina, olhinhos no mato) até o produto aparecer; na virada (`virada`, em s) a chuva para,
  as nuvens abrem, nasce o sol e tudo fica verde e alegre. Na apresentação de quem fala, o fundo da
  marca cobre o cenário (`FundoMarca`). Relâmpago só como clarão dentro das nuvens, nunca a tela toda.
  No mar (vídeo do Giro), a capivara navega num barquinho o vídeo todo e o mar agitado vira pôr do sol.
- Vocabulário que substitui o da referência:
  - **número grande** que conta, para dados como "3 em cada 5" ou "2 mãos" ou "+5 usos";
  - **ícones em círculos** ligados por setas, para causa e efeito ("toque → acalma → foca");
  - **linhas de chamada** com rótulo para mostrar partes do produto ou do corpo (mão, dedos, "pinça");
  - **barras e medidores** que sobem ou descem ("agitação", "foco");
  - **selos** (pílulas brancas "adesivo" com ícone num círculo colorido) para benefícios;
  - **trechos de b-roll** em moldura arredondada, com zoom lento;
  - **foto do produto** recortada, flutuando ou nas patas da capivara;
  - **estalo** de estrelinhas coloridas (`Estalo`) nos momentos-chave.
- Pílula "imagem ilustrativa", pequena, no canto do painel, quando a ilustração representar um efeito e não uma promessa.
- Sempre bastante espaço vazio. Uma ideia por vez no painel.

### 2.6 Movimento (30 fps)

| Elemento | Animação |
|---|---|
| Texto do painel | fade + subida de 24 px, `spring({damping: 18, stiffness: 120})`, ~8 quadros |
| Ícone, selo, foto | escala 0,6 → 1 com leve passada (`damping: 12`), "saltinho" |
| Número grande | contagem de 0 até o valor em 12–18 quadros, com easing de saída |
| Linhas, setas, gráficos | desenho do traço (`strokeDashoffset`) em 10–15 quadros |
| Pontos/partículas | trajetórias curvas e suaves, sem piscar |
| Saída de elemento | fade + leve queda, 6 quadros, ou permanece se a cena continua |
| B-roll | zoom lento de 1,0 → 1,08 ao longo do trecho |
| Entre blocos | corte seco ou deslize curto do painel (8 quadros) |

- **Sincronização**: o elemento começa a entrar **2 quadros antes** do início da palavra que o nomeia, para que esteja visível quando ela é dita.
- Elementos em sequência, com intervalos de 3–5 quadros, nunca todos juntos.
- Nada de tremor, piscar rápido, *glitch* ou zoom brusco: o público inclui crianças sensíveis a estímulo, e o tom é de calma.

### 2.7 Ritmo e estrutura

1. **Gancho (0–3 s)**: pergunta ou dor dos pais, com título curto no painel e a apresentadora em destaque.
2. **Autoridade (3–6 s)**: nome e profissão em um rótulo ("Juliana · psicóloga infantil").
3. **Explicação (≈6–25 s)**: o porquê, com ilustrações que mudam a cada 1,5–3 s.
4. **Produto (≈25–38 s)**: produto e usos (b-roll), benefícios em selos.
5. **Fechamento (últimos 3–5 s)**: cartão com a frase da marca "Brincar também é cuidar", "Link na bio" e **@brincario.loja**.

- Pausas acima de 0,3 s cortadas. Quando uma frase se repete, fica a última versão.
- Duração-alvo: 30–45 s para orgânico; versão de 15 s (gancho + cartão final) para anúncio.

### 2.8 O que não fazer

- Não usar fundo escuro, laranja neon, logotipo de rede social nem elementos da referência.
- Não usar mais de 3 palavras na legenda nem blocos de texto no painel.
- Não colocar texto importante nos 250 px de cima nem nos 400 px de baixo.
- Não usar linguagem de urgência ou medo ("seu filho está em perigo"). Acolher e explicar.
