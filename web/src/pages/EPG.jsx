
import React, {useEffect, useState} from 'react'
export default function EPG(){
  const [url, setUrl] = useState('')
  const [msg, setMsg] = useState('')
  const save = async()=>{
    setMsg('')
    const r = await fetch('/api/epg/url', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({url})})
    setMsg(r.ok? 'Sorgente EPG salvata' : 'Errore salvataggio')
  }
  return (
    <div className='card'>
      <h2>Sorgente EPG (XMLTV)</h2>
      <div className='flex gap-2 mt-2'>
        <input type='text' placeholder='http(s)://...epg.xml' value={url} onChange={e=>setUrl(e.target.value)} />
        <button onClick={save} disabled={!url}>Salva</button>
      </div>
      {msg && <p className='mt-2'>{msg}</p>}
    </div>
  )
}
