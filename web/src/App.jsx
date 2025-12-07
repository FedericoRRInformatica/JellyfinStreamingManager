
import React, { useEffect, useState } from 'react'

export default function App() {
  const origin = window.location.origin
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetch('/api/settings').then(r=>r.json()).then(setSettings).catch(()=>{})
  }, [])

  return (
    <div style={{fontFamily:'system-ui', padding:20}}>
      <h1>JellyfinStreamingManager (JSManager) — Porta unica 7373</h1>
      <p>Output per Jellyfin (stessa porta):</p>
      <ul>
        <li>M3U: <code>{origin}/output/m3u/default.m3u</code></li>
        <li>XMLTV: <code>{origin}/output/xmltv/default.xml</code></li>
      </ul>
      <h3>Impostazioni</h3>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  )
}
