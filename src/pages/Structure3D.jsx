import React, { Suspense, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Sparkles, MeshReflectorMaterial, Text } from "@react-three/drei"
import * as THREE from 'three'

// ENHANCED East River Visualization - Simple and highly visible
const EastRiverVisualization = ({ position }) => {
  const circlesRef = useRef([])
  const groupRef = useRef()
  
  const [circles] = useState(() => {
    const circleData = []
    
    // Create visible clusters
    const clusterConfigs = [
      { x: -0.4, y: 0.3, density: 50, spread: 0.2, sizeRange: [0.03, 0.08] },
      { x: 0.2, y: 0.35, density: 45, spread: 0.18, sizeRange: [0.035, 0.09] },
      { x: 0, y: 0.1, density: 55, spread: 0.25, sizeRange: [0.028, 0.075] },
      { x: -0.3, y: -0.1, density: 48, spread: 0.19, sizeRange: [0.032, 0.082] },
      { x: 0.35, y: -0.08, density: 42, spread: 0.17, sizeRange: [0.03, 0.08] },
      { x: -0.1, y: -0.28, density: 40, spread: 0.16, sizeRange: [0.035, 0.09] },
    ]
    
    clusterConfigs.forEach((cluster, clusterIndex) => {
      for (let i = 0; i < cluster.density; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * cluster.spread
        
        circleData.push({
          id: `cluster-${clusterIndex}-${i}`,
          position: [
            cluster.x + Math.cos(angle) * radius,
            cluster.y + Math.sin(angle) * radius,
            0.05 + Math.random() * 0.1
          ],
          size: cluster.sizeRange[0] + Math.random() * (cluster.sizeRange[1] - cluster.sizeRange[0]),
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.0,
        })
      }
    })
    
    // More scattered particles
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 0.2 + Math.random() * 0.4
      circleData.push({
        id: `scattered-${i}`,
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0.06 + Math.random() * 0.1
        ],
        size: 0.025 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
        speed: 0.45 + Math.random() * 0.8,
      })
    }
    
    return circleData
  })
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    
    if (groupRef.current) {
      const breathe = Math.sin(time * 0.6) * 0.02
      groupRef.current.scale.setScalar(1 + breathe)
    }
    
    circlesRef.current.forEach((circle, i) => {
      if (circle && circles[i]) {
        const data = circles[i]
        
        const floatY = Math.sin(time * data.speed * 0.7 + data.phase) * 0.002
        const floatX = Math.cos(time * data.speed * 0.5 + data.phase) * 0.0015
        circle.position.y += floatY
        circle.position.x += floatX
        
        const pulse = Math.sin(time * 2.2 + data.phase) * 0.5 + 0.5
        circle.scale.setScalar(data.size * (0.85 + pulse * 0.3))
      }
    })
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Dark background panel */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[1.8, 1.5]} />
        <meshBasicMaterial
          color="#0a1f12"
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Title */}
      <Text
        position={[0, 0.62, 0.02]}
        fontSize={0.095}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.008}
        outlineColor="#0d2515"
      >
        EAST RIVER
      </Text>
      
      {/* Subheading */}
      <Text
        position={[0, 0.48, 0.02]}
        fontSize={0.055}
        color="#52d98f"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.004}
        outlineColor="#0d2515"
        maxWidth={1.6}
        textAlign="center"
      >
        Microplastic Contamination
      </Text>
      
      {/* Main statistic */}
      <Text
        position={[0, -0.38, 0.02]}
        fontSize={0.22}
        color="#2ecc71"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.012}
        outlineColor="#0d2515"
        font="bold"
      >
        556,484
      </Text>
      
      {/* Unit description */}
      <Text
        position={[0, -0.60, 0.02]}
        fontSize={0.07}
        color="#3dd68c"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.005}
        outlineColor="#0d2515"
      >
        particles / km²
      </Text>

      {/* Green circles - BRIGHT AND VISIBLE */}
      {circles.map((circle, i) => (
        <mesh
          key={circle.id}
          ref={(el) => (circlesRef.current[i] = el)}
          position={circle.position}
        >
          <sphereGeometry args={[circle.size, 16, 16]} />
          <meshBasicMaterial
            color="#00ff00"
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}
      
      {/* Bright lighting */}
      <pointLight position={[0, 0.3, 0.4]} color="#2ecc71" intensity={5} distance={3} />
      <pointLight position={[-0.5, 0.4, 0.3]} color="#3dd68c" intensity={4} distance={2.5} />
      <pointLight position={[0.5, 0.2, 0.3]} color="#27ae60" intensity={4} distance={2.5} />
      
      {/* Sparkles */}
      <Sparkles
        count={40}
        scale={[1.5, 1.2, 0.4]}
        size={2}
        speed={0.3}
        opacity={0.6}
        color="#2ecc71"
      />
    </group>
  )
}

