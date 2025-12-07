
import React, { useEffect, useState, useRef } from 'react'

export default function App() {
  const origin = window.location.origin
  const [settings, setSettings] = useState({})
  const brandRef = useRef('')

  useEffect(() => {
    fetch('/api/settings').then(r=>r.json()).then(data=>{
      setSettings(data)
      brandRef.current = data.brand || ''
    }).catch(()=>{})
  }, [])

  const save = async () => {
    const res = await fetch('/api/settings', {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({brand: brandRef.current})})
    setSettings(await res.json())
  }

  return (
    <div style={{fontFamily:'system-ui', padding:20}}>
      <h1>JellyfinStreamingManager (JSManager) — Porta unica 7373</h1>
      <p>Output per Jellyfin (stessa porta):</p>
      <ul>
        <li>M3U: <code>{origin}/output/m3u/default.m3u</code></li>
        <li>XMLTV: <code>{origin}/output/xmltv/default.xml</code></li>
      </ul>

      <h3>Impostazioni (persistenti in /data/settings.json)</h3>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <label>Brand: </label>
        <input defaultValue={settings.brand||''} onChange={e=>brandRef.current=e.target.value} />
        <button onClick={save}>Salva</button>
      </div>

      <pre style={{background:'#f6f6f6', padding:12, borderRadius:8, marginTop:12}}>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  )
}
