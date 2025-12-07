
import React from 'react'

export default function App() {
  const origin = window.location.origin
  return (
    <div style={{fontFamily:'system-ui', padding:20}}>
      <h1>JellyfinStreamingManager (JSManager) — Porta unica 7373</h1>
      <p>Output per Jellyfin (stessa porta):</p>
      <ul>
        <li>M3U: <code>{origin}/output/m3u/default.m3u</code></li>
        <li>XMLTV: <code>{origin}/output/xmltv/default.xml</code></li>
      </ul>
    </div>
  )
}
