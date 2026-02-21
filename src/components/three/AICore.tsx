import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useMotion } from '../../context/MotionContext'

/* ═══════════════════════════════════════════════════════════
   SECUROLOGY.AI — Global Cyber Threat Visualization
   A futuristic real-time attack map rendered on a holographic globe
   ═══════════════════════════════════════════════════════════ */

const GLOBE_R = 2.0
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
interface City { name: string; lat: number; lng: number; threat: boolean }

const CITIES: City[] = [
  { name: 'Moscow', lat: 55.75, lng: 37.62, threat: true },
  { name: 'Beijing', lat: 39.9, lng: 116.4, threat: true },
  { name: 'Pyongyang', lat: 39.03, lng: 125.75, threat: true },
  { name: 'Tehran', lat: 35.69, lng: 51.39, threat: true },
  { name: 'Lagos', lat: 6.52, lng: 3.38, threat: true },
  { name: 'Sao Paulo', lat: -23.55, lng: -46.63, threat: true },
  { name: 'Hanoi', lat: 21.03, lng: 105.85, threat: true },
  { name: 'Bucharest', lat: 44.43, lng: 26.1, threat: true },
  { name: 'Jakarta', lat: -6.2, lng: 106.85, threat: true },
  { name: 'Karachi', lat: 24.86, lng: 67.01, threat: true },
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
  { name: 'Los Angeles', lat: 34.05, lng: -118.24, threat: false },
  { name: 'Chicago', lat: 41.88, lng: -87.63, threat: false },
  { name: 'Zurich', lat: 47.37, lng: 8.54, threat: false },
  { name: 'Tel Aviv', lat: 32.08, lng: 34.78, threat: false },
]

const THREAT_CITIES = CITIES.filter((c) => c.threat)
const TARGET_CITIES = CITIES.filter((c) => !c.threat)

/* ═══════════════════════════════════════════════
   HOLOGRAPHIC GLOBE — Dot-matrix style
   ═══════════════════════════════════════════════ */
function HolographicGlobe() {
  const groupRef = useRef<THREE.Group>(null!)
  const atmosphereRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.04

    // Pulsing atmosphere
    if (atmosphereRef.current) {
      const s = 1.0 + Math.sin(clock.getElapsedTime() * 0.8) * 0.008
      atmosphereRef.current.scale.setScalar(s)
    }
  })

  // Create a dense dot-matrix sphere for a holographic look
  const dotPositions = useMemo(() => {
    const pts: number[] = []
    const colors: number[] = []
    const count = 4000
    const cyan = new THREE.Color('#00e5ff')
    const dim = new THREE.Color('#0a3d4f')

    // Fibonacci sphere for even distribution
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    for (let i = 0; i < count; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count)
      const x = Math.cos(theta) * Math.sin(phi)
      const y = Math.cos(phi)
      const z = Math.sin(theta) * Math.sin(phi)

      pts.push(x * GLOBE_R, y * GLOBE_R, z * GLOBE_R)

      // Brighter near equator and landmass approximation
      const lat = Math.asin(y) / DEG2RAD
      const lng = Math.atan2(z, x) / DEG2RAD
      const isLand = approximateLand(lat, lng)
      const c = isLand ? cyan : dim
      const brightness = isLand ? 0.6 + Math.random() * 0.4 : 0.15 + Math.random() * 0.1
      colors.push(c.r * brightness, c.g * brightness, c.b * brightness)
    }
    return {
      positions: new Float32Array(pts),
      colors: new Float32Array(colors),
      count,
    }
  }, [])

  // Grid rings (latitude)
  const latRings = useMemo(() => {
    const rings: Float32Array[] = []
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: number[] = []
      for (let lng = 0; lng <= 360; lng += 2) {
        const v = latLngToVec3(lat, lng, GLOBE_R * 1.001)
        pts.push(v.x, v.y, v.z)
      }
      rings.push(new Float32Array(pts))
    }
    return rings
  }, [])

  // Grid rings (longitude)
  const lngRings = useMemo(() => {
    const rings: Float32Array[] = []
    for (let lng = 0; lng < 360; lng += 30) {
      const pts: number[] = []
      for (let lat = -90; lat <= 90; lat += 2) {
        const v = latLngToVec3(lat, lng, GLOBE_R * 1.001)
        pts.push(v.x, v.y, v.z)
      }
      rings.push(new Float32Array(pts))
    }
    return rings
  }, [])

  return (
    <group ref={groupRef}>
      {/* Inner dark sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_R * 0.98, 64, 64]} />
        <meshBasicMaterial color="#040810" transparent opacity={0.97} />
      </mesh>

      {/* Dot matrix surface */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={dotPositions.count} array={dotPositions.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={dotPositions.count} array={dotPositions.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.012} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Latitude grid */}
      {latRings.map((arr, i) => (
        <line key={`lat-${i}`}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={arr.length / 3} array={arr} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00e5ff" transparent opacity={0.04} />
        </line>
      ))}

      {/* Longitude grid */}
      {lngRings.map((arr, i) => (
        <line key={`lng-${i}`}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={arr.length / 3} array={arr} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00e5ff" transparent opacity={0.04} />
        </line>
      ))}

      {/* Atmospheric glow layers */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[GLOBE_R * 1.06, 48, 48]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.02} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[GLOBE_R * 1.12, 48, 48]} />
        <meshBasicMaterial color="#0044aa" transparent opacity={0.015} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[GLOBE_R * 1.2, 32, 32]} />
        <meshBasicMaterial color="#b388ff" transparent opacity={0.008} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════
   LANDMASS APPROXIMATION (no texture needed)
   ═══════════════════════════════════════════════ */
