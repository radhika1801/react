import React, { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Sparkles, MeshReflectorMaterial, Text } from "@react-three/drei"
import * as THREE from 'three'

// Dynamic Battery Park Visualization
const BatteryParkVisualization = ({ position }) => {
  const particlesRef = useRef([])
  const linesRef = useRef([])
  const ringsRef = useRef([])
  const waveRingsRef = useRef([])
  const [showDetails, setShowDetails] = useState(false)
  
  // Create dynamic Battery Park data visualization
  const [visualData] = useState(() => {
    const particles = []
    const connections = []
    const rings = []
    const waveRings = []
    
    // Central location
    const center = { x: 0, y: 0, z: 0 }
    
    // Create multiple expanding rings for wave effect
    for (let r = 0; r < 8; r++) {
      waveRings.push({
        id: `wave-${r}`,
        radius: 0.2 + r * 0.15,
        delay: r * 0.3,
        color: r % 2 === 0 ? '#ff6b35' : '#4a9eff'
      })
    }
    
    // Create dense particle clusters at multiple heights
    const layers = [
      { height: 0.3, count: 250, radius: 0.25, color: '#ff6b35' },
      { height: 0.5, count: 220, radius: 0.28, color: '#ff8c42' },
      { height: 0.7, count: 200, radius: 0.32, color: '#4a9eff' },
      { height: 0.9, count: 180, radius: 0.35, color: '#6ba3ff' },
      { height: 1.1, count: 160, radius: 0.38, color: '#ff6b35' },
      { height: 1.3, count: 140, radius: 0.42, color: '#8bb5ff' }
    ]
    
    layers.forEach((layer, layerIndex) => {
      // Create circular ring for this layer
      rings.push({
        id: `ring-${layerIndex}`,
        position: [center.x, layer.height, center.z],
        radius: layer.radius,
        color: layer.color
      })
      
      // Create particles in this layer
      for (let i = 0; i < layer.count; i++) {
        const angle = (i / layer.count) * Math.PI * 2 + Math.random() * 0.3
        const radius = Math.random() * layer.radius
        const radiusVariation = 0.85 + Math.random() * 0.3
        
        const particlePos = [
          center.x + Math.cos(angle) * radius * radiusVariation,
          layer.height + (Math.random() - 0.5) * 0.08,
          center.z + Math.sin(angle) * radius * radiusVariation
        ]
        
        particles.push({
          id: `particle-${layerIndex}-${i}`,
          position: particlePos,
          basePosition: [...particlePos],
          size: 0.012 + Math.random() * 0.025,
          opacity: 0.5 + Math.random() * 0.5,
          color: layer.color,
          speed: 0.5 + Math.random() * 1.2,
          phase: Math.random() * Math.PI * 2,
          layer: layerIndex
        })
        
        // Create connection lines - denser network
        if (Math.random() > 0.75) {
          connections.push({
            id: `line-${layerIndex}-${i}`,
            from: [center.x, 0.02, center.z],
            to: particlePos,
            color: layer.color,
            opacity: 0.15 + Math.random() * 0.25,
            phase: Math.random() * Math.PI * 2
          })
        }
        
        // Connect particles within same layer
        if (i % 15 === 0 && i < layer.count - 1) {
          const nextAngle = ((i + 1) / layer.count) * Math.PI * 2
          const nextRadius = Math.random() * layer.radius
          connections.push({
            id: `link-${layerIndex}-${i}`,
            from: particlePos,
            to: [
              center.x + Math.cos(nextAngle) * nextRadius,
              layer.height,
              center.z + Math.sin(nextAngle) * nextRadius
            ],
            color: layer.color,
            opacity: 0.08 + Math.random() * 0.12,
            phase: Math.random() * Math.PI * 2
          })
        }
      }
    })
    
    // Add swirling particles around the structure
    for (let i = 0; i < 150; i++) {
      const spiralAngle = (i / 150) * Math.PI * 6
      const spiralHeight = (i / 150) * 1.5
      const spiralRadius = 0.4 + (i / 150) * 0.2
      
      particles.push({
        id: `spiral-${i}`,
        position: [
          Math.cos(spiralAngle) * spiralRadius,
          spiralHeight,
          Math.sin(spiralAngle) * spiralRadius
        ],
        basePosition: [
          Math.cos(spiralAngle) * spiralRadius,
          spiralHeight,
          Math.sin(spiralAngle) * spiralRadius
        ],
        size: 0.008 + Math.random() * 0.015,
        opacity: 0.3 + Math.random() * 0.4,
        color: i % 3 === 0 ? '#ff6b35' : '#4a9eff',
        speed: 0.8 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        layer: -1
      })
    }
    
    return { particles, connections, rings, waveRings }
  })
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    // Animate wave rings - expanding pulses
    waveRingsRef.current.forEach((ring, i) => {
      if (ring && visualData.waveRings[i]) {
        const data = visualData.waveRings[i]
        const wave = Math.sin(time * 2 - data.delay) * 0.5 + 0.5
        ring.scale.set(1 + wave * 0.3, 1, 1 + wave * 0.3)
        ring.material.opacity = (1 - wave) * 0.4
      }
    })
    
    // Animate particles - complex motion
    particlesRef.current.forEach((particle, i) => {
      if (particle && visualData.particles[i]) {
        const data = visualData.particles[i]
        
        if (data.layer === -1) {
          // Spiral particles - continuous rotation
          const spiralSpeed = 0.3
          const currentAngle = Math.atan2(particle.position.z, particle.position.x)
          const newAngle = currentAngle + spiralSpeed * 0.01
          const currentRadius = Math.sqrt(particle.position.x ** 2 + particle.position.z ** 2)
          
          particle.position.x = Math.cos(newAngle) * currentRadius
          particle.position.z = Math.sin(newAngle) * currentRadius
          particle.position.y += Math.sin(time * data.speed + data.phase) * 0.002
        } else {
          // Layer particles - floating and orbiting
          const orbitSpeed = 0.15
          const currentAngle = Math.atan2(
            particle.position.z - 0,
            particle.position.x - 0
          )
          const newAngle = currentAngle + orbitSpeed * 0.01
          const currentRadius = Math.sqrt(
            particle.position.x ** 2 + particle.position.z ** 2
          )
          
          particle.position.x = Math.cos(newAngle) * currentRadius
          particle.position.z = Math.sin(newAngle) * currentRadius
          
          // Gentle vertical float
          const rise = Math.sin(time * data.speed + data.phase) * 0.0015
          particle.position.y += rise
        }
        
        // Pulsing glow
        const pulse = Math.sin(time * 2.5 + data.phase) * 0.5 + 0.5
        particle.material.opacity = data.opacity * (0.6 + pulse * 0.4)
        particle.material.emissiveIntensity = 0.7 + pulse * 0.3
        
        // Scale pulsing
        particle.scale.setScalar(data.size * (0.9 + pulse * 0.2))
      }
    })
    
    // Animate connection lines
    linesRef.current.forEach((line, i) => {
      if (line && visualData.connections[i]) {
        const data = visualData.connections[i]
        const pulse = Math.sin(time * 1.8 + data.phase) * 0.5 + 0.5
        line.material.opacity = data.opacity * (0.4 + pulse * 0.6)
      }
    })
    
    // Animate layer rings
    ringsRef.current.forEach((ring, i) => {
      if (ring && visualData.rings[i]) {
        const pulse = Math.sin(time * 2 + i * 0.4) * 0.5 + 0.5
        ring.material.opacity = 0.25 + pulse * 0.25
        ring.scale.set(1 + pulse * 0.1, 1, 1 + pulse * 0.1)
      }
    })
  })

  return (
    <group position={position}>
      {/* Decorative base grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[2.5, 2.5, 16, 16]} />
        <meshBasicMaterial 
          color="#c4a574" 
          wireframe 
          transparent 
          opacity={0.2}
        />
      </mesh>
      
      {/* Solid circular base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[1.2, 48]} />
        <meshStandardMaterial 
          color="#2d2420" 
          transparent 
          opacity={0.4}
          roughness={0.8}
          emissive="#d4a574"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Expanding wave rings from center */}
      {visualData.waveRings.map((wave, i) => (
        <mesh 
          key={wave.id}
          ref={(el) => (waveRingsRef.current[i] = el)}
          position={[0, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[wave.radius, wave.radius + 0.03, 48]} />
          <meshBasicMaterial
            color={wave.color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Title */}
      <Text
        position={[0, 1.7, 0]}
        fontSize={0.13}
        color="#ffd4a3"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.006}
        outlineColor="#3d2817"
        font="bold"
      >
        Battery Park
      </Text>
      
      <Text
        position={[0, 1.55, 0]}
        fontSize={0.09}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#2d2420"
      >
        Morning Coffee Ritual
      </Text>

      {/* Main statistics - always visible */}
      <group position={[0, -0.35, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.18}
          color="#ff6b35"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#2d2420"
          font="bold"
        >
          31,253
        </Text>
        
        <Text
          position={[0, -0.15, 0]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.004}
          outlineColor="#3d2817"
        >
          daily visitors
        </Text>
        
        <Text
          position={[0, -0.28, 0]}
          fontSize={0.12}
          color="#4a9eff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.005}
          outlineColor="#2d2420"
        >
          468,795,000
        </Text>
        
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.07}
          color="#ffd4a3"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#3d2817"
        >
          microplastics consumed daily
        </Text>
      </group>

      {/* Central marker - clickable */}
      <mesh 
        position={[0, 0.08, 0]}
        onClick={() => setShowDetails(!showDetails)}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'default'
        }}
      >
        <cylinderGeometry args={[0.1, 0.1, 0.12, 32]} />
        <meshStandardMaterial
          color="#ff6b35"
          emissive="#ff6b35"
          emissiveIntensity={showDetails ? 1.0 : 0.7}
          roughness={0.2}
        />
      </mesh>
      
      {/* Outer glow ring */}
      <mesh 
        position={[0, 0.08, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.11, 0.16, 32]} />
        <meshBasicMaterial
          color="#ff6b35"
          transparent
          opacity={showDetails ? 0.7 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Layer rings */}
      {visualData.rings.map((ring, i) => (
        <mesh 
          key={ring.id}
          ref={(el) => (ringsRef.current[i] = el)}
          position={ring.position}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[ring.radius, ring.radius + 0.02, 48]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Detail panel when clicked */}
      {showDetails && (
        <group position={[0, 1.1, 0]}>
          {/* Background panel */}
          <mesh>
            <planeGeometry args={[1.1, 0.65]} />
            <meshStandardMaterial 
              color="#3d2817" 
              transparent 
              opacity={0.95}
              roughness={0.7}
              emissive="#d4a574"
              emissiveIntensity={0.15}
            />
          </mesh>
          
          {/* Border */}
          <lineSegments position={[0, 0, 0.01]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.1, 0.65)]} />
            <lineBasicMaterial color="#ffd4a3" linewidth={2} />
          </lineSegments>
          
          {/* Details */}
          <Text
            position={[0, 0.24, 0.01]}
            fontSize={0.06}
            color="#ffd4a3"
            anchorX="center"
            anchorY="middle"
          >
            Per Person Daily
          </Text>
          
          <Text
            position={[0, 0.14, 0.01]}
            fontSize={0.08}
            color="#ff6b35"
            anchorX="center"
            anchorY="middle"
          >
            15,000
          </Text>
          
          <Text
            position={[0, 0.05, 0.01]}
            fontSize={0.05}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            microplastics per cup
          </Text>
          
          <Text
            position={[0, -0.06, 0.01]}
            fontSize={0.055}
            color="#4a9eff"
            anchorX="center"
            anchorY="middle"
          >
            2-3 cups/person
          </Text>
          
          <Text
            position={[0, -0.17, 0.01]}
            fontSize={0.045}
            color="#c4a574"
            anchorX="center"
            anchorY="middle"
          >
            Manhattan Financial District
          </Text>
          
          <Text
            position={[0, -0.27, 0.01]}
            fontSize={0.038}
            color="#8b6f47"
            anchorX="center"
            anchorY="middle"
          >
            Click to close
          </Text>
        </group>
      )}

      {/* Connection lines */}
      {visualData.connections.map((connection, i) => (
        <line key={connection.id} ref={(el) => (linesRef.current[i] = el)}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                connection.from[0], connection.from[1], connection.from[2],
                connection.to[0], connection.to[1], connection.to[2]
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color={connection.color} 
            transparent 
            opacity={connection.opacity}
          />
        </line>
      ))}

      {/* Particle clouds */}
      {visualData.particles.map((particle, i) => (
        <mesh
          key={particle.id}
          ref={(el) => (particlesRef.current[i] = el)}
          position={particle.position}
        >
          <sphereGeometry args={[particle.size, 12, 12]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.8}
            transparent
            opacity={particle.opacity}
          />
        </mesh>
      ))}
      
      {/* Lighting */}
      <pointLight position={[0, 1.5, 0]} color="#ffd4a3" intensity={1.5} distance={4} />
      <pointLight position={[0, 0.7, 0]} color="#ff6b35" intensity={2} distance={2.5} />
      <pointLight position={[0.5, 0.5, 0.5]} color="#4a9eff" intensity={1.2} distance={2} />
      <pointLight position={[-0.5, 0.5, -0.5]} color="#ff8c42" intensity={1.2} distance={2} />
    </group>
  )
}

