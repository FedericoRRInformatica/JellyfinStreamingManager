
import React from 'react'
export default function Output(){
  const host = typeof window !== 'undefined' ? window.location.host : 'localhost:7373'
  const m3uUrl = `http://${host}/output/m3u/default.m3u`
  const xmltvUrl = `http://${host}/output/xmltv/default.xml`
  return (
    <div className='card'>
      <h2>Output</h2>
      <ul className='mt-2'>
        <li>M3U: <a href={m3uUrl}>{m3uUrl}</a></li>
        <li>XMLTV: <a href={xmltvUrl}>{xmltvUrl}</a></li>
      </ul>
    </div>
  )
}
