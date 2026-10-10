"""Aplica os cortes aprovados ao vídeo da fala e ajusta o tempo das palavras.

Uso:
  .venv/bin/python scripts/aplicar_cortes.py ../brutos/fala.mp4 public/transcricao.json public/cortes.json \
      public/midia/fala_cortada.mp4 public/legendas/fala_cortada.json

Gera um vídeo a 30 fps constantes (o Remotion trabalha melhor assim) e uma transcrição
com os tempos já na linha do tempo cortada.

Opcional:
  --velocidade 1.15     acelera fala e imagem (o tom de voz não muda) e ajusta os tempos das palavras
  --filtro "eq=..."     tratamento de imagem do ffmpeg (brilho, contraste, cor, nitidez)
  --suave 0.1           fusão curta entre os trechos cortados (cortes menos abruptos)
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
parser.add_argument("--suave", type=float, default=0.0, help="fusão (s) entre os trechos, ex.: 0.1")
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

# Filtro: corta cada trecho de vídeo/áudio e emenda.
# Sem --suave: emenda seca (micro-fade no áudio evita estalos).
# Com --suave D: fusão de D segundos entre os trechos (imagem com dissolve, som com crossfade),
# que disfarça o "pulo" dos cortes; cada emenda encurta o vídeo em D.
D = args.suave
filtros = []
for i, (a, b) in enumerate(mantidos):
    if D > 0:
        filtros.append(
            f"[0:v]trim=start={a}:end={b},setpts=PTS-STARTPTS,fps={args.fps},settb=AVTB,format=yuv420p[v{i}]"
        )
        filtros.append(f"[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS[a{i}]")
    else:
        fade = min(0.01, (b - a) / 4)
        filtros.append(f"[0:v]trim=start={a}:end={b},setpts=PTS-STARTPTS[v{i}]")
        filtros.append(
            f"[0:a]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,"
            f"afade=t=in:d={fade},afade=t=out:st={b - a - fade:.3f}:d={fade}[a{i}]"
        )
if D > 0:
    cv, ca, fim_saida = "v0", "a0", mantidos[0][1] - mantidos[0][0]
    for k in range(1, len(mantidos)):
        a, b = mantidos[k]
        filtros.append(f"[{cv}][v{k}]xfade=transition=fade:duration={D}:offset={fim_saida - D:.4f}[xv{k}]")
        filtros.append(f"[{ca}][a{k}]acrossfade=d={D}:c1=tri:c2=tri[xa{k}]")
        cv, ca = f"xv{k}", f"xa{k}"
        fim_saida += (b - a) - D
    filtros.append(f"[{cv}]null[vc]")
    filtros.append(f"[{ca}]anull[ac]")
else:
    entradas = "".join(f"[v{i}][a{i}]" for i in range(len(mantidos)))
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


# Início de cada trecho no vídeo de saída (antes da velocidade), descontando as fusões
inicios_saida, acumulado = [], 0.0
for k, (a, b) in enumerate(mantidos):
    inicios_saida.append(acumulado)
    acumulado += (b - a) - (D if k < len(mantidos) - 1 else 0)


def novo_tempo(x):
    """Converte um tempo do bruto para a linha do tempo cortada (e acelerada)."""
    for k, (a, b) in enumerate(mantidos):
        if x <= b:
            return round((inicios_saida[k] + max(0.0, x - a)) / v, 3)
    a, b = mantidos[-1]
    return round((inicios_saida[-1] + (b - a)) / v, 3)


duracao = round(acumulado / v, 3)
palavras = [
    {"texto": w["texto"], "inicio": novo_tempo(w["inicio"]), "fim": novo_tempo(w["fim"])}
    for w in dados["palavras"]
]
Path(args.transcricao_saida).parent.mkdir(parents=True, exist_ok=True)
Path(args.transcricao_saida).write_text(
    json.dumps({"duracao": duracao, "palavras": palavras}, ensure_ascii=False, indent=2), encoding="utf-8"
)
print(f"{len(mantidos)} trechos mantidos, {duracao:.2f} s -> {args.video_saida}")