// [ALL OTHER COMPONENTS REMAIN THE SAME - ShojiDoor, PagodaRoof, TatamiFloor, etc.]

const ShojiDoor = ({ position, isLeft, width = 1.95, height = 3.2, onHoverChange }) => {
  const doorGroupRef = useRef()
  const doorPanelRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  
  useFrame((state) => {
    if (doorGroupRef.current) {
      const maxSlide = width * 0.85
      const targetX = open ? (isLeft ? -maxSlide : maxSlide) : 0
      const hoverOffset = hovered && !open ? (isLeft ? -0.08 : 0.08) : 0
      const finalTarget = targetX + hoverOffset
      
      doorGroupRef.current.position.x += (finalTarget - doorGroupRef.current.position.x) * 0.15
      
      if (doorPanelRef.current && hovered) {
        const breathe = Math.sin(state.clock.getElapsedTime() * 2) * 0.5 + 0.5
        doorPanelRef.current.material.emissiveIntensity = 0.1 + breathe * 0.08
      } else if (doorPanelRef.current) {
        doorPanelRef.current.material.emissiveIntensity = 0.02
      }
    }
  })

  return (
    <group position={position}>
      <group ref={doorGroupRef}>
        <mesh
          ref={doorPanelRef}
          onClick={() => setOpen(!open)}
          onPointerOver={() => {
            setHovered(true)
            if (onHoverChange) onHoverChange(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            if (onHoverChange) onHoverChange(false)
            document.body.style.cursor = 'default'
          }}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[width, height, 0.1]} />
          <meshStandardMaterial 
            color={hovered ? "#ffc0cb" : "#f5e8dc"}
            transparent 
            opacity={0.94}
            roughness={0.3}
            metalness={0.05}
            emissive={hovered ? "#ffb3c1" : "#ffd4a3"}
            emissiveIntensity={hovered ? 0.3 : 0.02}
          />
        </mesh>
        
        {[...Array(7)].map((_, i) => (
          <mesh key={`v${i}`} position={[-width/2 + 0.15 + i * (width-0.3)/6, 0, 0.055]} castShadow>
            <boxGeometry args={[0.025, height - 0.1, 0.025]} />
            <meshStandardMaterial 
              color={hovered ? "#ffc0cb" : "#8b6f47"}
              emissive={hovered ? "#ffb3c1" : "#000000"}
              emissiveIntensity={hovered ? 0.3 : 0}
            />
          </mesh>
        ))}
        
        {[...Array(18)].map((_, i) => (
          <mesh key={`h${i}`} position={[0, -height/2 + 0.1 + i * (height-0.2)/17, 0.055]} castShadow>
            <boxGeometry args={[width - 0.1, 0.025, 0.025]} />
            <meshStandardMaterial 
              color={hovered ? "#ffc0cb" : "#8b6f47"}
              emissive={hovered ? "#ffb3c1" : "#000000"}
              emissiveIntensity={hovered ? 0.3 : 0}
            />
          </mesh>
        ))}
        
        <mesh position={[0, 0, -0.055]}>
          <boxGeometry args={[width + 0.05, height + 0.05, 0.08]} />
          <meshStandardMaterial color="#d4c4a8" roughness={0.6} metalness={0.1} />
        </mesh>
        
        <mesh position={[isLeft ? width/3 : -width/3, 0, 0.08]}>
          <cylinderGeometry args={[0.03, 0.03, 0.18, 12]} />
          <meshStandardMaterial color="#3d2817" roughness={0.4} metalness={0.3} />
        </mesh>
        
        <mesh position={[isLeft ? width/3 : -width/3, 0, 0.12]}>
          <torusGeometry args={[0.04, 0.01, 8, 16]} />
          <meshStandardMaterial color="#2d2420" roughness={0.5} metalness={0.2} />
        </mesh>
      </group>
      
      <mesh position={[0, height/2 + 0.08, 0]}>
        <boxGeometry args={[width * 2.2, 0.15, 0.15]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.7} />
      </mesh>
      
      <mesh position={[width + 0.08, 0, 0]}>
        <boxGeometry args={[0.15, height + 0.3, 0.15]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.7} />
      </mesh>
      <mesh position={[-width - 0.08, 0, 0]}>
        <boxGeometry args={[0.15, height + 0.3, 0.15]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.7} />
      </mesh>
      
      {(hovered || open) && (
        <>
          <Sparkles 
            count={30} 
            scale={[width * 1.2, height * 1.1, 0.5]} 
            size={2.5} 
            speed={0.4} 
            color="#ffc0cb" 
            opacity={0.6}
          />
          <pointLight 
            position={[0, 0, 0.5]} 
            color="#ffb3c1" 
            intensity={2.2} 
            distance={4} 
            castShadow 
          />
        </>
      )}
    </group>
  )
}