// Microplastic Data Visualization Component - Pink circles
const MicroplasticVisualization = ({ position }) => {
  const circlesRef = useRef([])
  
  const circles = []
  
  // Create 6 major clusters with different densities - MUCH DENSER
  const clusterConfigs = [
    { x: -0.8, y: 0.6, density: 60, spread: 0.4, sizeRange: [0.04, 0.14], opacity: [0.5, 0.95] },
    { x: 0.5, y: 0.8, density: 50, spread: 0.35, sizeRange: [0.05, 0.17], opacity: [0.4, 0.85] },
    { x: 0, y: 0, density: 75, spread: 0.5, sizeRange: [0.03, 0.12], opacity: [0.6, 1.0] },
    { x: -0.6, y: -0.5, density: 55, spread: 0.38, sizeRange: [0.045, 0.15], opacity: [0.45, 0.90] },
    { x: 0.7, y: -0.3, density: 58, spread: 0.42, sizeRange: [0.035, 0.13], opacity: [0.5, 0.98] },
    { x: 0.2, y: 0.5, density: 45, spread: 0.3, sizeRange: [0.06, 0.18], opacity: [0.4, 0.80] }
  ]
  
  clusterConfigs.forEach((cluster, clusterIndex) => {
    for (let i = 0; i < cluster.density; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * cluster.spread
      circles.push({
        id: `cluster-${clusterIndex}-${i}`,
        position: [
          cluster.x + Math.cos(angle) * radius,
          cluster.y + Math.sin(angle) * radius,
          (Math.random() - 0.5) * 0.4
        ],
        size: cluster.sizeRange[0] + Math.random() * (cluster.sizeRange[1] - cluster.sizeRange[0]),
        opacity: cluster.opacity[0] + Math.random() * (cluster.opacity[1] - cluster.opacity[0]),
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random()
      })
    }
  })
  
  // Add scattered individual circles between clusters - MUCH MORE DENSE
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 0.4 + Math.random() * 0.9
    circles.push({
      id: `scattered-${i}`,
      position: [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 0.5
      ],
      size: 0.03 + Math.random() * 0.09,
      opacity: 0.3 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.8
    })
  }
  
  useFrame((state) => {
    circlesRef.current.forEach((circle, i) => {
      if (circle && circles[i]) {
        const data = circles[i]
        const time = state.clock.getElapsedTime()
        
        // Gentle floating animation
        const floatY = Math.sin(time * data.speed + data.phase) * 0.0015
        const floatX = Math.cos(time * data.speed * 0.6 + data.phase) * 0.001
        circle.position.y += floatY
        circle.position.x += floatX
        
        // Subtle pulsing
        const pulse = Math.sin(time * 1.5 + data.phase) * 0.5 + 0.5
        circle.scale.setScalar(data.size * (0.9 + pulse * 0.2))
        
        // Breathing opacity
        const breathe = Math.sin(time * 1.2 + data.phase * 1.5) * 0.5 + 0.5
        circle.material.opacity = data.opacity * (0.75 + breathe * 0.25)
        circle.material.emissiveIntensity = 0.5 + breathe * 0.4
      }
    })
  })

  return (
    <group position={position}>
      {/* Title text */}
      <Text
        position={[-1.2, 1.4, 0]}
        fontSize={0.14}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        Battery Park Coffee
      </Text>
      
      {/* Main number */}
      <Text
        position={[0, -1.3, 0]}
        fontSize={0.28}
        color="#ffb3c1"
        anchorX="center"
        anchorY="middle"
      >
        15,000
      </Text>
      
      {/* Description */}
      <Text
        position={[0, -1.65, 0]}
        fontSize={0.11}
        color="#ffc0cb"
        anchorX="center"
        anchorY="middle"
      >
        microplastics / cup
      </Text>

      {/* All circles - pink to match door color */}
      {circles.map((circle, i) => (
        <mesh
          key={circle.id}
          ref={(el) => (circlesRef.current[i] = el)}
          position={circle.position}
        >
          <sphereGeometry args={[circle.size, 16, 16]} />
          <meshStandardMaterial
            color="#ff99b8"
            emissive="#ff85a1"
            emissiveIntensity={0.9}
            transparent
            opacity={circle.opacity}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      ))}
      
      {/* Atmospheric lighting - pink to match door - BRIGHTER */}
      <pointLight position={[0, 0, 0.8]} color="#ffb3c1" intensity={5} distance={6} />
      <pointLight position={[-0.8, 0.6, 0.5]} color="#ffc0cb" intensity={3.5} distance={4} />
      <pointLight position={[0.5, 0.8, 0.5]} color="#ff85a1" intensity={3} distance={3.5} />
    </group>
  )
}

