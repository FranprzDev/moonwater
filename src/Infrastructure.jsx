import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { useSim } from './sim/store'

export const LOOP_PATH = [[-9.5, 0.7, -5], [-4, 0.7, -1], [0, 0.7, 2], [4.5, 0.8, 2.6], [8, 0.7, 3]]
export const RETURN_PATH = [[8, 0.7, 4.2], [4, 1.1, 4.8], [0, 1.1, 4.4], [-4, 0.7, 1.6], [-8.5, 0.7, -2.5]]

function Pipe({ points, radius = 0.13, color = '#aab4bd' }) {
  const geom = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
    return new THREE.TubeGeometry(curve, 72, radius, 12)
  }, [points, radius])
  return (
    <mesh geometry={geom} castShadow>
      <meshStandardMaterial color={color} metalness={0.75} roughness={0.28} />
    </mesh>
  )
}

function PipeStanchions({ points }) {
  const items = []
  for (let i = 0; i < points.length - 1; i++) {
    const [a, b] = [points[i], points[i + 1]]
    for (let t = 0.12; t < 1; t += 0.28) items.push([a[0] + (b[0] - a[0]) * t, a[2] + (b[2] - a[2]) * t])
  }
  return items.map(([x, z], i) => (
    <mesh key={i} position={[x, 0.22, z]}>
      <boxGeometry args={[0.09, 0.44, 0.09]} />
      <meshStandardMaterial color="#5d666f" metalness={0.6} roughness={0.5} />
    </mesh>
  ))
}

function CryoTank({ position }) {
  return (
    <group position={position}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.75, 1.6, 8, 24]} />
        <meshStandardMaterial color="#dfe4ea" metalness={0.85} roughness={0.18} />
      </mesh>
      {[-0.7, 0, 0.7].map((x, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, x]}>
          <torusGeometry args={[0.76, 0.03, 8, 32]} />
          <meshStandardMaterial color="#9aa3ad" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {[[-0.4, 0.4], [0.4, 0.4], [-0.4, -0.4], [0.4, -0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, -1.05, z]}>
          <boxGeometry args={[0.06, 0.7, 0.06]} />
          <meshStandardMaterial color="#555" metalness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function RadiatorPanel({ position }) {
  return (
    <group position={position}>
      <mesh><boxGeometry args={[0.05, 1.6, 2.2]} /><meshStandardMaterial color="#eef1f4" metalness={0.3} roughness={0.5} side={2} /></mesh>
      <mesh position={[0, -1.05, 0]}><boxGeometry args={[0.08, 0.5, 0.08]} /><meshStandardMaterial color="#555" /></mesh>
    </group>
  )
}

export function PlantISRU() {
  const running = useSim((s) => s.running)
  return (
    <group position={[0, 0, 2]}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[1.15, 1.35, 2, 20]} />
        <meshStandardMaterial color="#c3c9d2" metalness={0.75} roughness={0.28} />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.38, 1.38, 0.35, 20, 1, true]} />
        <meshStandardMaterial color="#d9822b" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.25, 0]}>
        <sphereGeometry args={[0.9, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#dde2e9" metalness={0.7} roughness={0.3} />
      </mesh>
      {[['#ff5555', 0.4], [running ? '#55ff88' : '#554433', 0], ['#5599ff', -0.4]].map(([c, x], i) => (
        <mesh key={i} position={[x, 2.62, 0.5]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={c} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[1.8, 0.6, -0.6]} castShadow>
        <boxGeometry args={[1, 1.2, 0.7]} />
        <meshStandardMaterial color="#6fb7de" metalness={0.5} roughness={0.3} emissive="#1a4a6e" emissiveIntensity={running ? 0.5 : 0.1} />
      </mesh>
      <CryoTank position={[-2.6, 1.05, -1.4]} />
      <CryoTank position={[-2.6, 1.05, 1.4]} />
      <RadiatorPanel position={[1.4, 2.1, 1.6]} />
      <RadiatorPanel position={[-0.6, 2.1, 2.4]} />
      {running && (
        <Text position={[0, 3.4, 0]} fontSize={0.45} color="#eaf2ff" anchorX="center" outlineWidth={0.02}>
          Planta ISRU
        </Text>
      )}
    </group>
  )
}

export function IceWell() {
  const ice = useSim((s) => s.params.iceContent)
  return (
    <group position={[-11, 0.02, -5]}>
      {[[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.4, z]}>
          <boxGeometry args={[0.09, 2.8, 0.09]} />
          <meshStandardMaterial color="#c8b03a" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[2, 0.16, 2]} />
        <meshStandardMaterial color="#e0b23e" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* sonda de perforación */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 3.4, 10]} />
        <meshStandardMaterial color="#666" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* motor de la sonda */}
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>
      <pointLight position={[0, 2.8, 0]} intensity={4} distance={5} color="#ffe9b0" />
      <Text position={[0, 3.9, 0]} fontSize={0.42} color="#cfe0ff" anchorX="center" outlineWidth={0.02}>
        Pozo de hielo · {ice.toFixed(1)}%
      </Text>
    </group>
  )
}

