#!/usr/bin/env python3
"""Direct generator with 429-aware backoff for OSTEO 1 deck."""
import base64
import json
import subprocess
import sys
import time
from pathlib import Path
from urllib import error, request

PROJECT = "labs67"
LOCATION = "us-central1"
MODEL = "gemini-2.5-flash-image"


def token() -> str:
    return subprocess.check_output(
        ["gcloud", "auth", "application-default", "print-access-token"],
        env={"PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin"},
    ).decode().strip()


def generate(prompt: str, out: Path, aspect: str = "3:4") -> bool:
    url = (
        f"https://{LOCATION}-aiplatform.googleapis.com/v1/"
        f"projects/{PROJECT}/locations/{LOCATION}/"
        f"publishers/google/models/{MODEL}:generateContent"
    )
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "imageConfig": {"aspectRatio": aspect},
        },
    }
    req = request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {token()}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read())
    except error.HTTPError as e:
        body = e.read().decode()[:300]
        print(f"   HTTP {e.code}: {body[:200]}", file=sys.stderr)
        if e.code == 429:
            return False
        raise
    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    for part in parts:
        if "inlineData" in part and "data" in part["inlineData"]:
            out.write_bytes(base64.b64decode(part["inlineData"]["data"]))
            print(f"   ✓ {out.name}  ({out.stat().st_size // 1024} KB)")
            return True
    print(f"   ! no image in response: {json.dumps(data)[:300]}", file=sys.stderr)
    return False


def gen_with_retry(prompt: str, out: Path, tries: int = 6) -> None:
    wait = 20
    for i in range(1, tries + 1):
        if generate(prompt, out):
            return
        print(f"   sleeping {wait}s before retry {i+1}/{tries}", file=sys.stderr)
        time.sleep(wait)
        wait = min(wait * 2, 180)
    raise RuntimeError(f"gave up on {out.name} after {tries} tries")


if __name__ == "__main__":
    from gen_deck import SLIDES, p, slug  # reuse prompts
    here = Path(__file__).parent
    only = {int(x) for x in sys.argv[1:]}
    for n, theme, body in SLIDES:
        stem = slug(theme)
        out = here / f"slide-{n:02d}-{stem}.png"
        if only and n not in only:
            continue
        if out.exists() and not only:
            print(f"skip {out.name}")
            continue
        print(f"→ slide {n:02d} · {theme[:50]}")
        gen_with_retry(p(n, theme, body), out)
        time.sleep(15)