const PagodaRoof = () => {
  const roofRefs = useRef([])
  
  useFrame((state) => {
    roofRefs.current.forEach((roof, i) => {
      if (roof) {
        const pulse = Math.sin(state.clock.getElapsedTime() * 1.2 + i * 0.4) * 0.5 + 0.5
        roof.material.emissiveIntensity = 0.1 + pulse * 0.08
      }
    })
  })

  return (
    <group position={[0, 3.2, 0]}>
      <mesh ref={(el) => (roofRefs.current[0] = el)} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[4.5, 0.5, 4]} />
        <meshStandardMaterial color="#5c4033" roughness={0.5} metalness={0.1} emissive="#d4a574" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, 0.7, 0]} ref={(el) => (roofRefs.current[1] = el)} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.6, 0.45, 4]} />
        <meshStandardMaterial color="#6b5438" roughness={0.5} metalness={0.15} emissive="#d4a574" emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0, 1.3, 0]} ref={(el) => (roofRefs.current[2] = el)} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.8, 0.4, 4]} />
        <meshStandardMaterial color="#7a6447" roughness={0.4} metalness={0.2} emissive="#e8c4a0" emissiveIntensity={0.14} />
      </mesh>
      <mesh position={[0, 1.85, 0]} ref={(el) => (roofRefs.current[3] = el)} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.1, 0.35, 4]} />
        <meshStandardMaterial color="#8b7355" roughness={0.3} metalness={0.25} emissive="#f5d4b0" emissiveIntensity={0.16} />
      </mesh>
      <mesh position={[0, 2.35, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.5, 8]} />
        <meshStandardMaterial color="#a68a64" metalness={0.6} roughness={0.2} emissive="#ffd4a3" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 2.7, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#c4a574" metalness={0.7} roughness={0.15} emissive="#ffe8c4" emissiveIntensity={0.4} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} color="#ffd4a3" intensity={1.2} distance={10} castShadow />
      <pointLight position={[0, 2.7, 0]} color="#ffe8c4" intensity={0.8} distance={5} />
    </group>
  )
}

