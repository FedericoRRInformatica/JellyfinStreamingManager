import json, os, tempfile, shutil

DATA_DIR = os.environ.get('JSM_DATA_DIR', '/data')
SETTINGS_PATH = os.path.join(DATA_DIR, 'settings.json')

DEFAULT = {
    "streamSettings": {
        "defaultUserAgentId": None,
        "defaultStreamProfileId": None
    },
    "profiles": [],
    "userAgents": []
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


def is_valid_ids(settings: dict, ua_id: str|None, profile_id: str|None) -> bool:
    ua_ok = (ua_id is None) or any(u.get('isActive') and u.get('id') == ua_id for u in settings.get('userAgents', []))
    pr_ok = (profile_id is None) or any(p.get('isActive') and p.get('id') == profile_id for p in settings.get('profiles', []))
    return ua_ok and pr_ok