function approximateLand(lat: number, lng: number): boolean {
  // North America
  if (lat > 25 && lat < 70 && lng > -130 && lng < -60) return true
  // South America
  if (lat > -55 && lat < 12 && lng > -80 && lng < -35) return true
  // Europe
  if (lat > 35 && lat < 72 && lng > -10 && lng < 40) return true
  // Africa
  if (lat > -35 && lat < 37 && lng > -20 && lng < 52) return true
  // Asia (broad)
  if (lat > 10 && lat < 75 && lng > 40 && lng < 145) return true
  // Middle East
  if (lat > 12 && lat < 42 && lng > 25 && lng < 65) return true
  // India
  if (lat > 5 && lat < 35 && lng > 68 && lng < 90) return true
  // Southeast Asia
  if (lat > -10 && lat < 20 && lng > 95 && lng < 130) return true
  // Australia
  if (lat > -45 && lat < -10 && lng > 110 && lng < 155) return true
  // Japan/Korea
  if (lat > 30 && lat < 46 && lng > 125 && lng < 146) return true
  // UK/Ireland
  if (lat > 50 && lat < 60 && lng > -11 && lng < 2) return true
  return false
}

/* ═══════════════════════════════════════════════
   CITY NODES — Glowing pillars with pulse rings
   ═══════════════════════════════════════════════ */
function CityNodes() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.04
  })

  const cityData = useMemo(
    () =>
      CITIES.map((c) => ({
        ...c,
        pos: latLngToVec3(c.lat, c.lng, GLOBE_R * 1.0),
        pillarEnd: latLngToVec3(c.lat, c.lng, GLOBE_R * 1.04),
        phase: Math.random() * Math.PI * 2,
      })),
    []
  )

  return (
    <group ref={groupRef}>
      {cityData.map((c) => (
        <CityMarker key={c.name} city={c} />
      ))}
    </group>
  )
}

