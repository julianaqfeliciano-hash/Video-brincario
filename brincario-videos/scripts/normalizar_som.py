"""Ajusta o volume da voz do vídeo final para o padrão das redes (Reels/TikTok), sem mexer na imagem.

Mede o volume percebido (LUFS, norma EBU R128) em duas passadas e aplica um ganho único
(`loudnorm` linear), com teto de pico para não distorcer. O vídeo é copiado sem recompressão.

Uso:
  .venv/bin/python scripts/normalizar_som.py out/<slug>_completo.mp4 out/<slug>_final.mp4
  (opcional) --lufs -14  --pico -1.5
"""
import argparse
import json
import re
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument("entrada")
parser.add_argument("saida")
parser.add_argument("--lufs", type=float, default=-14.0, help="volume integrado alvo (LUFS)")
parser.add_argument("--pico", type=float, default=-1.5, help="pico máximo (dBTP)")
parser.add_argument("--faixa", type=float, default=11.0, help="faixa de variação (LRA)")
args = parser.parse_args()

alvo = f"I={args.lufs}:TP={args.pico}:LRA={args.faixa}"


def medir(arquivo: str) -> dict:
    log = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", arquivo, "-af", f"loudnorm={alvo}:print_format=json",
         "-f", "null", "-"],
        capture_output=True, text=True, check=True,
    ).stderr
    return json.loads(re.findall(r"\{[^{}]*\}", log)[-1])


m = medir(args.entrada)
filtro = (
    f"loudnorm={alvo}:measured_I={m['input_i']}:measured_TP={m['input_tp']}"
    f":measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}"
    f":offset={m['target_offset']}:linear=true"
)
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-i", args.entrada, "-map", "0:v", "-map", "0:a", "-c:v", "copy",
     "-af", filtro, "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",
     args.saida],
    check=True,
)
d = medir(args.saida)
print(f"volume: {float(m['input_i']):.1f} LUFS -> {float(d['input_i']):.1f} LUFS "
      f"(pico {float(d['input_tp']):.1f} dBTP) -> {args.saida}")
