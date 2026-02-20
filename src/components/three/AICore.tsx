import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useMotion } from '../../context/MotionContext'

/* ─── Particle Stream ─── */
function ParticleStream({ count = 300 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const r = 1.8 + Math.random() * 2.5
      pos[i * 3] = Math.cos(theta) * r
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4
      pos[i * 3 + 2] = Math.sin(theta) * r
      spd[i] = 0.002 + Math.random() * 0.006
    }
    return { positions: pos, speeds: spd }
  }, [count])

  useFrame(() => {
    if (!ref.current) return
    const posArr = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const x = posArr[i * 3]
      const z = posArr[i * 3 + 2]
      const angle = Math.atan2(z, x) + spd[i]
      const r = Math.sqrt(x * x + z * z)
      posArr[i * 3] = Math.cos(angle) * r
      posArr[i * 3 + 2] = Math.sin(angle) * r
      posArr[i * 3 + 1] += (Math.random() - 0.5) * 0.005
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  const spd = speeds

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00e5ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── Hex Shield Ring ─── */
function HexShield() {
  const ref = useRef<THREE.Group>(null!)

  const hexPositions = useMemo(() => {
    const pts: { x: number; y: number; z: number; delay: number }[] = []
    const rings = 2
    for (let ring = 1; ring <= rings; ring++) {
      const r = 1.2 + ring * 0.5
      const segments = 6 * ring
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2
        pts.push({
          x: Math.cos(angle) * r,
          y: (Math.random() - 0.5) * 0.3,
          z: Math.sin(angle) * r,
          delay: Math.random() * Math.PI * 2,
        })
      }
    }
    return pts
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.08
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.1
  })

  return (
    <group ref={ref}>
      {hexPositions.map((p, i) => (
        <HexTile key={i} position={[p.x, p.y, p.z]} delay={p.delay} />
      ))}
    </group>
  )
}

function HexTile({
  position,
  delay,
}: {
  position: [number, number, number]
  delay: number
}) {
  const ref = useRef<THREE.Mesh>(null!)

  const hexShape = useMemo(() => {
    const shape = new THREE.Shape()
    const size = 0.15
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 6
      const x = Math.cos(angle) * size
      const y = Math.sin(angle) * size
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    return shape
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.08 + Math.sin(clock.getElapsedTime() * 1.5 + delay) * 0.06
  })

  return (
    <mesh ref={ref} position={position}>
      <shapeGeometry args={[hexShape]} />
      <meshBasicMaterial
        color="#00e5ff"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

/* ─── Core Orb ─── */
function CoreOrb() {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.2
    }
    if (glowRef.current) {
      const scale = 1.0 + Math.sin(clock.getElapsedTime() * 2) * 0.05
      glowRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group>
      {/* Inner core */}
      <Sphere ref={ref} args={[0.6, 32, 32]}>
        <meshStandardMaterial
          color="#0a1628"
          emissive="#00e5ff"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      {/* Outer glow shell */}
      <Sphere ref={glowRef} args={[0.75, 24, 24]}>
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.05}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </Sphere>
      {/* Wireframe shell */}
      <Sphere args={[0.85, 16, 16]}>
        <meshBasicMaterial
          color="#00e5ff"
          wireframe
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}

/* ─── Cursor Tracker ─── */
function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null!)
  const { viewport } = useThree()

  const handlePointerMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      if (!lightRef.current) return
      const x = ((e.clientX / window.innerWidth) * 2 - 1) * viewport.width * 0.5
      const y = (-(e.clientY / window.innerHeight) * 2 + 1) * viewport.height * 0.5
      lightRef.current.position.set(x, y, 3)
    },
    [viewport]
  )

  useFrame(() => {
    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('mousemove', handlePointerMove)
  })

  return <pointLight ref={lightRef} color="#b388ff" intensity={0.4} distance={8} />
}

/* ─── Full Scene ─── */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 5]} color="#00e5ff" intensity={0.5} distance={15} />
      <pointLight position={[-3, -2, 4]} color="#b388ff" intensity={0.3} distance={12} />
      <CursorLight />
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <CoreOrb />
        <HexShield />
      </Float>
      <ParticleStream count={250} />
    </>
  )
}

/* ─── Static Fallback ─── */
function StaticBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        {/* Static orb representation */}
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-brand-cyan/10 to-brand-purple/10 border border-brand-cyan/20 glow-cyan" />
        <div className="absolute inset-4 rounded-full border border-brand-cyan/10" />
        <div className="absolute inset-8 rounded-full bg-brand-charcoal border border-brand-cyan/30" />
        {/* Decorative hex grid */}
        <div className="absolute -inset-16 border border-brand-border/20 rounded-full opacity-30" />
        <div className="absolute -inset-24 border border-brand-border/10 rounded-full opacity-20" />
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
        camera={{ position: [0, 0, 5], fov: 50 }}
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
