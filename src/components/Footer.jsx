import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <p>© {new Date().getFullYear()} East River — Microplastics · Built with React (Vite)</p>
      </div>
    </footer>
  )
}
