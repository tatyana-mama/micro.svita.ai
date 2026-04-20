#!/usr/bin/env python3
"""Stitch slide-NN-*.png into OSTEO-1_deck.pdf (25 pages, 3:4 portrait)."""
from pathlib import Path

from PIL import Image

HERE = Path(__file__).parent
OUT = HERE / "OSTEO-1_deck.pdf"


def main() -> None:
    slides = sorted(HERE.glob("slide-*.png"))
    if len(slides) < 25:
        raise SystemExit(f"expected 25 slides, found {len(slides)}")
    pages = []
    for slide in slides:
        img = Image.open(slide).convert("RGB")
        pages.append(img)
    first, rest = pages[0], pages[1:]
    first.save(
        OUT,
        save_all=True,
        append_images=rest,
        format="PDF",
        resolution=144.0,
    )
    size_mb = OUT.stat().st_size / 1024 / 1024
    print(f"✓ {OUT.name}  {len(slides)} pages  {size_mb:.1f} MB")


if __name__ == "__main__":
    main()
