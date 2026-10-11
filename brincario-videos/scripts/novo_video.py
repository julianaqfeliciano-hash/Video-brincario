"""Prepara um vídeo novo da Brincário a partir do modelo (fala + b-roll + foto do produto).

Etapa 1 — preparar (transcreve e PROPÕE os cortes; não corta nada):
  .venv/bin/python scripts/novo_video.py preparar <slug> \
      --fala ../brutos/fala.mp4 --broll ../broll --produto ../produto/produto.png

  Cria public/videos/<slug>/ (b-roll copiado, produto.png recortado, transcricao_whisper.json,
  transcricao.json, cortes.json), src/videos/<slug>/ (esqueleto que já renderiza a fala com
  legendas) e registra as composições <Nome> e <Nome>Anuncio15s no src/Root.tsx.

Depois de corrigir o texto em transcricao.json e aprovar cortes.json com a pessoa:

Etapa 2 — cortar:
  .venv/bin/python scripts/novo_video.py cortar <slug>

  Gera fala_cortada.mp4 (30 fps) e fala_cortada.json (tempos na linha do tempo cortada).

Etapa opcional — recortar a pessoa (tirar a parede de fundo):
  .venv/bin/python scripts/novo_video.py recortar <slug>

  Gera fala_recortada.webm (com transparência). Depois, em src/videos/<slug>/dados.ts, preencha
  `midia.recorte` e passe `recorte={midia.recorte}` ao <VideoBase> no Video.tsx.
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

PROJETO = Path(__file__).resolve().parent.parent
PY = sys.executable
VIDEOS_BROLL = {".mp4", ".mov", ".m4v", ".webm"}
IMAGENS = {".png", ".jpg", ".jpeg", ".webp"}


def nome_de(slug: str) -> str:
    return "".join(parte.capitalize() for parte in slug.split("-"))


def pastas(slug: str):
    return PROJETO / "public" / "videos" / slug, PROJETO / "src" / "videos" / slug


def rodar(*cmd):
    print("$", " ".join(str(c) for c in cmd))
    subprocess.run([str(c) for c in cmd], check=True, cwd=PROJETO)


def escolher_produto(caminho: Path) -> Path:
    if caminho.is_file():
        return caminho
    fotos = sorted(p for p in caminho.iterdir() if p.suffix.lower() in IMAGENS)
    if len(fotos) == 1:
        return fotos[0]
    lista = "\n  ".join(str(f) for f in fotos) or "(nenhuma imagem)"
    raise SystemExit(f"Indique a foto com --produto <arquivo>. Encontradas em {caminho}:\n  {lista}")


def registrar_no_root(slug: str, nome: str):
    root = PROJETO / "src" / "Root.tsx"
    s = root.read_text(encoding="utf-8")
    if f'"./videos/{slug}"' in s:
        print("Root.tsx: já registrado")
        return
    marca_import = "// novo_video.py: importações"
    marca_comp = "{/* novo_video.py: composições */}"
    if marca_import not in s or marca_comp not in s:
        raise SystemExit("Root.tsx sem as marcas do novo_video.py; registre as composições à mão.")
    s = s.replace(marca_import, f'import * as {nome} from "./videos/{slug}";\n{marca_import}')
    comps = f"""<Composition
        id="{nome}"
        component={{{nome}.Video}}
        durationInFrames={{{nome}.duracaoVideo}}
        defaultProps={{{{ guias: false, semVideo: false }}}}
        {{...formato}}
      />
      <Composition
        id="{nome}Anuncio15s"
        component={{{nome}.Anuncio}}
        durationInFrames={{{nome}.duracaoAnuncio}}
        {{...formato}}
      />
      {marca_comp}"""
    s = s.replace(marca_comp, comps)
    root.write_text(s, encoding="utf-8")
    print(f"Root.tsx: composições {nome} e {nome}Anuncio15s registradas")


def preparar(a):
    slug = a.slug
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", slug):
        raise SystemExit("slug: só letras minúsculas, números e hífen (ex.: pulseira-sensorial)")
    nome = nome_de(slug)
    pub, src = pastas(slug)
    if pub.exists() or src.exists():
        raise SystemExit(f"Já existe um vídeo '{slug}' ({pub} / {src}). Escolha outro slug.")

    fala = Path(a.fala).resolve()
    if not fala.is_file():
        raise SystemExit(f"Fala não encontrada: {fala}")
    pub.mkdir(parents=True)

    # Origem dos brutos (o corte relê a fala original)
    (pub / "origem.json").write_text(
        json.dumps({"fala": str(fala)}, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # B-roll
    if a.broll:
        broll = Path(a.broll).resolve()
        arquivos = [broll] if broll.is_file() else sorted(p for p in broll.iterdir() if p.suffix.lower() in VIDEOS_BROLL)
        (pub / "broll").mkdir()
        for arq in arquivos:
            shutil.copy2(arq, pub / "broll" / arq.name)
            print("b-roll:", arq.name)

    # Produto (fundo removido)
    if a.produto:
        sys.path.insert(0, str(PROJETO / "scripts"))
        from recortar_produto import recortar

        foto = escolher_produto(Path(a.produto).resolve())
        print("produto:", foto.name, "->", recortar(str(foto), str(pub / "produto.png")))

    # Transcrição + proposta de cortes
    rodar(PY, "scripts/transcrever.py", fala, pub / "transcricao_whisper.json", "--modelo", a.modelo)
    shutil.copy2(pub / "transcricao_whisper.json", pub / "transcricao.json")
    rodar(PY, "scripts/propor_cortes.py", fala, pub / "transcricao.json", pub / "cortes.json")
    # Provisório até a etapa "cortar": deixa o código compilar com a fala ainda sem cortes
    shutil.copy2(pub / "transcricao.json", pub / "fala_cortada.json")

    # Esqueleto do vídeo
    modelo = PROJETO / "scripts" / "modelo_video"
    for arq in modelo.rglob("*"):
        destino = src / arq.relative_to(modelo)
        if arq.is_dir():
            destino.mkdir(parents=True, exist_ok=True)
            continue
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(
            arq.read_text(encoding="utf-8").replace("__SLUG__", slug).replace("__NOME__", nome), encoding="utf-8"
        )
    registrar_no_root(slug, nome)

    texto = " ".join(p["texto"] for p in json.loads((pub / "transcricao.json").read_text())["palavras"])
    print(f"\nPronto. Composições: {nome} e {nome}Anuncio15s\n\nTexto transcrito:\n{texto}")


def cortar(a):
    pub, _ = pastas(a.slug)
    origem = json.loads((pub / "origem.json").read_text(encoding="utf-8"))
    rodar(
        PY, "scripts/aplicar_cortes.py", origem["fala"], pub / "transcricao.json", pub / "cortes.json",
        pub / "fala_cortada.mp4", pub / "fala_cortada.json",
        "--velocidade", str(a.velocidade), *(["--filtro", a.filtro] if a.filtro else []),
        "--suave", str(a.suave),
    )


def recortar(a):
    pub, _ = pastas(a.slug)
    rodar(
        PY, "scripts/recortar_pessoa.py", pub / "fala_cortada.mp4", pub / "fala_recortada.webm",
        "--modelo", a.modelo, "--cortar-topo", str(a.cortar_topo),
    )
    largura, altura = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
         "-of", "csv=p=0", str(pub / "fala_cortada.mp4")],
        capture_output=True, text=True, check=True,
    ).stdout.strip().split(",")
    print(f"\nEm dados.ts: recorte: {{ video: `${{PASTA}}/fala_recortada.webm`, proporcao: {altura} / {largura} }}")


parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
sub = parser.add_subparsers(dest="etapa", required=True)
p = sub.add_parser("preparar")
p.add_argument("slug")
p.add_argument("--fala", default=str(PROJETO.parent / "brutos" / "fala.mp4"))
p.add_argument("--broll", default=str(PROJETO.parent / "broll"))
p.add_argument("--produto", default=str(PROJETO.parent / "produto"))
p.add_argument("--modelo", default="small", help="modelo do Whisper (small, medium, large-v3)")
p.set_defaults(func=preparar)
c = sub.add_parser("cortar")
c.add_argument("slug")
c.add_argument("--velocidade", type=float, default=1.0, help="ex.: 1.15 para fala lenta")
c.add_argument("--suave", type=float, default=0.1, help="fusão (s) entre trechos cortados; 0 = corte seco")
c.add_argument("--filtro", default="", help='tratamento de imagem, ex.: "eq=contrast=1.08:saturation=1.15"')
c.set_defaults(func=cortar)
r = sub.add_parser("recortar")
r.add_argument("slug")
r.add_argument("--modelo", choices=["resnet50", "mobilenetv3"], default="resnet50")
r.add_argument("--cortar-topo", type=float, default=0.09,
               help="fração de cima que nunca é pessoa (marca d'água do teleprompter); 0 desliga")
r.set_defaults(func=recortar)

args = parser.parse_args()
args.func(args)
