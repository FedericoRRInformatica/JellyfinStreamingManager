
import React, {useEffect, useState} from 'react'
export default function Settings(){
  const [settings, setSettings] = useState(null)
  useEffect(()=>{ fetch('/api/settings').then(r=>r.json()).then(setSettings) },[])
  return (
    <div className='card'>
      <h2>Settings</h2>
      <pre className='mt-2'>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  )
}
