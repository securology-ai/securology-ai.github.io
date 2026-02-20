import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMotion } from '../../context/MotionContext'

/* ─── Geo Helpers ─── */
const GLOBE_R = 1.8
const DEG2RAD = Math.PI / 180

function latLngToVec3(lat: number, lng: number, r = GLOBE_R): THREE.Vector3 {
  const phi = (90 - lat) * DEG2RAD
  const theta = (lng + 180) * DEG2RAD
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

/* ─── City Database ─── */
interface City {
  name: string
  lat: number
  lng: number
  threat: boolean // true = attacker origin
}

const CITIES: City[] = [
  // Threat origins
  { name: 'Moscow', lat: 55.75, lng: 37.62, threat: true },
  { name: 'Beijing', lat: 39.9, lng: 116.4, threat: true },
  { name: 'Pyongyang', lat: 39.03, lng: 125.75, threat: true },
  { name: 'Tehran', lat: 35.69, lng: 51.39, threat: true },
  { name: 'Lagos', lat: 6.52, lng: 3.38, threat: true },
  { name: 'Sao Paulo', lat: -23.55, lng: -46.63, threat: true },
  { name: 'Hanoi', lat: 21.03, lng: 105.85, threat: true },
  { name: 'Bucharest', lat: 44.43, lng: 26.1, threat: true },
  // Target cities
  { name: 'New York', lat: 40.71, lng: -74.01, threat: false },
  { name: 'Washington', lat: 38.91, lng: -77.04, threat: false },
  { name: 'London', lat: 51.51, lng: -0.13, threat: false },
  { name: 'Frankfurt', lat: 50.11, lng: 8.68, threat: false },
  { name: 'Tokyo', lat: 35.68, lng: 139.69, threat: false },
  { name: 'Sydney', lat: -33.87, lng: 151.21, threat: false },
  { name: 'Dubai', lat: 25.2, lng: 55.27, threat: false },
  { name: 'Singapore', lat: 1.35, lng: 103.82, threat: false },
  { name: 'Toronto', lat: 43.65, lng: -79.38, threat: false },
  { name: 'Riyadh', lat: 24.71, lng: 46.67, threat: false },
  { name: 'Paris', lat: 48.86, lng: 2.35, threat: false },
  { name: 'Seoul', lat: 37.57, lng: 126.98, threat: false },
  { name: 'Mumbai', lat: 19.08, lng: 72.88, threat: false },
  { name: 'Berlin', lat: 52.52, lng: 13.41, threat: false },
]

const THREAT_CITIES = CITIES.filter((c) => c.threat)
const TARGET_CITIES = CITIES.filter((c) => !c.threat)

/* ─── Globe Wireframe ─── */
function GlobeWireframe() {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.03
  })

  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = []

    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: THREE.Vector3[] = []
      for (let lng = 0; lng <= 360; lng += 4) {
        pts.push(latLngToVec3(lat, lng))
      }
      lines.push(pts)
    }

    // Longitude lines
    for (let lng = 0; lng < 360; lng += 30) {
      const pts: THREE.Vector3[] = []
      for (let lat = -90; lat <= 90; lat += 4) {
        pts.push(latLngToVec3(lat, lng))
      }
      lines.push(pts)
    }

    return lines
  }, [])

  return (
    <group ref={ref}>
      {/* Solid dark sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_R * 0.99, 48, 48]} />
        <meshBasicMaterial color="#080812" transparent opacity={0.95} />
      </mesh>

      {/* Grid lines */}
      {gridLines.map((pts, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={pts.length}
              array={new Float32Array(pts.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00e5ff" transparent opacity={0.06} />
        </line>
      ))}

      {/* Equator highlight */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={91}
            array={
              new Float32Array(
                Array.from({ length: 91 }, (_, i) => {
                  const v = latLngToVec3(0, i * 4)
                  return [v.x, v.y, v.z]
                }).flat()
              )
            }
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00e5ff" transparent opacity={0.15} />
      </line>

      {/* Outer glow ring */}
      <mesh>
        <sphereGeometry args={[GLOBE_R * 1.01, 48, 48]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

/* ─── City Nodes ─── */
function CityNodes() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.03
  })

  const cityData = useMemo(
    () =>
      CITIES.map((c) => ({
        ...c,
        pos: latLngToVec3(c.lat, c.lng, GLOBE_R * 1.005),
        phase: Math.random() * Math.PI * 2,
      })),
    []
  )

  return (
    <group ref={groupRef}>
      {cityData.map((c) => (
        <CityDot key={c.name} position={c.pos} threat={c.threat} phase={c.phase} />
      ))}
    </group>
  )
}

function CityDot({
  position,
  threat,
  phase,
}: {
  position: THREE.Vector3
  threat: boolean
  phase: number
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const s = 1 + Math.sin(clock.getElapsedTime() * 3 + phase) * 0.3
    ref.current.scale.setScalar(s)
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial
        color={threat ? '#ff5252' : '#00e5ff'}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

/* ─── Attack Arcs ─── */
interface AttackArc {
  id: number
  from: THREE.Vector3
  to: THREE.Vector3
  color: string
  born: number
  duration: number
}

function AttackArcs() {
  const groupRef = useRef<THREE.Group>(null!)
  const [arcs, setArcs] = useState<AttackArc[]>([])
  const arcIdRef = useRef(0)

  // Spawn new arcs periodically
  useEffect(() => {
    const spawn = () => {
      const from = THREAT_CITIES[Math.floor(Math.random() * THREAT_CITIES.length)]
      const to = TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)]
      const newArc: AttackArc = {
        id: arcIdRef.current++,
        from: latLngToVec3(from.lat, from.lng, GLOBE_R * 1.005),
        to: latLngToVec3(to.lat, to.lng, GLOBE_R * 1.005),
        color: Math.random() > 0.3 ? '#ff5252' : '#ff9100',
        born: performance.now() / 1000,
        duration: 1.5 + Math.random() * 1.5,
      }
      setArcs((prev) => [...prev.slice(-15), newArc]) // Keep max 16 arcs
    }

    // Initial burst
    for (let i = 0; i < 6; i++) setTimeout(spawn, i * 200)

    const id = setInterval(spawn, 400 + Math.random() * 300)
    return () => clearInterval(id)
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.03
  })

  return (
    <group ref={groupRef}>
      {arcs.map((arc) => (
        <ArcLine key={arc.id} arc={arc} />
      ))}
    </group>
  )
}

function ArcLine({ arc }: { arc: AttackArc }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null!)
  const headRef = useRef<THREE.Mesh>(null!)

  const { curvePoints, curve } = useMemo(() => {
    const mid = new THREE.Vector3()
      .addVectors(arc.from, arc.to)
      .multiplyScalar(0.5)
    const dist = arc.from.distanceTo(arc.to)
    mid.normalize().multiplyScalar(GLOBE_R + dist * 0.4)

    const crv = new THREE.QuadraticBezierCurve3(arc.from, mid, arc.to)
    return { curvePoints: crv.getPoints(48), curve: crv }
  }, [arc])

  useFrame(({ clock }) => {
    if (!lineRef.current) return
    const elapsed = clock.getElapsedTime() - arc.born
    const t = Math.min(elapsed / arc.duration, 1)

    // Animate: show only the portion of the arc that has been "drawn"
    const geom = lineRef.current.geometry
    const headCount = Math.max(2, Math.floor(t * 48))
    const visiblePts = curvePoints.slice(0, headCount)
    const posArr = new Float32Array(visiblePts.flatMap((p) => [p.x, p.y, p.z]))
    geom.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    geom.setDrawRange(0, headCount)

    // Fade out the line
    const mat = lineRef.current.material as THREE.LineBasicMaterial
    mat.opacity = t < 0.7 ? 0.7 : Math.max(0, 1 - (t - 0.7) / 0.3) * 0.7

    // Move the head dot
    if (headRef.current && t < 1) {
      const pt = curve.getPoint(t)
      headRef.current.position.copy(pt)
      headRef.current.visible = t < 0.95
      const headMat = headRef.current.material as THREE.MeshBasicMaterial
      headMat.opacity = t < 0.7 ? 1 : Math.max(0, 1 - (t - 0.7) / 0.3)
    } else if (headRef.current) {
      headRef.current.visible = false
    }
  })

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <line ref={lineRef as any}>
        <bufferGeometry />
        <lineBasicMaterial
          color={arc.color}
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </line>
      {/* Glowing head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  )
}

/* ─── Impact Pulses on Target Cities ─── */
function ImpactPulses() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.03
  })

  const pulses = useMemo(
    () =>
      TARGET_CITIES.map((c) => ({
        pos: latLngToVec3(c.lat, c.lng, GLOBE_R * 1.006),
        phase: Math.random() * Math.PI * 2,
        name: c.name,
      })),
    []
  )

  return (
    <group ref={groupRef}>
      {pulses.map((p) => (
        <PulseRing key={p.name} position={p.pos} phase={p.phase} />
      ))}
    </group>
  )
}

