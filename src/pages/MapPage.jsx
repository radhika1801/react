import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapPage(){
  const center = [40.7033, -74.0170] // Battery Park Marina
  return (
    <div className="page map container">
      <h2>Map — Sampling Sites</h2>
      <p>Interactive map of sampling locations (Leaflet).</p>
      <div style={{height: '60vh', borderRadius:8, overflow:'hidden'}}>
        <MapContainer center={center} zoom={14} style={{height:'100%', width:'100%'}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={center}>
            <Popup>Battery Park Marina — sample site</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}