function CityMarker({ city }: { city: { name: string; pos: THREE.Vector3; pillarEnd: THREE.Vector3; threat: boolean; phase: number } }) {
  const dotRef = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!dotRef.current) return
    const pulse = 1 + Math.sin(clock.getElapsedTime() * 4 + city.phase) * 0.4
    dotRef.current.scale.setScalar(pulse)

    if (ringRef.current) {
      const t = ((clock.getElapsedTime() * 1.2 + city.phase) % 2) / 2
      ringRef.current.scale.setScalar(1 + t * 5)
      const mat = ringRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = Math.max(0, (city.threat ? 0.5 : 0.35) * (1 - t))
    }
  })

  const color = city.threat ? '#ff3333' : '#00e5ff'

  return (
    <group>
      {/* Pillar line from surface */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              city.pos.x, city.pos.y, city.pos.z,
              city.pillarEnd.x, city.pillarEnd.y, city.pillarEnd.z,
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </line>

      {/* Top dot */}
      <mesh ref={dotRef} position={city.pillarEnd}>
        <sphereGeometry args={[city.threat ? 0.022 : 0.018, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Expanding pulse ring */}
      <mesh ref={ringRef} position={city.pillarEnd}>
        <ringGeometry args={[0.01, 0.02, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/* ═══════════════════════════════════════════════
   ATTACK ARCS — Neon-traced projectile paths
   ═══════════════════════════════════════════════ */
interface AttackArc {
  id: number
  from: THREE.Vector3
  to: THREE.Vector3
  fromCity: string
  toCity: string
  color: THREE.Color
  born: number
  duration: number
  height: number
}

function AttackArcs() {
  const groupRef = useRef<THREE.Group>(null!)
  const [arcs, setArcs] = useState<AttackArc[]>([])
  const arcIdRef = useRef(0)

  const spawn = useCallback(() => {
    const from = THREAT_CITIES[Math.floor(Math.random() * THREAT_CITIES.length)]
    const to = TARGET_CITIES[Math.floor(Math.random() * TARGET_CITIES.length)]
    const fromV = latLngToVec3(from.lat, from.lng, GLOBE_R * 1.005)
    const toV = latLngToVec3(to.lat, to.lng, GLOBE_R * 1.005)
    const dist = fromV.distanceTo(toV)

    // Color variety: red, orange, magenta
    const colors = [
      new THREE.Color('#ff2222'),
      new THREE.Color('#ff6600'),
      new THREE.Color('#ff0066'),
      new THREE.Color('#ff4444'),
      new THREE.Color('#ee3300'),
    ]

    const newArc: AttackArc = {
      id: arcIdRef.current++,
      from: fromV,
      to: toV,
      fromCity: from.name,
      toCity: to.name,
      color: colors[Math.floor(Math.random() * colors.length)],
      born: performance.now() / 1000,
      duration: 1.2 + Math.random() * 1.8,
      height: GLOBE_R + dist * 0.35 + Math.random() * 0.3,
    }
    setArcs((prev) => [...prev.slice(-20), newArc])
  }, [])

  useEffect(() => {
    // Initial burst
    for (let i = 0; i < 8; i++) setTimeout(spawn, i * 150)
    const id = setInterval(spawn, 250 + Math.random() * 200)
    return () => clearInterval(id)
  }, [spawn])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.04
  })

  return (
    <group ref={groupRef}>
      {arcs.map((arc) => (
        <ArcProjectile key={arc.id} arc={arc} />
      ))}
    </group>
  )
}

function ArcProjectile({ arc }: { arc: AttackArc }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trailRef = useRef<any>(null!)
  const headRef = useRef<THREE.Mesh>(null!)
  const impactRef = useRef<THREE.Mesh>(null!)

  const { curvePoints, curve } = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(arc.from, arc.to).multiplyScalar(0.5)
    mid.normalize().multiplyScalar(arc.height)
    const crv = new THREE.QuadraticBezierCurve3(arc.from, mid, arc.to)
    return { curvePoints: crv.getPoints(64), curve: crv }
  }, [arc])

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() - arc.born
    const t = Math.min(elapsed / arc.duration, 1)

    // Animated trail
    if (trailRef.current) {
      const geom = trailRef.current.geometry
      // Show trail with a glowing tail effect
      const trailStart = Math.max(0, Math.floor(t * 64) - 20)
      const trailEnd = Math.floor(t * 64)
      if (trailEnd > trailStart + 1) {
        const slice = curvePoints.slice(trailStart, trailEnd + 1)
        const posArr = new Float32Array(slice.flatMap((p) => [p.x, p.y, p.z]))
        geom.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
        geom.setDrawRange(0, slice.length)
      }
      const mat = trailRef.current.material as THREE.LineBasicMaterial
      mat.opacity = t < 0.8 ? 0.9 : Math.max(0, 1 - (t - 0.8) / 0.2) * 0.9
    }

    // Glowing projectile head
    if (headRef.current) {
      if (t < 0.95) {
        const pt = curve.getPoint(t)
        headRef.current.position.copy(pt)
        headRef.current.visible = true
        const s = 1 + Math.sin(clock.getElapsedTime() * 15) * 0.3
        headRef.current.scale.setScalar(s)
      } else {
        headRef.current.visible = false
      }
    }

    // Impact flash at destination
    if (impactRef.current) {
      if (t > 0.9 && t < 1) {
        impactRef.current.visible = true
        const impactT = (t - 0.9) / 0.1
        impactRef.current.scale.setScalar(1 + impactT * 8)
        const mat = impactRef.current.material as THREE.MeshBasicMaterial
        mat.opacity = Math.max(0, 0.8 * (1 - impactT))
      } else {
        impactRef.current.visible = false
      }
    }
  })

  return (
    <>
      {/* Trail */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <line ref={trailRef as any}>
        <bufferGeometry />
        <lineBasicMaterial
          color={arc.color}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Projectile head — bright white core with color glow */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={1}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow around head */}
      <mesh ref={headRef ? undefined : undefined}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial
          color={arc.color}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Impact explosion */}
      <mesh ref={impactRef} position={arc.to} visible={false}>
        <ringGeometry args={[0.01, 0.04, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  )
}

/* ═══════════════════════════════════════════════
   ORBITAL RING — Scanning satellite ring
   ═══════════════════════════════════════════════ */
function OrbitalRing() {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.15
    ref.current.rotation.x = 0.3
  })

  const ringPoints = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      pts.push(
        Math.cos(angle) * GLOBE_R * 1.35,
        0,
        Math.sin(angle) * GLOBE_R * 1.35
      )
    }
    return new Float32Array(pts)
  }, [])

  return (
    <group ref={ref}>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={129} array={ringPoints} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#00e5ff" transparent opacity={0.12} blending={THREE.AdditiveBlending} />
      </line>

      {/* Scanning dot on ring */}
      <ScanDot radius={GLOBE_R * 1.35} />
    </group>
  )
}

