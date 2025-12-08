
from pathlib import Path
import json
from typing import Any

DATA = Path('data')
DATA.mkdir(parents=True, exist_ok=True)

CH_FILE = DATA / 'channels.json'
EPG_FILE = DATA / 'epg.json'


def load_json(path: Path, default: Any):
    if path.exists():
        try:
            return json.loads(path.read_text('utf-8'))
        except Exception:
            return default
    return default


def save_json(path: Path, data: Any):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