const TatamiFloor = () => {
  const [hoveredMat, setHoveredMat] = useState(null)
  
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={0.25}
          roughness={0.95}
          color="#c4a574"
          metalness={0.05}
        />
      </mesh>
      
      {[[-2, 2], [0, 2], [2, 2], [-2, 0], [0, 0], [2, 0], [-2, -2], [0, -2], [2, -2]].map((pos, i) => (
        <mesh 
          key={i} 
          position={[pos[0], 0.01, pos[1]]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          receiveShadow
          onPointerOver={() => {
            setHoveredMat(i)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredMat(null)
            document.body.style.cursor = 'default'
          }}
        >
          <planeGeometry args={[1.9, 1.9]} />
          <meshStandardMaterial 
            color={hoveredMat === i ? "#ffc0cb" : "#c4a574"}
            roughness={0.95} 
            emissive={hoveredMat === i ? "#ffb3c1" : "#ffd4a3"}
            emissiveIntensity={hoveredMat === i ? 0.3 : 0.05} 
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.9, 1.9)]} />
            <lineBasicMaterial color="#8b6f47" linewidth={2} />
          </lineSegments>
        </mesh>
      ))}
    </group>
  )
}

const TeaTable = () => {
  const [hoveredItem, setHoveredItem] = useState(null)
  const teapotRef = useRef()
  const cupRefs = useRef([])
  
  useFrame((state) => {
    if (teapotRef.current && hoveredItem === 'teapot') {
      teapotRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1
      const breathe = Math.sin(state.clock.getElapsedTime() * 3) * 0.5 + 0.5
      teapotRef.current.material.emissiveIntensity = 0.3 + breathe * 0.15
    }
    
    cupRefs.current.forEach((cup, i) => {
      if (cup && hoveredItem === `cup${i}`) {
        cup.rotation.y += 0.02
        const breathe = Math.sin(state.clock.getElapsedTime() * 3 + i) * 0.5 + 0.5
        cup.material.emissiveIntensity = 0.4 + breathe * 0.2
      }
    })
  })
  
  return (
    <group position={[0, 0, -0.5]}>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.12, 1.2]} />
        <meshStandardMaterial color="#5c4033" roughness={0.4} metalness={0.05} />
      </mesh>
      
      {[[-0.8, -0.5], [0.8, -0.5], [-0.8, 0.5], [0.8, 0.5]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.06, pos[1]]} castShadow>
          <boxGeometry args={[0.08, 0.12, 0.08]} />
          <meshStandardMaterial color="#4a3822" roughness={0.6} />
        </mesh>
      ))}
      
      <mesh 
        ref={teapotRef}
        position={[0, 0.25, 0]} 
        castShadow
        onPointerOver={() => {
          setHoveredItem('teapot')
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHoveredItem(null)
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#4a6741" roughness={0.3} metalness={0.4} emissive="#6b8e5f" emissiveIntensity={0.15} />
      </mesh>
      
      <mesh position={[0.15, 0.25, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.15, 8]} />
        <meshStandardMaterial color="#4a6741" roughness={0.3} metalness={0.4} />
      </mesh>
      
      <mesh position={[-0.15, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#4a6741" roughness={0.3} metalness={0.4} />
      </mesh>
      
      {[[0.4, 0.3], [-0.4, 0.3], [0.4, -0.3], [-0.4, -0.3]].map((pos, i) => (
        <mesh 
          key={i}
          ref={(el) => (cupRefs.current[i] = el)}
          position={[pos[0], 0.21, pos[1]]} 
          castShadow
          onPointerOver={() => {
            setHoveredItem(`cup${i}`)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHoveredItem(null)
            document.body.style.cursor = 'default'
          }}
        >
          <cylinderGeometry args={[0.05, 0.04, 0.08, 12]} />
          <meshStandardMaterial color="#5a7a52" roughness={0.4} metalness={0.3} emissive="#7a9a72" emissiveIntensity={0.2} />
        </mesh>
      ))}
      
      {hoveredItem && (
        <pointLight 
          position={hoveredItem === 'teapot' ? [0, 0.35, 0] : [0.4, 0.3, 0.3]} 
          color="#ffd4a3" 
          intensity={1.5} 
          distance={1} 
        />
      )}
    </group>
  )
}

const WallShelf = ({ position }) => {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.05, 0.25]} />
        <meshStandardMaterial color="#3d2817" roughness={0.5} />
      </mesh>
      <mesh position={[-0.7, -0.15, 0]} castShadow>
        <boxGeometry args={[0.05, 0.3, 0.22]} />
        <meshStandardMaterial color="#2d2420" roughness={0.6} />
      </mesh>
      <mesh position={[0.7, -0.15, 0]} castShadow>
        <boxGeometry args={[0.05, 0.3, 0.22]} />
        <meshStandardMaterial color="#2d2420" roughness={0.6} />
      </mesh>
    </group>
  )
}

