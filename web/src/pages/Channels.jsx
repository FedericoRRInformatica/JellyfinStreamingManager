
import React, {useEffect, useMemo, useState} from 'react'

export default function Channels(){
  const [channels, setChannels] = useState([])
  const [m3uUrl, setM3uUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [q, setQ] = useState('')
  const [group, setGroup] = useState('')

  const load = async() => {
    setMsg('')
    try {
      const r = await fetch('/api/channels')
      if(!r.ok) throw new Error('API /api/channels non disponibile')
      const j = await r.json()
      const list = Array.isArray(j) ? j : (Array.isArray(j?.channels) ? j.channels : [])
      setChannels(list)
    } catch(e){
      setMsg(e.message)
      setChannels([])
    }
  }
  useEffect(()=>{ load() }, [])

  const importUrl = async()=>{
    if(!m3uUrl) return
    setBusy(true); setMsg('')
    try{
      const r = await fetch('/api/providers/m3u/url', {
        method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({url:m3uUrl})
      })
      if(!r.ok) throw new Error('Import M3U fallito')
      await load()
      setMsg('Import completato')
    }catch(e){ setMsg(e.message) }
    finally{ setBusy(false) }
  }

  // calcola gruppi unici
  const groups = useMemo(()=>{
    const s = new Set()
    channels.forEach(c => { if (c.group) s.add(c.group) })
    return Array.from(s).sort()
  }, [channels])

  // filtra
  const filtered = useMemo(()=>{
    const qn = q.trim().toLowerCase()
    return channels.filter(c => {
      const okQ = !qn || (c.name||'').toLowerCase().includes(qn) || (c.tvg_id||'').toLowerCase().includes(qn)
      const okG = !group || c.group === group
      return okQ && okG
    })
  }, [channels, q, group])

  return (
    <div>
      <div className='card'>
        <h2>Import M3U</h2>
        <div className='flex gap-2 mt-2'>
          <input type='text' placeholder='http(s)://...' value={m3uUrl} onChange={e=>setM3uUrl(e.target.value)} />
          <button onClick={importUrl} disabled={busy || !m3uUrl}>Importa</button>
        </div>
        {msg && <p className='mt-2'>{msg}</p>}
      </div>

      <div className='card mt-4'>
        <div className='flex items-center gap-2'>
          <h2>Canali</h2>
          <span className='badge'>{filtered.length}</span>
          <div className='flex gap-2 ml-auto'>
            <input type='text' placeholder='Cerca…' value={q} onChange={e=>setQ(e.target.value)} />
            <select value={group} onChange={e=>setGroup(e.target.value)}>
              <option value=''>Tutti i gruppi</option>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className='table mt-2'>
          <div className='thead'>
            <div>Ch #</div><div>Nome</div><div>Gruppo</div><div>URL</div>
          </div>
          {filtered.map((c,i)=> (
            <div className='trow' key={i}>
              <div>{c.number ?? ''}</div>
              <div className='flex items-center gap-2'>
                {c.logo && <img src={c.logo} alt='' width={24} height={24} style={{borderRadius:6}}/>}
                <div>
                  <div>{c.name}</div>
                  {c.tvg_id && <div className='muted'>{c.tvg_id}</div>}
                </div>
              </div>
              <div>{c.group ?? ''}</div>
              <div className='ellipsis' title={c.url}>{c.url}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
