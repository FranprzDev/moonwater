import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Stars, Sparkles, useTexture } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useSim } from './sim/store'
import { PlantISRU, IceWell, HabitatComplex, Infrastructure, LOOP_PATH, RETURN_PATH } from './Infrastructure'

// textura radial suave para halos
function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  return t
}
const glowTexture = makeGlowTexture()

function Earth() {
  const tex = useTexture('/textures/earth.jpg')
  return (
    <group position={[18, 14, -30]}>
      <mesh>
        <sphereGeometry args={[3.2, 64, 64]} />
        <meshStandardMaterial map={tex} roughness={0.85} />
      </mesh>
      <mesh scale={1.04}>
        <sphereGeometry args={[3.2, 48, 48]} />
        <meshBasicMaterial color="#6fb7ff" transparent opacity={0.18} side={2} />
      </mesh>
      {/* halo atmosférico */}
      <sprite scale={[11, 11, 1]}>
        <spriteMaterial map={glowTexture} color="#4a9fe8" transparent opacity={0.35} depthWrite={false} />
      </sprite>
    </group>
  )
}

function Regolith() {
  const [map, bump] = useTexture(['/textures/moonground.jpg', '/textures/moonground.jpg'])
  map.wrapS = map.wrapT = bump.wrapS = bump.wrapT = THREE.ClampToEdgeWrapping
  map.colorSpace = THREE.SRGBColorSpace
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[34, 96]} />
        <meshStandardMaterial map={map} bumpMap={bump} bumpScale={1.2} color="#bdb8ae" roughness={1} />
      </mesh>
      {[...Array(50)].map((_, i) => {
        const a = i * 2.399
        const r = 13 + (i % 13) * 1.7
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0.12 + (i % 3) * 0.07, Math.sin(a) * r]} rotation={[i % 3, i, i % 5]}>
            <dodecahedronGeometry args={[0.22 + (i % 4) * 0.17, 0]} />
            <meshStandardMaterial color="#77726a" roughness={1} />
          </mesh>
        )
      })}
    </>
  )
}

function Crater() {
  const ice = useSim((s) => s.params.iceContent)
  return (
    <group position={[-10, 0.02, -4]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[6.5, 8, 64]} />
        <meshStandardMaterial color="#9a958d" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6.5, 64]} />
        <meshStandardMaterial color="#26242b" roughness={0.95} />
      </mesh>
      <Sparkles count={Math.round(ice * 8)} scale={[10, 1.5, 10]} size={3} speed={0.3} color="#aef" position={[0, 0.5, 0]} />
      <Text position={[0, 1.2, -8]} fontSize={0.6} color="#cfe0ff" anchorX="center" outlineWidth={0.02}>
        Cráter PSR
      </Text>
    </group>
  )
}

function WaterTank() {
  const bank = useSim((s) => s.bank)
  const level = Math.max(0.02, Math.min(1, bank / 2000))
  return (
    <group position={[2.6, 0, 4.4]}>
      <mesh><cylinderGeometry args={[0.8, 0.8, 2.2, 24, 1, true]} /><meshStandardMaterial color="#9db6c8" transparent opacity={0.35} metalness={0.3} roughness={0.15} /></mesh>
      <mesh position={[0, -(1.1 - level * 1.1), 0]}>
        <cylinderGeometry args={[0.76, 0.76, level * 2.2, 24]} />
        <meshStandardMaterial color="#4fc3ff" emissive="#1177bb" emissiveIntensity={0.7} transparent opacity={0.85} />
      </mesh>
      {/* patas */}
      {[[0.55, 0.55], [-0.55, 0.55], [0.55, -0.55], [-0.55, -0.55]].map(([x, z], i) => (
        <mesh key={i} position={[x, -1.45, z]}>
          <boxGeometry args={[0.07, 0.5, 0.07]} />
          <meshStandardMaterial color="#555" metalness={0.6} />
        </mesh>
      ))}
      <Text position={[0, 1.6, 0]} fontSize={0.32} color="#bfe6ff" anchorX="center">
        {bank.toFixed(0)} kg
      </Text>
    </group>
  )
}

