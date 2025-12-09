
import React, { useEffect, useMemo, useState } from 'react'

const USER_AGENTS = [
  'Mozilla/5.0',
  'VLC/3.x',
  'Lavf/59',
  'Custom'
]

export default function Settings(){
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const [modal, setModal] = useState(null) // {mode:'add'|'edit', data:{...}}

  const load = async ()=>{
    setLoading(true)
    try{
      const r = await fetch('/api/stream-profiles')
      const j = await r.json()
      if(Array.isArray(j)) setProfiles(j)
    } finally{ setLoading(false) }
  }
  useEffect(()=>{ load() },[])

  const onToggle = async (p)=>{
    const body = { ...p, active: !p.active }
    await fetch(`/api/stream-profiles/${p.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    load()
  }

  const onDelete = async (p)=>{
    if(!confirm('Eliminare il profilo?')) return
    const r = await fetch(`/api/stream-profiles/${p.id}`, { method:'DELETE' })
    if(r.ok) load()
  }

  const onSubmitModal = async (data)=>{
    setMsg('')
    if(modal?.mode === 'add'){
      const r = await fetch('/api/stream-profiles', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
      if(!r.ok){ setMsg('Errore creazione profilo'); return }
      setModal(null); load(); return
    }
    if(modal?.mode === 'edit'){
      const r = await fetch(`/api/stream-profiles/${data.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
      if(!r.ok){ setMsg('Errore aggiornamento profilo'); return }
      setModal(null); load(); return
    }
  }

  const columns = 'minmax(200px,1.2fr) 160px 1fr 100px 160px'

  return (
    <div className='card'>
      <h2>Settings</h2>

      <section className='mt-4 card'>
        <div className='flex items-center gap-2'>
          <h3>Stream Profiles</h3>
          <div className='ml-auto'>
            <button onClick={()=> setModal({mode:'add', data:{ name:'', command:'', parameters:'', userAgent:'Mozilla/5.0', active:true }})}>Add Stream Profile</button>
          </div>
        </div>

        {loading ? <p className='mt-2'>Caricamento…</p> : (
          <div className='table mt-2' style={{gridTemplateColumns: columns}}>
            <div className='thead'>
              <div>Name</div><div>Command</div><div>Parameters</div><div>Active</div><div>Actions</div>
            </div>
            {profiles.map(p => (
              <div className='trow' key={p.id}>
                <div>{p.name || p.label || p.id}</div>
                <div>{p.command || (p.type==='redirect' ? 'redirect' : '')}</div>
                <div className='ellipsis' title={p.parameters || ''}>{p.parameters || ''}</div>
                <div>
                  <label className='flex items-center gap-2'>
                    <input type='checkbox' checked={!!p.active} onChange={()=>onToggle(p)} disabled={['redirect','ffmpeg'].includes(p.id) && p.active===true ? false : false} />
                  </label>
                </div>
                <div className='flex gap-2'>
                  <button onClick={()=> setModal({mode:'edit', data:{...p}})}>Edit</button>
                  <button onClick={()=> onDelete(p)} disabled={['redirect','ffmpeg'].includes(p.id)}>Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {msg && <p className='mt-2'>{msg}</p>}
      </section>

      {modal && <ProfileModal data={modal.data} mode={modal.mode} onClose={()=>setModal(null)} onSubmit={onSubmitModal} />}
    </div>
  )
}

function ProfileModal({data, mode, onClose, onSubmit}){
  const [form, setForm] = useState(data)
  const set = (k,v)=> setForm(prev => ({...prev,[k]:v}))
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50}}>
      <div className='card' style={{width:480, maxWidth:'90vw'}}>
        <div className='flex items-center'>
          <h3>Stream Profile</h3>
          <div className='ml-auto'><button onClick={onClose}>×</button></div>
        </div>
        <label className='mt-2'>Name</label>
        <input type='text' value={form.name||''} onChange={e=>set('name', e.target.value)} />
        <label className='mt-2'>Command</label>
        <input type='text' placeholder='ffmpeg / streamlink / redirect' value={form.command||''} onChange={e=>set('command', e.target.value)} />
        <label className='mt-2'>Parameters</label>
        <input type='text' placeholder='-user_agent {userAgent} -i {streamUrl} -c copy -f mpegts {output}' value={form.parameters||''} onChange={e=>set('parameters', e.target.value)} />
        <label className='mt-2'>User-Agent</label>
        <select value={form.userAgent||'Mozilla/5.0'} onChange={e=>set('userAgent', e.target.value)}>
          {USER_AGENTS.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <div className='mt-4 flex gap-2'>
          <button onClick={()=> onSubmit(form)}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