// Enhanced Shoji Door with proper coverage and constrained sliding
const ShojiDoor = ({ position, isLeft, width = 1.95, height = 3.2, onHoverChange }) => {
  const doorGroupRef = useRef()
  const doorPanelRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  
  useFrame((state) => {
    if (doorGroupRef.current) {
      // Constrained sliding - entire door group moves together
      const maxSlide = width * 0.85 // Keep doors within house margins
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
      {/* Moving door group - contains panel and handle */}
      <group ref={doorGroupRef}>
        {/* Door panel - larger to properly cover the entrance */}
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
        
        {/* Vertical grid lines - more detailed */}
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
        
        {/* Horizontal grid lines - more detailed */}
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
        
        {/* Door frame - attached to door */}
        <mesh position={[0, 0, -0.055]}>
          <boxGeometry args={[width + 0.05, height + 0.05, 0.08]} />
          <meshStandardMaterial 
            color="#d4c4a8" 
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
        
        {/* Handle - attached to door so it moves with it */}
        <mesh position={[isLeft ? width/3 : -width/3, 0, 0.08]}>
          <cylinderGeometry args={[0.03, 0.03, 0.18, 12]} />
          <meshStandardMaterial 
            color="#3d2817" 
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        
        {/* Handle detail */}
        <mesh position={[isLeft ? width/3 : -width/3, 0, 0.12]}>
          <torusGeometry args={[0.04, 0.01, 8, 16]} />
          <meshStandardMaterial 
            color="#2d2420" 
            roughness={0.5}
            metalness={0.2}
          />
        </mesh>
      </group>
      
      {/* Fixed frame elements - don't move with door */}
      {/* Top frame beam */}
      <mesh position={[0, height/2 + 0.08, 0]}>
        <boxGeometry args={[width * 2.2, 0.15, 0.15]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.7} />
      </mesh>
      
      {/* Side frame posts */}
      <mesh position={[width + 0.08, 0, 0]}>
        <boxGeometry args={[0.15, height + 0.3, 0.15]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.7} />
      </mesh>
      <mesh position={[-width - 0.08, 0, 0]}>
        <boxGeometry args={[0.15, height + 0.3, 0.15]} />
        <meshStandardMaterial color="#d4c4a8" roughness={0.7} />
      </mesh>
      
      {/* Glow effect when hovered or open */}
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
        <meshStandardMaterial 
          color="#5c4033" 
          roughness={0.5}
          metalness={0.1}
          emissive="#d4a574" 
          emissiveIntensity={0.1} 
        />
      </mesh>
      
      <mesh position={[0, 0.7, 0]} ref={(el) => (roofRefs.current[1] = el)} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[3.6, 0.45, 4]} />
        <meshStandardMaterial 
          color="#6b5438" 
          roughness={0.5}
          metalness={0.15}
          emissive="#d4a574" 
          emissiveIntensity={0.12} 
        />
      </mesh>
      
      <mesh position={[0, 1.3, 0]} ref={(el) => (roofRefs.current[2] = el)} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.8, 0.4, 4]} />
        <meshStandardMaterial 
          color="#7a6447" 
          roughness={0.4}
          metalness={0.2}
          emissive="#e8c4a0" 
          emissiveIntensity={0.14} 
        />
      </mesh>
      
      <mesh position={[0, 1.85, 0]} ref={(el) => (roofRefs.current[3] = el)} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.1, 0.35, 4]} />
        <meshStandardMaterial 
          color="#8b7355" 
          roughness={0.3}
          metalness={0.25}
          emissive="#f5d4b0" 
          emissiveIntensity={0.16} 
        />
      </mesh>
      
      <mesh position={[0, 2.35, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.5, 8]} />
        <meshStandardMaterial 
          color="#a68a64" 
          metalness={0.6} 
          roughness={0.2}
          emissive="#ffd4a3" 
          emissiveIntensity={0.3} 
        />
      </mesh>
      
      <mesh position={[0, 2.7, 0]} castShadow>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#c4a574" 
          metalness={0.7} 
          roughness={0.15}
          emissive="#ffe8c4" 
          emissiveIntensity={0.4} 
        />
      </mesh>
      
      <pointLight position={[0, 0.5, 0]} color="#ffd4a3" intensity={1.2} distance={10} castShadow />
      <pointLight position={[0, 2.7, 0]} color="#ffe8c4" intensity={0.8} distance={5} />
    </group>
  )
}

