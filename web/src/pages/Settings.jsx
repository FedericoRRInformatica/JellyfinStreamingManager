import React, { useEffect, useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [uas, setUas] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/stream-settings').then(r => r.json()),
      fetch('/api/user-agents').then(r => r.json()),
      fetch('/api/stream-profiles').then(r => r.json())
    ]).then(([s, ua, pr]) => {
      setSettings(s);
      setUas((ua || []).filter(x => x.isActive));
      setProfiles((pr || []).filter(x => x.isActive));
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true); setMsg(null);
    const res = await fetch('/api/stream-settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    setSaving(false);
    setMsg(res.ok ? 'Impostazioni salvate' : 'Errore nel salvataggio');
  };

  const field = (label, value, onChange, items, placeholder) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ fontWeight: 600 }}>{label}</label>
      <select value={value || ''} onChange={e => onChange(e.target.value)}>
        <option value="">{placeholder || '(Nessuno)'}</option>
        {items.map(x => <option key={x.id} value={x.id}>{x.label || x.name}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: '2rem auto', padding: '1rem' }}>
      <h2>Stream Settings</h2>
      {field('Default User‑Agent', settings.defaultUserAgentId, v => setSettings({ ...settings, defaultUserAgentId: v }), uas)}
      {field('Default Stream Profile', settings.defaultStreamProfileId, v => setSettings({ ...settings, defaultStreamProfileId: v }), profiles)}
      <button onClick={save} style={{ border: '1px solid #ccc', background: '#fff', color: '#333', padding: '0.6rem 1rem', cursor: 'pointer' }} disabled={saving}>Salva</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
