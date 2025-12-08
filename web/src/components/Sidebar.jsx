
import React from 'react'
import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/', label: 'Dashboard' },
  { to: '/channels', label: 'Canali' },
  { to: '/streams', label: 'Streams' },
  { to: '/epg', label: 'EPG' },
  { to: '/profiles', label: 'Profili' },
  { to: '/output', label: 'Output' },
  { to: '/settings', label: 'Impostazioni' },
]

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div className="brand">JSManager</div>
      <nav>
        {nav.map(item => (
          <NavLink key={item.to} to={item.to} className={({isActive})=> 'navitem' + (isActive?' active':'')} end>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
