"""Aplica os cortes aprovados ao vídeo da fala e ajusta o tempo das palavras.

Uso:
  .venv/bin/python scripts/aplicar_cortes.py ../brutos/fala.mp4 public/transcricao.json public/cortes.json \
      public/midia/fala_cortada.mp4 public/legendas/fala_cortada.json

Gera um vídeo a 30 fps constantes (o Remotion trabalha melhor assim) e uma transcrição
com os tempos já na linha do tempo cortada.

Opcional:
  --velocidade 1.15     acelera fala e imagem (o tom de voz não muda) e ajusta os tempos das palavras
  --filtro "eq=..."     tratamento de imagem do ffmpeg (brilho, contraste, cor, nitidez)
"""
import argparse
import json
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("video")
parser.add_argument("transcricao")
parser.add_argument("cortes")
parser.add_argument("video_saida")
parser.add_argument("transcricao_saida")
parser.add_argument("--fps", type=int, default=30)
parser.add_argument("--velocidade", type=float, default=1.0)
parser.add_argument("--filtro", default="")
args = parser.parse_args()

dados = json.loads(Path(args.transcricao).read_text(encoding="utf-8"))
cortes = sorted(json.loads(Path(args.cortes).read_text(encoding="utf-8"))["cortes"], key=lambda c: c["inicio"])

# Trechos mantidos = tudo o que não está dentro de um corte
mantidos, t = [], 0.0
for c in cortes:
    if c["inicio"] > t:
        mantidos.append((t, c["inicio"]))
    t = max(t, c["fim"])
if dados["duracao"] - t > 0.01:
    mantidos.append((t, dados["duracao"]))

# Filtro: corta cada trecho de vídeo/áudio e emenda; micro-fade no áudio evita estalos
filtros, entradas = [], ""
for i, (a, b) in enumerate(mantidos):
    fade = min(0.01, (b - a) / 4)
    filtros.append(f"[0:v]trim=start={a}:end={b},setpts=PTS-STARTPTS[v{i}]")
    filtros.append(
        f"[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,"
        f"afade=t=in:d={fade},afade=t=out:st={b - a - fade:.3f}:d={fade}[a{i}]"
    )
    entradas += f"[v{i}][a{i}]"
filtros.append(f"{entradas}concat=n={len(mantidos)}:v=1:a=1[vc][ac]")
v = args.velocidade
tratamento = f",{args.filtro}" if args.filtro else ""
filtros.append(f"[vc]setpts=PTS/{v},fps={args.fps}{tratamento}[vo]")
filtros.append(f"[ac]atempo={v}[ao]")

Path(args.video_saida).parent.mkdir(parents=True, exist_ok=True)
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-i", args.video, "-filter_complex", ";".join(filtros),
     "-map", "[vo]", "-map", "[ao]", "-c:v", "libx264", "-crf", "16", "-preset", "medium",
     "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", args.video_saida],
    check=True,
)


def novo_tempo(x):
    """Converte um tempo do bruto para a linha do tempo cortada."""
    removido = sum(min(c["fim"], x) - c["inicio"] for c in cortes if c["inicio"] < x)
    return round((x - removido) / v, 3)


duracao = round(sum(b - a for a, b in mantidos) / v, 3)
palavras = [
    {"texto": w["texto"], "inicio": novo_tempo(w["inicio"]), "fim": novo_tempo(w["fim"])}
    for w in dados["palavras"]
]
Path(args.transcricao_saida).parent.mkdir(parents=True, exist_ok=True)
Path(args.transcricao_saida).write_text(
    json.dumps({"duracao": duracao, "palavras": palavras}, ensure_ascii=False, indent=2), encoding="utf-8"
)
print(f"{len(mantidos)} trechos mantidos, {duracao:.2f} s -> {args.video_saida}")
