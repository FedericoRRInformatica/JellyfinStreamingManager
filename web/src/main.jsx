import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function App() {
  const [settings, setSettings] = useState(null)
  const [brand, setBrand] = useState('JSManager')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(j => { setSettings(j); setBrand(j.brand ?? 'JSManager') })
      .catch(() => setError('Impossibile caricare /api/settings'))
  }, [])

  const onSave = async () => {
    if (!settings) return
    setSaving(true)
    setError('')
    try {
      const payload = { ...settings, brand }
      const r = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const j = await r.json()
      setSettings(j)
    } catch (e) {
      setError('Salvataggio fallito')
    } finally {
      setSaving(false)
    }
  }

  const host = typeof window !== 'undefined' ? window.location.host : 'localhost:7373'
  const m3uUrl = `http://${host}/output/m3u/default.m3u`
  const xmltvUrl = `http://${host}/output/xmltv/default.xml`

  return (
    <div className="container"> 
      <header className="header"> 
        <h1>JellyfinStreamingManager ({brand || 'JSManager'}) — Porta unica {settings?.port ?? 7373}</h1>
        <p className="mt-2">Output per Jellyfin (stessa porta):</p>
        <ul>
          <li>M3U: <a href={m3uUrl}>{m3uUrl}</a></li>
          <li>XMLTV: <a href={xmltvUrl}>{xmltvUrl}</a></li>
        </ul>
      </header>

      <section className="mt-6">
        <h2>Impostazioni (persistenti in <code>/data/settings.json</code>)</h2>
        <label className="mt-4">Brand:</label>
        <div className="flex items-center gap-2">
          <input type="text" value={brand} onChange={e => setBrand(e.target.value)} />
          <button onClick={onSave} disabled={saving}>{saving ? 'Salvo…' : 'Salva'}</button>
        </div>
        {error && <p style={{color:'#b91c1c'}} className="mt-2">{error}</p>}
      </section>

      <section className="mt-6">
        <pre>{JSON.stringify({ ...(settings||{}), brand }, null, 2)}</pre>
      </section>
    </div>
  )
}

const root = createRoot(document.getElementById('app'))
root.render(<React.StrictMode><App/></React.StrictMode>)
