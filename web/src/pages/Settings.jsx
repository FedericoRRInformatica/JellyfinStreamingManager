import React, { useEffect, useState } from 'react';

const UA_MODAL_STYLE = {
  position:'fixed', inset:0, background:'rgba(0,0,0,.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50
};
const CARD_STYLE = { background:'#1f1f1f', color:'#ddd', borderRadius:8, padding:'1rem', boxShadow:'0 1px 3px rgba(0,0,0,.3)' };
const INPUT_STYLE = { background:'#2a2a2a', color:'#ddd', border:'1px solid #444', borderRadius:6, padding:'0.5rem' };
const BTN_STYLE = { border:'1px solid #555', background:'#2a2a2a', color:'#ddd', padding:'0.5rem 0.9rem', borderRadius:6, cursor:'pointer' };

function UAModal({data, onClose, onSubmit}){
  const [form, setForm] = useState(data || { name:'', value:'', description:'', isActive:true });
  const set = (k,v)=> setForm(prev => ({...prev,[k]:v}))
  return (
    <div style={UA_MODAL_STYLE}>
      <div style={{...CARD_STYLE, width:480, maxWidth:'90vw'}}>
        <div style={{display:'flex', alignItems:'center'}}>
          <h3 style={{margin:0}}>User‑Agent</h3>
          <button style={{...BTN_STYLE, marginLeft:'auto'}} onClick={onClose}>×</button>
        </div>
        <label style={{marginTop:12}}>Name</label>
        <input style={INPUT_STYLE} type='text' value={form.name||''} onChange={e=>set('name', e.target.value)} />
        <label style={{marginTop:12}}>User‑Agent</label>
        <input style={INPUT_STYLE} type='text' value={form.value||''} onChange={e=>set('value', e.target.value)} />
        <label style={{marginTop:12}}>Description</label>
        <input style={INPUT_STYLE} type='text' value={form.description||''} onChange={e=>set('description', e.target.value)} />
        <label style={{display:'flex', alignItems:'center', gap:8, marginTop:12}}>
          <input type='checkbox' checked={!!form.isActive} onChange={e=>set('isActive', e.target.checked)} />
          Is Active
        </label>
        <div style={{marginTop:16, display:'flex', gap:8}}>
          <button style={BTN_STYLE} onClick={()=> onSubmit(form)}>Submit</button>
          <button style={BTN_STYLE} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function Settings(){
  const [profiles, setProfiles] = useState([]);
  const [uas, setUas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [modal, setModal] = useState(null); // {mode, data}
  const [uaModal, setUaModal] = useState(null); // {mode, data}

  const [streamSettings, setStreamSettings] = useState({ defaultUserAgentId:'', defaultStreamProfileId:'' });

  const [vod, setVod] = useState({ basePath:'/VOD' });

  const loadAll = async ()=>{
    setLoading(true);
    try{
      const r1 = await fetch('/api/stream-profiles');
      const r2 = await fetch('/api/user-agents');
      const r3 = await fetch('/api/stream-settings');
      const r4 = await fetch('/api/vod-settings');
      const [p, u, s, v] = await Promise.all([r1.json(), r2.json(), r3.json(), r4.json()]);
      setProfiles(Array.isArray(p)? p: []);
      setUas(Array.isArray(u)? u: []);
      setStreamSettings(s||{});
      setVod(v||{ basePath:'/VOD' });
    } finally { setLoading(false); }
  };
  useEffect(()=>{ loadAll(); },[]);

  const columns = 'minmax(200px,1.2fr) 160px 1fr 100px 160px';

  const onToggle = async (p)=>{
    const body = { ...p, active: !p.active };
    await fetch(`/api/stream-profiles/${p.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    loadAll();
  };
  const onDelete = async (p)=>{
    if(!confirm('Eliminare il profilo?')) return;
    const r = await fetch(`/api/stream-profiles/${p.id}`, { method:'DELETE' });
    if(r.ok) loadAll();
  };
  const onSubmitModal = async (data)=>{
    setMsg('');
    if(modal?.mode === 'add'){
      const r = await fetch('/api/stream-profiles', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
      if(!r.ok){ setMsg('Errore creazione profilo'); return }
      setModal(null); loadAll(); return;
    }
    if(modal?.mode === 'edit'){
      const r = await fetch(`/api/stream-profiles/${data.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
      if(!r.ok){ setMsg('Errore aggiornamento profilo'); return }
      setModal(null); loadAll(); return;
    }
  };

  // UA actions
  const addUa = ()=> setUaModal({ mode:'add', data:{ name:'', value:'', description:'', isActive:true } });
  const editUa = (ua)=> setUaModal({ mode:'edit', data:{...ua} });
  const delUa = async (ua)=>{ if(!confirm('Eliminare lo User‑Agent?')) return; const r=await fetch(`/api/user-agents/${ua.id}`, {method:'DELETE'}); if(r.ok) loadAll(); };
  const submitUa = async (data)=>{
    if(uaModal?.mode==='add'){
      const r=await fetch('/api/user-agents', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
      if(r.ok){ setUaModal(null); loadAll(); }
      return;
    }
    if(uaModal?.mode==='edit'){
      const r=await fetch(`/api/user-agents/${data.id}`, {method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
      if(r.ok){ setUaModal(null); loadAll(); }
      return;
    }
  };

  // Stream Settings save
  const saveStreamSettings = async ()=>{
    const r = await fetch('/api/stream-settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(streamSettings) });
    if(r.ok) setMsg('Impostazioni streaming salvate');
  };

  // VOD Settings save
  const saveVod = async ()=>{
    const r = await fetch('/api/vod-settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ basePath: vod.basePath, createIfMissing:true }) });
    if(r.ok) setMsg('Percorso VOD salvato');
  };

  return (
    <div className='card'>
      <h2>Settings</h2>

      {/* User‑Agents */}
      <section className='mt-4 card'>
        <div className='flex items-center gap-2'>
          <h3>User‑Agents</h3>
          <div className='ml-auto'><button onClick={addUa}>Add User‑Agent</button></div>
        </div>
        <div className='table mt-2' style={{gridTemplateColumns:'minmax(200px,1.2fr) 1.6fr 1fr 120px'}}>
          <div className='thead'><div>Name</div><div>User‑Agent</div><div>Description</div><div>Actions</div></div>
          {uas.map(ua => (
            <div className='trow' key={ua.id}>
              <div>{ua.name}</div>
              <div className='ellipsis' title={ua.value}>{ua.value}</div>
              <div className='ellipsis' title={ua.description||''}>{ua.description||''}</div>
              <div className='flex gap-2'>
                <button onClick={()=>editUa(ua)}>Edit</button>
                <button onClick={()=>delUa(ua)}>Del</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stream Profiles */}
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
                    <input type='checkbox' checked={!!p.active} onChange={()=>onToggle(p)} />
                  </label>
                </div>
                <div className='flex gap-2'>
                  <button onClick={()=> setModal({mode:'edit', data:{...p}})}>Edit</button>
                  <button onClick={()=> onDelete(p)}>Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {msg && <p className='mt-2'>{msg}</p>}
      </section>

      {/* Stream Settings */}
      <section className='mt-4 card'>
        <h3>Stream Settings</h3>
        <div style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr'}}>
          <div>
            <label>Default User‑Agent</label>
            <select value={streamSettings.defaultUserAgentId||''} onChange={e=> setStreamSettings({...streamSettings, defaultUserAgentId:e.target.value})}>
              <option value=''>Nessuno</option>
              {uas.filter(x=>x.isActive).map(x=> <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
          <div>
            <label>Default Stream Profile</label>
            <select value={streamSettings.defaultStreamProfileId||''} onChange={e=> setStreamSettings({...streamSettings, defaultStreamProfileId:e.target.value})}>
              <option value=''>Nessuno</option>
              {profiles.filter(x=>x.active).map(x=> <option key={x.id} value={x.id}>{x.name}</option>)}
            </select>
          </div>
        </div>
        <div className='mt-2'><button onClick={saveStreamSettings}>Salva Stream Settings</button></div>
      </section>

      {/* VOD Settings */}
      <section className='mt-4 card'>
        <h3>VOD Settings</h3>
        <label>Percorso base VOD (sul volume)</label>
        <input type='text' value={vod.basePath||'/VOD'} onChange={e=> setVod({ ...vod, basePath:e.target.value })} />
        <div className='mt-2'><button onClick={saveVod}>Salva VOD</button></div>
      </section>

      {uaModal && <UAModal data={uaModal.data} onClose={()=> setUaModal(null)} onSubmit={submitUa} />}
      {modal && <ProfileModal data={modal.data} mode={modal.mode} onClose={()=>setModal(null)} onSubmit={onSubmitModal} />}
    </div>
  );
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
          {(uas||[]).filter(x=>x.isActive).map(u => <option key={u.id} value={u.value}>{u.name}</option>)}
        </select>
        <div className='mt-4 flex gap-2'>
          <button onClick={()=> onSubmit(form)}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
