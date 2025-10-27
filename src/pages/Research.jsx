import React from 'react'
import { motion } from 'framer-motion'

export default function Research(){
  return (
    <div className="page research container">
      <motion.h2 initial={{x:-30, opacity:0}} animate={{x:0, opacity:1}}>Research & Methods</motion.h2>
      <p>Sampling locations, methodology, and protocols. Replace these placeholders with your real content.</p>
      <div className="research-grid">
        <section className="card">
          <h4>Sampling</h4>
          <p>Coordinates, dates, and equipment used at Battery Park Marina.</p>
        </section>
        <section className="card">
          <h4>Lab Analysis</h4>
          <p>Microscopy, particle counting, and processing notes.</p>
        </section>
      </div>
    </div>
  )
}