export function HabitatComplex() {
  return (
    <group position={[9, 0, 3.5]}>
      {/* módulo principal */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 1.4, 0]} castShadow rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[1.6, 3, 8, 24]} />
          <meshStandardMaterial color="#efece4" roughness={0.55} />
        </mesh>
        {/* anillos de refuerzo */}
        {[-1.4, 0, 1.4].map((x, i) => (
          <mesh key={i} position={[x, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.62, 0.04, 8, 32]} />
            <meshStandardMaterial color="#c9c4ba" roughness={0.6} />
          </mesh>
        ))}
        {/* ventanas iluminadas */}
        {[-0.9, 0.9].map((z, i) => (
          <mesh key={i} position={[0, 1.4, 1.58]}>
            <circleGeometry args={[0.26, 24]} />
            <meshBasicMaterial color="#ffd98f" />
          </mesh>
        ))}
      </group>
      {/* túnel de acople a invernadero */}
      <mesh position={[-2.6, 1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.65, 0.65, 1.6, 20]} />
        <meshStandardMaterial color="#d5d1c8" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* invernadero (domo transparente con verde adentro) */}
      <group position={[-4.2, 0, 0]}>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[1.1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#bfe8d2" transparent opacity={0.4} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.6, 0.3, 0.9]} />
          <meshStandardMaterial color="#3f7a4a" roughness={0.9} />
        </mesh>
        <pointLight position={[0, 1, 0]} intensity={3} distance={3.5} color="#aaffcc" />
      </group>
      {/* airlock lateral */}
      <mesh position={[2.4, 0.8, 0.6]}>
        <sphereGeometry args={[0.7, 20, 16]} />
        <meshStandardMaterial color="#cfcabf" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* campo solar */}
      {[0, 1, 2].map((i) => (
        <group key={i} position={[3.6 + i * 2.2, 0, -2.6]} rotation={[-0.55, 0, 0]}>
          <mesh>
            <boxGeometry args={[1.8, 0.05, 1.2]} />
            <meshStandardMaterial color="#16295e" metalness={0.85} roughness={0.15} emissive="#12245c" emissiveIntensity={0.35} />
          </mesh>
          {/* celdas */}
          <gridHelper args={[1.8, 6, '#2c4a9e', '#2c4a9e']} position={[0, 0.031, 0]} />
          <mesh position={[0, -0.75, 0]}>
            <boxGeometry args={[0.06, 1.5, 0.06]} />
            <meshStandardMaterial color="#666" metalness={0.6} />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 1.6, 3]} intensity={4} distance={5} color="#ffd98f" />
    </group>
  )
}

export function Infrastructure() {
  return (
    <>
      <Pipe points={LOOP_PATH} />
      <Pipe points={RETURN_PATH} color="#8fce9e" />
      <PipeStanchions points={LOOP_PATH} />
      <PipeStanchions points={RETURN_PATH} />
    </>
  )
}