// Flujo de agua dentro de las tuberías reales
function Flow() {
  const m = useSim((s) => s.metrics)
  const dots = useRef([])
  useFrame((s) => {
    if (!dots.current) return
    const speed = 0.06 * Math.max(0.2, m.closure)
    dots.current.forEach((d, i) => {
      if (!d) return
      const t = ((s.clock.elapsedTime * speed + i / dots.current.length) % 1)
      const pts = t < 0.5 ? LOOP_PATH : RETURN_PATH
      const curve = d.userData.curve ||= new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)))
      curve.getPoint((t % 0.5) / 0.5, d.position)
      d.material.color.set(t >= 0.5 ? '#9fe870' : '#5ec8f2')
    })
  })
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} ref={(el) => (dots.current[i] = el)}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshBasicMaterial color="#5ec8f2" toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}

function Rover() {
  const g = useRef()
  const wheels = useRef([])
  const prev = useRef({ x: 0, z: 0 })
  const path = (t) => [-6 + Math.sin(t * 0.11) * 5, -3.5 + Math.sin(t * 0.071) * 3]
  useFrame((s, dt) => {
    if (!g.current) return
    const t = s.clock.elapsedTime
    const [x, z] = path(t)
    const [nx, nz] = path(t + 0.05)
    g.current.position.set(x, 0.45, z)
    let d = Math.atan2(nx - x, nz - z) + Math.PI / 2 - g.current.rotation.y
    while (d > Math.PI) d -= Math.PI * 2
    while (d < -Math.PI) d += Math.PI * 2
    g.current.rotation.y += d * Math.min(1, dt * 6)
    const speed = Math.hypot(x - prev.current.x, z - prev.current.z) / Math.max(dt, 1e-4)
    prev.current = { x, z }
    wheels.current.forEach((w) => { if (w) w.rotation.z += speed * dt * 2 })
  })
  return (
    <group ref={g}>
      <mesh castShadow><boxGeometry args={[1.4, 0.5, 0.9]} /><meshStandardMaterial color="#e0b23e" metalness={0.5} roughness={0.35} /></mesh>
      <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.9, 0.35, 0.7]} /><meshStandardMaterial color="#1c2733" metalness={0.3} roughness={0.2} /></mesh>
      <mesh position={[0.35, 0.75, 0]}><cylinderGeometry args={[0.03, 0.03, 0.55, 8]} /><meshStandardMaterial color="#888" metalness={0.6} /></mesh>
      <mesh position={[0.35, 1.05, 0]}><boxGeometry args={[0.22, 0.14, 0.14]} /><meshStandardMaterial color="#111" metalness={0.5} roughness={0.15} /></mesh>
      {[[-0.55, 0.48], [0.55, 0.48], [-0.55, -0.48], [0.55, -0.48]].map(([x, z], i) => (
        <mesh key={i} ref={(el) => (wheels.current[i] = el)} position={[x, -0.25, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.16, 20]} />
          <meshStandardMaterial color="#222" metalness={0.45} roughness={0.6} />
        </mesh>
      ))}
      <pointLight position={[0, 0.6, 0.9]} intensity={6} distance={6} color="#ffe9b0" />
      <mesh position={[0, 0.65, 0.85]}><sphereGeometry args={[0.07, 8, 8]} /><meshBasicMaterial color="#fff3c0" /></mesh>
      <Sparkles count={12} scale={[1.6, 0.5, 1.6]} size={2.5} speed={0.4} color="#b8b0a2" opacity={0.5} position={[0, -0.3, -0.8]} />
    </group>
  )
}

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [17, 11, 19], fov: 50 }} gl={{ alpha: true }}>
      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#4a6fbf', '#1a1c26', 0.5]} />
      <directionalLight position={[22, 14, 8]} intensity={2.4} color="#fff3e0" castShadow shadow-mapSize={[2048, 2048]} />
      <Stars radius={120} depth={60} count={4000} factor={4} fade speed={0.5} />
      <Earth />
      <Regolith />
      <Crater />
      <IceWell />
      <Rover />
      <PlantISRU />
      <WaterTank />
      <HabitatComplex />
      <Infrastructure />
      <Flow />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.35} mipmapBlur radius={0.8} />
      </EffectComposer>
      <OrbitControls maxPolarAngle={Math.PI / 2.1} minDistance={8} maxDistance={45} />
    </Canvas>
  )
}