const StoneLantern = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.2, 6]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.15, 0.28]} />
        <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.25, 6]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.9} />
      </mesh>
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.15,
            0.4,
            Math.sin((angle * Math.PI) / 180) * 0.15,
          ]}
        >
          <boxGeometry args={[0.08, 0.12, 0.02]} />
          <meshStandardMaterial color="#f5e8d8" emissive="#ffd4a3" emissiveIntensity={0.5} transparent opacity={0.9} />
        </mesh>
      ))}
      <pointLight position={[0, 0.4, 0]} color="#ffd4a3" intensity={1.2} distance={2.5} castShadow />
      <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.25, 0.15, 4]} />
        <meshStandardMaterial color="#5a5a5a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#7a7a7a" roughness={0.8} />
      </mesh>
    </group>
  )
}

const Lantern = ({ position }) => {
  const lightRef = useRef()
  
  useFrame((state) => {
    if (lightRef.current) {
      const flicker = Math.sin(state.clock.getElapsedTime() * 3) * 0.5 + 0.5
      lightRef.current.intensity = 0.8 + flicker * 0.4
    }
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.12, 8]} />
        <meshStandardMaterial color="#2d2420" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} />
        <meshStandardMaterial color="#3d2817" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.25, 0.2, 0.25]} />
        <meshStandardMaterial color="#f5e8d8" emissive="#ffd4a3" emissiveIntensity={0.4} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.18, 0.15, 4]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 0.45, 0]} color="#ffd4a3" intensity={1} distance={3} castShadow />
    </group>
  )
}

