# brincario-videos

Edição de vídeos verticais (1080×1920, 9:16) da Brincário por código, com [Remotion](https://www.remotion.dev).

## Instalação (uma vez)

```bash
npm install
python3 -m venv .venv
.venv/bin/pip install faster-whisper     # Windows: .venv\Scripts\pip install faster-whisper
```

## Comandos

| O que fazer | Comando |
|---|---|
| Abrir o editor visual no navegador | `npm run dev` |
| Renderizar a composição de teste | `npm run render -- Teste out/teste.mp4` |
| Transcrever uma fala (tempo de cada palavra) | `npm run transcrever -- ../brutos/fala.mp4 public/legendas/fala.json` |

- As mídias usadas nos vídeos ficam em `public/` (ex.: `public/midia/`).
- Os vídeos renderizados vão para `out/` (não é enviado ao Git).
- A transcrição gera um JSON `{ duracao, palavras: [{ texto, inicio, fim }] }`, em segundos, para criar legendas animadas.
- Na primeira transcrição o faster-whisper baixa o modelo (`small`, ~460 MB) do huggingface.co.