function PulseRing({ position, phase }: { position: THREE.Vector3; phase: number }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = ((clock.getElapsedTime() * 0.8 + phase) % 2) / 2 // 0–1 cycle
    ref.current.scale.setScalar(1 + t * 3)
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = Math.max(0, 0.3 - t * 0.3)
  })

  return (
    <mesh ref={ref} position={position}>
      <ringGeometry args={[0.015, 0.025, 16]} />
      <meshBasicMaterial
        color="#00e5ff"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/* ─── Ambient Particles (space dust) ─── */
function SpaceDust({ count = 200 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
    }
    return arr
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.008}
        color="#00e5ff"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── Full Scene ─── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight position={[5, 3, 5]} color="#00e5ff" intensity={0.3} distance={20} />
      <pointLight position={[-4, -2, 3]} color="#b388ff" intensity={0.15} distance={15} />

      <GlobeWireframe />
      <CityNodes />
      <AttackArcs />
      <ImpactPulses />
      <SpaceDust count={150} />
    </>
  )
}

/* ─── Static Fallback ─── */
function StaticBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Static globe representation */}
        <div className="w-56 h-56 rounded-full bg-gradient-to-br from-brand-charcoal to-brand-black border border-brand-cyan/15">
          {/* Grid lines */}
          <div className="absolute inset-0 rounded-full border border-brand-cyan/5" />
          <div className="absolute inset-6 rounded-full border border-brand-cyan/5" />
          <div className="absolute inset-12 rounded-full border border-brand-cyan/5" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-cyan/10" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-cyan/10" />
        </div>
        {/* Red dots for attacks */}
        <div className="absolute top-8 right-10 w-2 h-2 rounded-full bg-red-500/60 animate-pulse" />
        <div className="absolute top-16 left-12 w-1.5 h-1.5 rounded-full bg-red-500/40 animate-pulse" />
        <div className="absolute bottom-12 right-16 w-1.5 h-1.5 rounded-full bg-red-500/50 animate-pulse" />
        {/* Cyan target dots */}
        <div className="absolute top-10 left-20 w-2 h-2 rounded-full bg-brand-cyan/60 animate-pulse" />
        <div className="absolute bottom-16 left-10 w-2 h-2 rounded-full bg-brand-cyan/50 animate-pulse" />
        {/* Outer glow */}
        <div className="absolute -inset-4 rounded-full border border-brand-cyan/5" />
        <div className="absolute -inset-8 rounded-full border border-brand-border/5" />
      </div>
    </div>
  )
}

/* ─── Exported Component ─── */
export default function AICore() {
  const { reducedMotion } = useMotion()

  if (reducedMotion) {
    return <StaticBackground />
  }

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