function ScanDot({ radius }: { radius: number }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (!ref.current) return
    const a = clock.getElapsedTime() * 1.5
    ref.current.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius)
    const s = 1 + Math.sin(clock.getElapsedTime() * 8) * 0.3
    ref.current.scale.setScalar(s)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color="#00e5ff" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

/* Second ring at different angle */
function OrbitalRing2() {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = -clock.getElapsedTime() * 0.08
    ref.current.rotation.z = 0.5
  })

  const ringPoints = useMemo(() => {
    const pts: number[] = []
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2
      pts.push(Math.cos(angle) * GLOBE_R * 1.5, 0, Math.sin(angle) * GLOBE_R * 1.5)
    }
    return new Float32Array(pts)
  }, [])

  return (
    <group ref={ref}>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={129} array={ringPoints} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#b388ff" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </line>
    </group>
  )
}

/* ═══════════════════════════════════════════════
   DATA PARTICLES — Floating ambient data
   ═══════════════════════════════════════════════ */
function DataParticles({ count = 350 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = GLOBE_R * 1.15 + Math.random() * 2.5
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      pos[i * 3 + 1] = Math.cos(phi) * r
      pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r
      vel[i * 3] = (Math.random() - 0.5) * 0.001
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.001
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001
    }
    return { positions: pos, velocities: vel }
  }, [count])

  useFrame(() => {
    if (!ref.current) return
    const posArr = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      posArr[i * 3] += velocities[i * 3]
      posArr[i * 3 + 1] += velocities[i * 3 + 1]
      posArr[i * 3 + 2] += velocities[i * 3 + 2]
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.008}
        color="#00e5ff"
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ═══════════════════════════════════════════════
   CURSOR-REACTIVE LIGHT
   ═══════════════════════════════════════════════ */
function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null!)
  const { viewport } = useThree()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!lightRef.current) return
      const x = ((e.clientX / window.innerWidth) * 2 - 1) * viewport.width * 0.4
      const y = (-(e.clientY / window.innerHeight) * 2 + 1) * viewport.height * 0.4
      lightRef.current.position.set(x, y, 4)
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [viewport])

  return <pointLight ref={lightRef} color="#00e5ff" intensity={0.25} distance={10} />
}

/* ═══════════════════════════════════════════════
   FULL SCENE COMPOSITION
   ═══════════════════════════════════════════════ */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.03} />
      <pointLight position={[5, 4, 6]} color="#00e5ff" intensity={0.2} distance={20} />
      <pointLight position={[-5, -3, 4]} color="#b388ff" intensity={0.1} distance={15} />
      <pointLight position={[0, 0, 6]} color="#004466" intensity={0.15} distance={12} />
      <CursorLight />

      <HolographicGlobe />
      <CityNodes />
      <AttackArcs />
      <OrbitalRing />
      <OrbitalRing2 />
      <DataParticles count={300} />
    </>
  )
}

/* ═══════════════════════════════════════════════
   STATIC FALLBACK (reduced-motion)
   ═══════════════════════════════════════════════ */
function StaticBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#040810] to-[#0a1628] border border-brand-cyan/15 glow-cyan">
          <div className="absolute inset-0 rounded-full border border-brand-cyan/5" />
          <div className="absolute inset-8 rounded-full border border-brand-cyan/5" />
          <div className="absolute inset-16 rounded-full border border-brand-cyan/5" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-cyan/10" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-brand-cyan/10" />
        </div>
        <div className="absolute top-6 right-8 w-2.5 h-2.5 rounded-full bg-red-500/70 animate-pulse" />
        <div className="absolute top-14 left-10 w-2 h-2 rounded-full bg-red-500/50 animate-pulse" />
        <div className="absolute bottom-10 right-14 w-2 h-2 rounded-full bg-red-500/60 animate-pulse" />
        <div className="absolute top-8 left-20 w-2.5 h-2.5 rounded-full bg-brand-cyan/70 animate-pulse" />
        <div className="absolute bottom-14 left-8 w-2.5 h-2.5 rounded-full bg-brand-cyan/60 animate-pulse" />
        <div className="absolute bottom-20 right-6 w-2 h-2 rounded-full bg-brand-cyan/50 animate-pulse" />
        <div className="absolute -inset-3 rounded-full border border-brand-cyan/8 animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute -inset-8 rounded-full border border-brand-purple/5" />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   EXPORTED COMPONENT
   ═══════════════════════════════════════════════ */
export default function AICore() {
  const { reducedMotion } = useMotion()

  if (reducedMotion) {
    return <StaticBackground />
  }

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.8, 4.8], fov: 45 }}
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
