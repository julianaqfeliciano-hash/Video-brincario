"""Remove o fundo da foto do produto e salva um PNG transparente, recortado no contorno.

Uso:
  .venv/bin/python scripts/recortar_produto.py ../produto/foto.webp public/videos/<slug>/produto.png
"""
import argparse
from pathlib import Path


def recortar(entrada: str, saida: str, modelo: str = "isnet-general-use") -> tuple[int, int]:
    from PIL import Image
    from rembg import new_session, remove

    imagem = Image.open(entrada).convert("RGB")
    recorte = remove(imagem, session=new_session(modelo), post_process_mask=True)
    recorte = recorte.crop(recorte.getbbox())
    Path(saida).parent.mkdir(parents=True, exist_ok=True)
    recorte.save(saida)
    return recorte.size


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("entrada")
    parser.add_argument("saida")
    parser.add_argument("--modelo", default="isnet-general-use")
    args = parser.parse_args()
    if Path(args.saida).exists():
        raise SystemExit(f"{args.saida} já existe; escolha outro nome ou apague antes.")
    print("recorte salvo:", args.saida, recortar(args.entrada, args.saida, args.modelo))
