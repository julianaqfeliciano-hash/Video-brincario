"""Propõe cortes de silêncio e de repetição para uma fala transcrita.

Uso:
  .venv/bin/python scripts/propor_cortes.py ../brutos/fala.mp4 public/transcricao.json public/cortes.json
  (opcional) --pausa 0.3  --folga 0.08  --ruido -25

- Mede os silêncios reais no áudio (ffmpeg silencedetect) e ajusta o tempo das palavras
  que o Whisper esticou por cima de uma pausa (o arquivo de transcrição é atualizado).
- Pausas maiores que --pausa viram corte, deixando --folga segundos de respiro de cada lado.
- Frases repetidas (3+ palavras iguais em sequência): corta a primeira versão, fica a última.
- Só escreve a proposta em cortes.json; nada é aplicado ao vídeo.
"""
import argparse
import json
import re
import subprocess
import unicodedata
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("video")
parser.add_argument("transcricao")
parser.add_argument("saida")
parser.add_argument("--pausa", type=float, default=0.3)
parser.add_argument("--folga", type=float, default=0.08)
parser.add_argument("--ruido", type=float, default=-25)
args = parser.parse_args()


def silencios(video, ruido):
    log = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", video, "-af", f"silencedetect=noise={ruido}dB:d=0.2", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    inicios = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", log)]
    fins = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", log)]
    return list(zip(inicios, fins))


def normalizar(t):
    t = unicodedata.normalize("NFD", t.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in t if unicodedata.category(c) != "Mn"))


dados = json.loads(Path(args.transcricao).read_text(encoding="utf-8"))
palavras = dados["palavras"]
sil = silencios(args.video, args.ruido)

# Ajusta palavras que atravessam um silêncio: ficam do lado onde passam mais tempo.
for w in palavras:
    for s0, s1 in sil:
        if w["fim"] <= s0 or w["inicio"] >= s1:
            continue
        antes, depois = max(0, s0 - w["inicio"]), max(0, w["fim"] - s1)
        if antes >= depois:
            w["fim"] = round(min(w["fim"], s0), 3)
        else:
            w["inicio"] = round(max(w["inicio"], s1), 3)

cortes = []

# Silêncio no início e no fim do arquivo
inicio_fala, fim_fala = palavras[0]["inicio"], palavras[-1]["fim"]
if inicio_fala - args.folga > 0.05:
    cortes.append({"inicio": 0.0, "fim": round(inicio_fala - args.folga, 3), "motivo": "silêncio no início"})
if dados["duracao"] - (fim_fala + args.folga) > 0.05:
    cortes.append({"inicio": round(fim_fala + args.folga, 3), "fim": dados["duracao"], "motivo": "silêncio no fim"})

# Pausas internas
for s0, s1 in sil:
    if s0 <= inicio_fala or s1 >= fim_fala or s1 - s0 <= args.pausa:
        continue
    antes = max((w for w in palavras if w["fim"] <= s0 + 0.01), key=lambda w: w["fim"])
    depois = min((w for w in palavras if w["inicio"] >= s1 - 0.01), key=lambda w: w["inicio"])
    cortes.append({
        "inicio": round(s0 + args.folga, 3),
        "fim": round(s1 - args.folga, 3),
        "motivo": f"pausa de {s1 - s0:.2f} s entre \"{antes['texto']}\" e \"{depois['texto']}\"",
    })

# Repetições: mesma sequência de 3+ palavras logo em seguida -> corta a primeira versão
norm = [normalizar(w["texto"]) for w in palavras]
i = 0
while i < len(norm):
    achou = False
    for n in range(8, 2, -1):
        for j in range(i + n, min(i + n + 6, len(norm) - n + 1)):
            if norm[i:i + n] == norm[j:j + n]:
                frase = " ".join(w["texto"] for w in palavras[i:j])
                cortes.append({
                    "inicio": palavras[i]["inicio"],
                    "fim": palavras[j]["inicio"],
                    "motivo": f"repetição: \"{frase}\" (fica a última versão)",
                })
                i, achou = j, True
                break
        if achou:
            break
    if not achou:
        i += 1

cortes.sort(key=lambda c: c["inicio"])
Path(args.transcricao).write_text(json.dumps(dados, ensure_ascii=False, indent=2), encoding="utf-8")
Path(args.saida).write_text(json.dumps({"cortes": cortes}, ensure_ascii=False, indent=2), encoding="utf-8")

total = sum(c["fim"] - c["inicio"] for c in cortes)
print(f"{'#':>2}  {'de':>6}  {'até':>6}  {'tira':>5}  motivo")
for k, c in enumerate(cortes, 1):
    print(f"{k:>2}  {c['inicio']:6.2f}  {c['fim']:6.2f}  {c['fim'] - c['inicio']:5.2f}  {c['motivo']}")
print(f"\nDuração: {dados['duracao']:.2f} s -> {dados['duracao'] - total:.2f} s (tira {total:.2f} s)")
