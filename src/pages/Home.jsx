import React from 'react'
import { Parallax } from 'react-parallax'
import { motion } from 'framer-motion'
// import hero from '../assets/hero.jpg'

export default function Home(){
  return (
    <div className="page home">
      {/* <Parallax bgImage={hero} strength={300}>
        <section className="hero">
          <motion.h1 initial={{opacity:0, y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}}>
            the invisible river
          </motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
            Observational research at Battery Park Marina — tracing microplastics visually and with data.
          </motion.p>
        </section>
      </Parallax> */}

      <section className="about container">
        <h2>About</h2>
        <p>This project documents microplastic sampling and visualizes particle distribution to engage the public.</p>
      </section>

      <section className="featured container">
        <article className="card">
          <h3>Field Notes</h3>
          <p>Daily sampling logs and observations.</p>
        </article>
        <article className="card">
          <h3>Gallery</h3>
          <p>Photos, sketches, and annotated maps.</p>
        </article>
        <article className="card">
          <h3>Data</h3>
          <p>Interactive charts and maps showing particle counts and distribution.</p>
        </article>
      </section>
    </div>
  )
}