// Improved Tatami Floor with better hover detection
const TatamiFloor = ({ onTatamiHover }) => {
  const [hoveredMat, setHoveredMat] = useState(null)
  const groupRef = useRef()
  
  return (
    <group ref={groupRef}>
      {/* Base reflector floor */}
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
      
      {/* Individual tatami mats - flat planes with better hover area */}
      {[[-2, 2], [0, 2], [2, 2], [-2, 0], [0, 0], [2, 0], [-2, -2], [0, -2], [2, -2]].map((pos, i) => (
        <group key={i}>
          <mesh 
            position={[pos[0], 0.01, pos[1]]} 
            rotation={[-Math.PI / 2, 0, 0]} 
            receiveShadow
            onPointerEnter={(e) => {
              e.stopPropagation()
              setHoveredMat(i)
              if (onTatamiHover) onTatamiHover(true)
              document.body.style.cursor = 'pointer'
            }}
            onPointerLeave={(e) => {
              e.stopPropagation()
              setHoveredMat(null)
              if (onTatamiHover) onTatamiHover(false)
              document.body.style.cursor = 'default'
            }}
          >
            <planeGeometry args={[1.9, 1.9]} />
            <meshStandardMaterial 
              color={hoveredMat === i ? "#7dd87d" : "#c4a574"}
              roughness={0.95} 
              emissive={hoveredMat === i ? "#2ecc71" : "#ffd4a3"}
              emissiveIntensity={hoveredMat === i ? 0.5 : 0.05} 
            />
          </mesh>
          {/* Border lines */}
          <lineSegments position={[pos[0], 0.02, pos[1]]} rotation={[-Math.PI / 2, 0, 0]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.9, 1.9)]} />
            <lineBasicMaterial color="#8b6f47" linewidth={2} />
          </lineSegments>
          
          {/* Subtle green glow when hovered */}
          {hoveredMat === i && (
            <pointLight 
              position={[pos[0], 0.15, pos[1]]} 
              color="#2ecc71" 
              intensity={2} 
              distance={2.5} 
            />
          )}
        </group>
      ))}
    </group>
  )
}

