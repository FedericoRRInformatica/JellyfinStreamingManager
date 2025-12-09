
from pathlib import Path
import json
from typing import Any

DATA = Path('data')
DATA.mkdir(parents=True, exist_ok=True)

# generic JSON helpers

def load_json(path: Path, default: Any):
    if path.exists():
        try:
            return json.loads(path.read_text('utf-8'))
        except Exception:
            return default
    return default


def save_json(path: Path, data: Any):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')


# --- Settings helpers (stream profiles) ---
SETTINGS_FILE = DATA / 'settings.json'
DEFAULT_SETTINGS = {
    "brand": "JSManager",
    "port": 7373,
    "theme": None,
    "stream_profiles": [
        {"id": "redirect", "name": "Redirect", "type": "redirect", "active": True},
        {"id": "ffmpeg", "name": "ffmpeg", "type": "ffmpeg", "command": "ffmpeg", "parameters": "-user_agent {userAgent} -i {streamUrl} -c copy -f mpegts {output}", "userAgent": "Mozilla/5.0", "active": True}
    ]
}


def load_settings():
    return load_json(SETTINGS_FILE, DEFAULT_SETTINGS)


def save_settings(data):
    base = load_settings()
    # merge shallow for top-level keys; stream_profiles handled explicitly
    base.update({k: v for k, v in data.items() if k != 'stream_profiles'})
    if 'stream_profiles' in data and isinstance(data['stream_profiles'], list):
        base['stream_profiles'] = data['stream_profiles']
    save_json(SETTINGS_FILE, base)
    return base


def ensure_default_profiles(settings: dict):
    # Guarantee redirect + ffmpeg exist
    profiles = settings.get('stream_profiles') or []
    ids = {p.get('id') for p in profiles if isinstance(p, dict)}
    changed = False
    if 'redirect' not in ids:
        profiles.insert(0, {"id": "redirect", "name": "Redirect", "type": "redirect", "active": True})
        changed = True
    if 'ffmpeg' not in ids:
        profiles.append({
            "id": "ffmpeg", "name": "ffmpeg", "type": "ffmpeg", "command": "ffmpeg",
            "parameters": "-user_agent {userAgent} -i {streamUrl} -c copy -f mpegts {output}",
            "userAgent": "Mozilla/5.0", "active": True
        })
        changed = True
    if changed:
        settings['stream_profiles'] = profiles
        save_json(SETTINGS_FILE, settings)
    return settings
