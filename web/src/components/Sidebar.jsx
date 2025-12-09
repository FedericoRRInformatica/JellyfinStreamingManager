
import React from 'react'
import { NavLink } from 'react-router-dom'

const nav = [
  { to: '/channels', label: 'Channels' },
  { to: '/vod', label: 'VOD' },
  { to: '/playlist', label: 'Playlist Manager' },
  { to: '/users', label: 'Users' },
  { to: '/logos', label: 'Logo Manager' },
  { to: '/settings', label: 'Settings' },
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
