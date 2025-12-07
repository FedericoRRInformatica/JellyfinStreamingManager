
import React from 'react'

export default function App() {
  const apiBase = window.location.origin
  return (
    <div style={{fontFamily:'system-ui', padding:20}}>
      <h1>JellyfinStreamingManager (JSManager)</h1>
      <p>Output per Jellyfin (stesso host e porta 7373):</p>
      <ul>
        <li>M3U (default): <code>{apiBase}/output/m3u/default.m3u</code></li>
        <li>XMLTV (default): <code>{apiBase}/output/xmltv/default.xml</code></li>
      </ul>
    </div>
  )
}
