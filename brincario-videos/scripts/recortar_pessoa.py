"""Recorta a pessoa do vídeo da fala (tira a parede/fundo) e gera um WebM com transparência.

Usa o Robust Video Matting (RVM, em ONNX), um modelo feito para recortar pessoas em vídeo: ele
lembra dos quadros anteriores, então cabelo e mãos não "piscam" de um quadro para o outro.
O modelo é baixado na primeira vez para ~/.cache/rvm/.

Uso:
  .venv/bin/python scripts/recortar_pessoa.py public/videos/<slug>/fala_cortada.mp4 \
      public/videos/<slug>/fala_recortada.webm
  (opcional) --modelo resnet50|mobilenetv3   --reducao 0.5   --ate 6 (s, só um trecho de teste)
             --cortar-topo 0.09 (fração de cima da imagem que nunca é pessoa: marca d'água etc.)
             --borda 0.025 (esmaece as laterais)

O WebM sai sem som, com o mesmo número de quadros e fps do original; o som continua vindo do .mp4.
"""
import argparse
import json
import subprocess
import urllib.request
from pathlib import Path

import numpy as np
import onnxruntime as ort

MODELOS = {
    "resnet50": "rvm_resnet50_fp32.onnx",
    "mobilenetv3": "rvm_mobilenetv3_fp32.onnx",
}
URL = "https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/{}"

parser = argparse.ArgumentParser()
parser.add_argument("entrada")
parser.add_argument("saida")
parser.add_argument("--modelo", choices=MODELOS, default="resnet50")
parser.add_argument("--reducao", type=float, default=0.5, help="downsample_ratio do RVM")
parser.add_argument("--ate", type=float, default=0, help="processa só os primeiros N segundos")
parser.add_argument("--cortar-topo", type=float, default=0.0)
parser.add_argument("--aquecimento", type=int, default=20, help="quadros para estabilizar o modelo")
parser.add_argument("--borda", type=float, default=0.025, help="esmaece as laterais (fração da largura)")
parser.add_argument("--crf", type=int, default=20)
args = parser.parse_args()

# Modelo
arquivo = Path.home() / ".cache" / "rvm" / MODELOS[args.modelo]
if not arquivo.exists():
    arquivo.parent.mkdir(parents=True, exist_ok=True)
    print("baixando", arquivo.name)
    urllib.request.urlretrieve(URL.format(arquivo.name), arquivo)
sessao = ort.InferenceSession(str(arquivo), providers=["CPUExecutionProvider"])

# Vídeo de entrada
info = json.loads(
    subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,r_frame_rate", "-of", "json", args.entrada],
        capture_output=True, text=True, check=True,
    ).stdout
)["streams"][0]
W, H = info["width"], info["height"]
fps = info["r_frame_rate"]
leitura = ["ffmpeg", "-v", "error", "-i", args.entrada]
if args.ate:
    leitura += ["-t", str(args.ate)]
leitor = subprocess.Popen(leitura + ["-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)

Path(args.saida).parent.mkdir(parents=True, exist_ok=True)
escritor = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}",
     "-r", fps, "-i", "-", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0",
     "-crf", str(args.crf), "-row-mt", "1", "-auto-alt-ref", "0", "-an", args.saida],
    stdin=subprocess.PIPE,
)

estado = [np.zeros([1, 1, 1, 1], dtype=np.float32)] * 4
reducao = np.array([args.reducao], dtype=np.float32)
topo = int(H * args.cortar_topo)
# Laterais esmaecidas: se um braço encostar na borda do vídeo original, some suave em vez de
# ser cortado por uma linha reta no meio da tela
lateral = np.ones(W, dtype=np.float32)
if args.borda > 0:
    largura_borda = max(1.0, W * args.borda)
    x = np.arange(W, dtype=np.float32)
    lateral = np.clip(np.minimum(x + 0.5, W - 0.5 - x) / largura_borda, 0, 1)


def ler_quadro():
    buf = leitor.stdout.read(W * H * 3)
    if len(buf) < W * H * 3:
        return None
    return np.frombuffer(buf, np.uint8).reshape(H, W, 3)


def recortar(quadro):
    global estado
    src = (quadro.astype(np.float32) / 255.0).transpose(2, 0, 1)[None]
    fgr, pha, *estado = sessao.run(
        None,
        {"src": src, "r1i": estado[0], "r2i": estado[1], "r3i": estado[2], "r4i": estado[3],
         "downsample_ratio": reducao},
    )
    alfa = pha[0, 0] * lateral[None, :]
    if topo:
        # Faixa de cima nunca é pessoa (ex.: marca d'água do teleprompter); transição suave
        rampa = np.clip((np.arange(H) - topo) / max(1, H * 0.04), 0, 1)[:, None]
        alfa = alfa * rampa
    cor = np.clip(fgr[0].transpose(1, 2, 0), 0, 1)
    rgba = np.dstack([cor, alfa]) * 255.0
    return np.clip(rgba + 0.5, 0, 255).astype(np.uint8)


# Aquecimento: o modelo melhora depois de ver alguns quadros; processa o começo uma vez
# sem gravar e recomeça do quadro 0 já "aquecido" (o quadro 0 é a capa do vídeo).
inicio = []
for _ in range(args.aquecimento):
    q = ler_quadro()
    if q is None:
        break
    inicio.append(q)
for q in inicio:
    recortar(q)

n = 0
for q in inicio:
    escritor.stdin.write(recortar(q).tobytes())
    n += 1
while (q := ler_quadro()) is not None:
    escritor.stdin.write(recortar(q).tobytes())
    n += 1
    if n % 150 == 0:
        print(f"{n} quadros", flush=True)

escritor.stdin.close()
escritor.wait()
leitor.wait()
print(f"{n} quadros recortados -> {args.saida}")
