
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'

export default function AppLayout(){
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <Topbar />
        <div className="content"><Outlet/></div>
      </main>
    </div>
  )
}
