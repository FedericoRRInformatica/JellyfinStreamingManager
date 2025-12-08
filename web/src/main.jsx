
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './style.css'
import App from './App'
import Dashboard from './pages/Dashboard'
import Channels from './pages/Channels'
import Streams from './pages/Streams'
import EPG from './pages/EPG'
import Profiles from './pages/Profiles'
import Output from './pages/Output'
import Settings from './pages/Settings'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Dashboard/> },
    { path: 'channels', element: <Channels/> },
    { path: 'streams', element: <Streams/> },
    { path: 'epg', element: <EPG/> },
    { path: 'profiles', element: <Profiles/> },
    { path: 'output', element: <Output/> },
    { path: 'settings', element: <Settings/> },
  ]}
])

createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
