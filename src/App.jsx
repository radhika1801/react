import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Research from './pages/Research'
import Gallery from './pages/Gallery'
import MapPage from './pages/MapPage'
import Footer from './components/Footer'
import Structure3D from './pages/Structure3D'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/research" element={<Research />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/structure" element={<Structure3D />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
