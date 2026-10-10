"""Transcreve um vídeo/áudio com faster-whisper e salva o tempo de cada palavra.

Uso:
  .venv/bin/python scripts/transcrever.py ../brutos/fala.mp4 public/legendas/fala.json
  (opcional) --modelo small|medium|large-v3   --idioma pt
"""
import argparse
import json
from pathlib import Path

from faster_whisper import WhisperModel

parser = argparse.ArgumentParser()
parser.add_argument("entrada")
parser.add_argument("saida")
parser.add_argument("--modelo", default="small")
parser.add_argument("--idioma", default="pt")
args = parser.parse_args()

model = WhisperModel(args.modelo, device="cpu", compute_type="int8")
segments, info = model.transcribe(
    args.entrada, language=args.idioma, word_timestamps=True, vad_filter=True
)

palavras = []
for seg in segments:
    for w in seg.words:
        palavras.append(
            {"texto": w.word.strip(), "inicio": round(w.start, 3), "fim": round(w.end, 3)}
        )

saida = Path(args.saida)
saida.parent.mkdir(parents=True, exist_ok=True)
saida.write_text(
    json.dumps({"duracao": round(info.duration, 3), "palavras": palavras}, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(f"{len(palavras)} palavras salvas em {saida}")