const Cushion = ({ position, color }) => {
  const cushionRef = useRef()
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (cushionRef.current) {
      const targetY = hovered ? 0.08 : 0.06
      cushionRef.current.position.y += (targetY - cushionRef.current.position.y) * 0.12
      
      if (hovered) {
        const breathe = Math.sin(state.clock.getElapsedTime() * 3) * 0.5 + 0.5
        cushionRef.current.material.emissiveIntensity = 0.2 + breathe * 0.1
      } else {
        cushionRef.current.material.emissiveIntensity = 0
      }
    }
  })
  
  return (
    <>
      <mesh 
        ref={cushionRef}
        position={position} 
        castShadow 
        receiveShadow
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color={hovered ? color : "#8b5a5a"} roughness={0.9} emissive={color} emissiveIntensity={0} />
      </mesh>
      {hovered && (
        <pointLight position={[position[0], position[1] + 0.1, position[2]]} color={color} intensity={0.8} distance={1.2} />
      )}
    </>
  )
}

const TeaRoom = () => {
  const [leftDoorHovered, setLeftDoorHovered] = useState(false)
  const [rightDoorHovered, setRightDoorHovered] = useState(false)
  
  return (
    <group>
      <TatamiFloor />
      <TeaTable />
      
      <mesh position={[0, 1.5, -3.5]} receiveShadow>
        <boxGeometry args={[7, 3, 0.2]} />
        <meshStandardMaterial color="#2d2420" roughness={0.9} />
      </mesh>
      
      {[-2.5, -0.8, 0.8, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 1.8, -3.45]} castShadow>
          <boxGeometry args={[1.2, 1.4, 0.05]} />
          <meshStandardMaterial color="#ffd4a3" emissive="#ffb87a" emissiveIntensity={0.6} />
        </mesh>
      ))}
      
      <mesh position={[-3.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[7, 3, 0.2]} />
        <meshStandardMaterial color="#2d2420" roughness={0.9} />
      </mesh>
      
      <mesh position={[3.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[7, 3, 0.2]} />
        <meshStandardMaterial color="#2d2420" roughness={0.9} />
      </mesh>
      
      <mesh position={[3.45, 1.8, -1.5]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.2, 1.2, 0.05]} />
        <meshStandardMaterial color="#ffd4a3" emissive="#ffb87a" emissiveIntensity={0.5} />
      </mesh>
      
      <WallShelf position={[-2.5, 1.5, -3.4]} />
      
      <ShojiDoor 
        position={[-0.975, 1.5, 3.5]} 
        isLeft={true} 
        width={1.95} 
        height={3.2}
        onHoverChange={setLeftDoorHovered}
      />
      <ShojiDoor 
        position={[0.975, 1.5, 3.5]} 
        isLeft={false} 
        width={1.95} 
        height={3.2}
        onHoverChange={setRightDoorHovered}
      />
      
      {leftDoorHovered && (
        <BatteryParkVisualization position={[-6.5, 2, 4]} />
      )}
      
      {rightDoorHovered && (
        <BatteryParkVisualization position={[6.5, 2, 4]} />
      )}
      
      <PagodaRoof />
      
      <mesh position={[0, 3, 0]} receiveShadow>
        <boxGeometry args={[7, 0.2, 7]} />
        <meshStandardMaterial color="#4a3822" roughness={0.7} />
      </mesh>
      
      {[-2, -1, 0, 1, 2].map((z, i) => (
        <mesh key={i} position={[0, 3.08, z * 1.5]} castShadow>
          <boxGeometry args={[7, 0.12, 0.15]} />
          <meshStandardMaterial color="#3d2817" roughness={0.6} />
        </mesh>
      ))}
      
      {[[-3.4, -3.4], [3.4, -3.4], [-3.4, 3.4], [3.4, 3.4]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 1.5, pos[1]]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3, 0.2]} />
          <meshStandardMaterial color="#2d2420" roughness={0.7} />
        </mesh>
      ))}
      
      <Lantern position={[-2.9, 1.58, -3.25]} />
      <Lantern position={[-2.1, 1.58, -3.25]} />
      <StoneLantern position={[-2.5, 0, 2]} />
      
      <Cushion position={[-0.8, 0.06, 0.8]} color="#a86a6a" />
      <Cushion position={[0.8, 0.06, 0.8]} color="#9b5a5a" />
      <Cushion position={[-0.3, 0.06, -1.5]} color="#b87a7a" />
      <Cushion position={[0.3, 0.06, -1.5]} color="#8b4a4a" />
      <Cushion position={[-0.8, 0.06, -1.5]} color="#a86a6a" />
      <Cushion position={[0.8, 0.06, -1.5]} color="#9b5a5a" />
    </group>
  )
}

