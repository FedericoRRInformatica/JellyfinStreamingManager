import json, os, tempfile, shutil
from typing import Optional

DATA_DIR = os.environ.get('JSM_DATA_DIR', '/data')
SETTINGS_PATH = os.path.join(DATA_DIR, 'settings.json')
VOD_ROOT = os.environ.get('JSM_VOD_ROOT', '/VOD')

DEFAULT = {
    "streamSettings": {
        "defaultUserAgentId": None,
        "defaultStreamProfileId": None
    },
    "profiles": [],
    "userAgents": [],
    "vodSettings": {
        "basePath": "/VOD"
    }
}

def load_settings():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(SETTINGS_PATH):
        return DEFAULT.copy()
    with open(SETTINGS_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_settings(settings: dict):
    os.makedirs(DATA_DIR, exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix='settings_', suffix='.json')
    try:
        with os.fdopen(fd, 'w', encoding='utf-8') as f:
            json.dump(settings, f, ensure_ascii=False, indent=2)
        if not os.path.exists(SETTINGS_PATH):
            shutil.move(tmp, SETTINGS_PATH)
        else:
            backup = SETTINGS_PATH + '.bak'
            os.replace(tmp, SETTINGS_PATH)
            try:
                shutil.copyfile(SETTINGS_PATH, backup)
            except Exception:
                pass
    finally:
        try: os.remove(tmp)
        except Exception: pass


def _normalize(path: str) -> str:
    return os.path.realpath(path)


def is_path_allowed(path: str) -> bool:
    if not os.path.isabs(path):
        return False
    rp = _normalize(path)
    root = _normalize(VOD_ROOT)
    return rp.startswith(root + os.sep) or rp == root


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)
