
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './style.css'
import App from './App'
import Channels from './pages/Channels'
import Vod from './pages/Vod'
import PlaylistManager from './pages/PlaylistManager'
import Users from './pages/Users'
import LogoManager from './pages/LogoManager'
import Settings from './pages/Settings'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Navigate to="/channels" replace /> },
    { path: 'channels', element: <Channels/> },
    { path: 'vod', element: <Vod/> },
    { path: 'playlist', element: <PlaylistManager/> },
    { path: 'users', element: <Users/> },
    { path: 'logos', element: <LogoManager/> },
    { path: 'settings', element: <Settings/> },
  ]}
])

createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
