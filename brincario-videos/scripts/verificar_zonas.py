"""Confere se algum texto/elemento entra nas faixas que o Instagram cobre (ESTILO.md §2.3).

Renderiza a composição em meia resolução duas vezes — sem o vídeo da fala (prop semVideo) e só com
o cenário de fundo (prop soFundo) — e procura, quadro a quadro, pixels que diferem entre as duas
(ou seja: cenas, textos e legendas) nos 250 px de cima e nos 400 px de baixo. Funciona com fundo
liso ou com cenário animado (ex.: a floresta).

Uso:
  .venv/bin/python scripts/verificar_zonas.py Estrela
Sai com código 1 se encontrar algo nas faixas.
"""
import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument("composicao")
parser.add_argument("--topo", type=int, default=250)
parser.add_argument("--base", type=int, default=400)
args = parser.parse_args()

W, H = 540, 960  # meia resolução de 1080x1920
LIMIAR = 50  # sombras suaves ficam abaixo disso; texto e ilustração ficam bem acima

def renderizar(props: str, destino: Path):
    subprocess.run(
        ["npx", "remotion", "render", args.composicao, str(destino), "--props", props,
         "--muted", "--scale=0.5", "--log=error", "--image-format=png", "--codec=prores",
         "--prores-profile=4444"],
        check=True,
    )


def ler(video: Path):
    return subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", str(video), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
        stdout=subprocess.PIPE,
    )


with tempfile.TemporaryDirectory() as tmp:
    com_conteudo, so_fundo = Path(tmp) / "conteudo.mov", Path(tmp) / "fundo.mov"
    renderizar('{"semVideo":true}', com_conteudo)
    renderizar('{"semVideo":true,"soFundo":true}', so_fundo)
    p, q = ler(com_conteudo), ler(so_fundo)
    topo, base = args.topo // 2, (1920 - args.base) // 2
    problemas, faixa_conteudo, n = [], [H, 0], 0
    while True:
        buf, buf_fundo = p.stdout.read(W * H * 3), q.stdout.read(W * H * 3)
        if len(buf) < W * H * 3 or len(buf_fundo) < W * H * 3:
            break
        quadro = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.int16)
        fundo = np.frombuffer(buf_fundo, np.uint8).reshape(H, W, 3).astype(np.int16)
        tem = np.abs(quadro - fundo).max(axis=2) > LIMIAR
        linhas = np.nonzero(tem.any(axis=1))[0]
        if len(linhas):
            faixa_conteudo = [min(faixa_conteudo[0], linhas.min()), max(faixa_conteudo[1], linhas.max())]
        for nome, zona in (("cima", tem[:topo]), ("baixo", tem[base:])):
            if zona.sum() > 20:
                problemas.append((n, nome))
        n += 1

print(f"{n} quadros analisados")
print(f"conteúdo entre y={faixa_conteudo[0] * 2} e y={faixa_conteudo[1] * 2} (px em 1080x1920)")
if not problemas:
    print(f"OK: nada nos {args.topo} px de cima nem nos {args.base} px de baixo")
    sys.exit(0)
for nome in ("cima", "baixo"):
    quadros = [q for q, z in problemas if z == nome]
    if quadros:
        print(f"ATENÇÃO faixa de {nome}: {len(quadros)} quadros, de {quadros[0] / 30:.2f}s a {quadros[-1] / 30:.2f}s")
sys.exit(1)