export default function Structure3D() {
  return (
    <div style={{ height: "100vh", width: "100vw", background: "#1a2845", position: "relative" }}>
      <Canvas
        camera={{ position: [6, 4, 7], fov: 50 }}
        shadows
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping, 
          toneMappingExposure: 1,
          shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap }
        }}
      >
        <color attach="background" args={["#1a2845"]} />
        <fog attach="fog" args={["#1a2845", 10, 22]} />
        
        <ambientLight intensity={0.25} color="#ffd4a3" />
        
        <directionalLight 
          position={[8, 12, 8]} 
          intensity={0.8} 
          color="#ffe8c4" 
          castShadow
          shadow-mapSize={[4096, 4096]}
          shadow-camera-far={25}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
        />
        
        <spotLight
          position={[0, 6, 0]}
          angle={0.5}
          penumbra={1}
          intensity={1.5}
          color="#ffd4a3"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        <pointLight position={[0, 4, 0]} intensity={1.5} color="#ffe8c4" distance={10} castShadow />
        <pointLight position={[0, 2.5, -3]} intensity={3} color="#ffd4a3" distance={8} castShadow />
        <pointLight position={[-3, 1.8, 0]} intensity={1.5} color="#ffc8a3" distance={6} />
        <pointLight position={[3, 1.8, 0]} intensity={1.5} color="#ffc8a3" distance={6} />
        <pointLight position={[0, 1.2, 2]} intensity={1} color="#ffd4a3" distance={5} />
        
        <Suspense fallback={null}>
          <TeaRoom />
          <Environment preset="night" />
          <Sparkles count={25} scale={10} size={1} speed={0.12} opacity={0.2} color="#ffd4a3" />
        </Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={3}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping={true}
          dampingFactor={0.08}
          rotateSpeed={0.6}
          zoomSpeed={1.2}
        />
      </Canvas>
    </div>
  )
}