const TeaTable = ({ onTableHover }) => {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [tableHovered, setTableHovered] = useState(false)
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
      {/* Table top - sitting on floor - NOW WITH HOVER DETECTION */}
      <mesh 
        position={[0, 0.12, 0]} 
        castShadow 
        receiveShadow
        onPointerEnter={(e) => {
          e.stopPropagation()
          setTableHovered(true)
          if (onTableHover) onTableHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={(e) => {
          e.stopPropagation()
          setTableHovered(false)
          if (onTableHover) onTableHover(false)
          document.body.style.cursor = 'default'
        }}
      >
        <boxGeometry args={[1.8, 0.12, 1.2]} />
        <meshStandardMaterial 
          color={tableHovered ? "#2ecc71" : "#5c4033"}
          roughness={0.4}
          metalness={0.05}
          emissive={tableHovered ? "#2ecc71" : "#000000"}
          emissiveIntensity={tableHovered ? 0.6 : 0}
        />
      </mesh>
      
      {/* Table legs */}
      {[[-0.8, -0.5], [0.8, -0.5], [-0.8, 0.5], [0.8, 0.5]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.06, pos[1]]} castShadow>
          <boxGeometry args={[0.08, 0.12, 0.08]} />
          <meshStandardMaterial color="#4a3822" roughness={0.6} />
        </mesh>
      ))}
      
      {/* VISUAL INDICATOR when table is hovered */}
      {tableHovered && (
        <>
          <pointLight position={[0, 0.5, 0]} color="#00ff00" intensity={5} distance={3} />
          <Sparkles 
            count={50} 
            scale={[2, 1, 1.5]} 
            size={3} 
            speed={0.5} 
            color="#00ff00" 
            opacity={0.8}
          />
        </>
      )}
      
      {/* Teapot - RED/MAROON */}
      <mesh 
        ref={teapotRef}
        position={[0, 0.25, 0]} 
        castShadow
        onPointerEnter={() => {
          setHoveredItem('teapot')
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={() => {
          setHoveredItem(null)
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#8B1538" 
          roughness={0.3}
          metalness={0.4}
          emissive="#A41E3E"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Teapot spout */}
      <mesh position={[0.15, 0.25, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.15, 8]} />
        <meshStandardMaterial color="#8B1538" roughness={0.3} metalness={0.4} />
      </mesh>
      
      {/* Teapot handle */}
      <mesh position={[-0.15, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.08, 0.015, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#8B1538" roughness={0.3} metalness={0.4} />
      </mesh>
      
      {/* Tea cups - RED/MAROON */}
      {[[0.4, 0.3], [-0.4, 0.3], [0.4, -0.3], [-0.4, -0.3]].map((pos, i) => (
        <mesh 
          key={i}
          ref={(el) => (cupRefs.current[i] = el)}
          position={[pos[0], 0.21, pos[1]]} 
          castShadow
          onPointerEnter={() => {
            setHoveredItem(`cup${i}`)
            document.body.style.cursor = 'pointer'
          }}
          onPointerLeave={() => {
            setHoveredItem(null)
            document.body.style.cursor = 'default'
          }}
        >
          <cylinderGeometry args={[0.05, 0.04, 0.08, 12]} />
          <meshStandardMaterial 
            color="#A41E3E" 
            roughness={0.4}
            metalness={0.3}
            emissive="#C4315B"
            emissiveIntensity={0.25}
          />
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
          <meshStandardMaterial
            color="#f5e8d8"
            emissive="#ffd4a3"
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
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
        <meshStandardMaterial
          color="#f5e8d8"
          emissive="#ffd4a3"
          emissiveIntensity={0.4}
          transparent
          opacity={0.85}
        />
      </mesh>
      
      <mesh position={[0, 0.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.18, 0.15, 4]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} />
      </mesh>
      
      <pointLight
        ref={lightRef}
        position={[0, 0.45, 0]}
        color="#ffd4a3"
        intensity={1}
        distance={3}
        castShadow
      />
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
        onPointerEnter={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial 
          color={hovered ? color : "#8b5a5a"}
          roughness={0.9}
          emissive={color}
          emissiveIntensity={0}
        />
      </mesh>
      
      {hovered && (
        <pointLight 
          position={[position[0], position[1] + 0.1, position[2]]} 
          color={color} 
          intensity={0.8} 
          distance={1.2} 
        />
      )}
    </>
  )
}

// TeaRoom component - main scene
const TeaRoom = () => {
  const [leftDoorHovered, setLeftDoorHovered] = useState(false)
  const [rightDoorHovered, setRightDoorHovered] = useState(false)
  const [tatamiHovered, setTatamiHovered] = useState(false)
  const [tableHovered, setTableHovered] = useState(false)
  
  return (
    <group>
      <TatamiFloor onTatamiHover={setTatamiHovered} />
      <TeaTable onTableHover={setTableHovered} />
      
      {/* DEBUG INDICATOR - Shows where to hover */}
      <Text
        position={[0, 3.8, -0.5]}
        fontSize={0.15}
        color="#00ff00"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        ← HOVER OVER THE TEA TABLE FOR DATA →
      </Text>
      
      {/* Back wall */}
      <mesh position={[0, 1.5, -3.5]} receiveShadow>
        <boxGeometry args={[7, 3, 0.2]} />
        <meshStandardMaterial color="#2d2420" roughness={0.9} />
      </mesh>
      
      {/* Glowing panels on back wall */}
      {[-2.5, -0.8, 0.8, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 1.8, -3.45]} castShadow>
          <boxGeometry args={[1.2, 1.4, 0.05]} />
          <meshStandardMaterial
            color="#ffd4a3"
            emissive="#ffb87a"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
      
      {/* Left wall */}
      <mesh position={[-3.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[7, 3, 0.2]} />
        <meshStandardMaterial color="#2d2420" roughness={0.9} />
      </mesh>
      
      {/* Right wall */}
      <mesh position={[3.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[7, 3, 0.2]} />
        <meshStandardMaterial color="#2d2420" roughness={0.9} />
      </mesh>
      
      {/* Panel on right wall */}
      <mesh position={[3.45, 1.8, -1.5]} rotation={[0, -Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.2, 1.2, 0.05]} />
        <meshStandardMaterial
          color="#ffd4a3"
          emissive="#ffb87a"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      <WallShelf position={[-2.5, 1.5, -3.4]} />
      
      {/* Enhanced sliding doors */}
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
      
      {/* Battery Park Data Visualization - LEFT DOOR */}
      {leftDoorHovered && (
        <MicroplasticVisualization position={[-5, 2.5, 5]} />
      )}
      
      {/* Battery Park Data Visualization - RIGHT DOOR */}
      {rightDoorHovered && (
        <MicroplasticVisualization position={[5, 2.5, 5]} />
      )}
      
      {/* East River Data Visualization - TABLE HOVER - FLOATING ABOVE TABLE */}
      {tableHovered && (
        <group position={[0, 2.5, -0.5]}>
          <EastRiverVisualization position={[0, 0, 0]} />
          {/* Massive bright lighting */}
          <pointLight position={[0, 0, 1]} color="#00ff00" intensity={20} distance={10} />
          <pointLight position={[-1, 0.5, 0.5]} color="#2ecc71" intensity={15} distance={8} />
          <pointLight position={[1, 0.5, 0.5]} color="#3dd68c" intensity={15} distance={8} />
          <pointLight position={[0, -0.5, 0.5]} color="#27ae60" intensity={12} distance={7} />
          {/* Extra sparkles for visibility */}
          <Sparkles 
            count={100} 
            scale={[3, 3, 3]} 
            size={4} 
            speed={0.5} 
            color="#00ff00" 
            opacity={0.9}
          />
        </group>
      )}
      
      {/* ALSO show when hovering tatami - just in case */}
      {tatamiHovered && (
        <group position={[0, 2.5, 0]}>
          <EastRiverVisualization position={[0, 0, 0]} />
          {/* Massive bright lighting */}
          <pointLight position={[0, 0, 1]} color="#00ff00" intensity={20} distance={10} />
          <pointLight position={[-1, 0.5, 0.5]} color="#2ecc71" intensity={15} distance={8} />
          <pointLight position={[1, 0.5, 0.5]} color="#3dd68c" intensity={15} distance={8} />
          <Sparkles 
            count={100} 
            scale={[3, 3, 3]} 
            size={4} 
            speed={0.5} 
            color="#00ff00" 
            opacity={0.9}
          />
        </group>
      )}
      
      <PagodaRoof />
      
      {/* Ceiling */}
      <mesh position={[0, 3, 0]} receiveShadow>
        <boxGeometry args={[7, 0.2, 7]} />
        <meshStandardMaterial color="#4a3822" roughness={0.7} />
      </mesh>
      
      {/* Ceiling beams */}
      {[-2, -1, 0, 1, 2].map((z, i) => (
        <mesh key={i} position={[0, 3.08, z * 1.5]} castShadow>
          <boxGeometry args={[7, 0.12, 0.15]} />
          <meshStandardMaterial color="#3d2817" roughness={0.6} />
        </mesh>
      ))}
      
      {/* Corner pillars */}
      {[[-3.4, -3.4], [3.4, -3.4], [-3.4, 3.4], [3.4, 3.4]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 1.5, pos[1]]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 3, 0.2]} />
          <meshStandardMaterial color="#2d2420" roughness={0.7} />
        </mesh>
      ))}
      
      {/* Lanterns on shelf */}
      <Lantern position={[-2.9, 1.58, -3.25]} />
      <Lantern position={[-2.1, 1.58, -3.25]} />
      
      {/* Stone lantern on floor */}
      <StoneLantern position={[-2.5, 0, 2]} />
      
      {/* Cushions on floor */}
      <Cushion position={[-0.8, 0.06, 0.8]} color="#a86a6a" />
      <Cushion position={[0.8, 0.06, 0.8]} color="#9b5a5a" />
      <Cushion position={[-0.3, 0.06, -1.5]} color="#b87a7a" />
      <Cushion position={[0.3, 0.06, -1.5]} color="#8b4a4a" />
      <Cushion position={[-0.8, 0.06, -1.5]} color="#a86a6a" />
      <Cushion position={[0.8, 0.06, -1.5]} color="#9b5a5a" />
    </group>
  )
}

// Main component
export default function Structure3D() {
  return (
    <div style={{ height: "100vh", width: "100vw", background: "#1a2845", position: "fixed", top: 0, left: 0 }}>
      <Canvas
        camera={{ position: [6, 4, 7], fov: 50, near: 0.1, far: 1000 }}
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