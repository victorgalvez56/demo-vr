import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { ThreeCanvas } from '@remotion/three'
import { Suspense } from 'react'
import * as THREE from 'three'

const FPS = 30
const TITLE_FRAMES = 90
const SCENE_FRAMES = 150
const OUTRO_FRAMES = 60

const PALETTE = {
  bg: '#0a0e1a',
  bgGradient: 'radial-gradient(ellipse at center, #1a2340 0%, #0a0e1a 70%)',
  accent: '#4ade80',
  accentDim: '#22c55e',
  text: '#f8fafc',
  muted: '#94a3b8',
  gold: '#fbbf24',
}

function TitleCard() {
  const frame = useCurrentFrame()
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const fadeOut = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: 'clamp' })
  const opacity = Math.min(fadeIn, fadeOut)
  const translateY = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: PALETTE.bgGradient,
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: PALETTE.accent,
            letterSpacing: 8,
            marginBottom: 20,
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          WebXR · React Three Fiber
        </div>
        <div
          style={{
            fontSize: 110,
            color: PALETTE.text,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          Finanzas VR
        </div>
        <div
          style={{
            fontSize: 32,
            color: PALETTE.muted,
            marginTop: 24,
            maxWidth: 900,
          }}
        >
          Aprende finanzas personales dentro de un banco virtual
        </div>
      </div>
    </AbsoluteFill>
  )
}

function BankScene() {
  const frame = useCurrentFrame()
  const t = frame / FPS

  const cameraAngle = interpolate(frame, [0, SCENE_FRAMES], [0, Math.PI * 0.4])
  const cameraRadius = 8
  const camX = Math.sin(cameraAngle) * cameraRadius
  const camZ = Math.cos(cameraAngle) * cameraRadius

  // Animated "money learning" — coins floating up
  const coins = Array.from({ length: 6 }, (_, i) => {
    const phase = (t * 0.8 + i * 0.5) % 3
    const y = interpolate(phase, [0, 3], [0.5, 4])
    const alpha = interpolate(phase, [0, 0.3, 2.5, 3], [0, 1, 1, 0])
    return { i, y, alpha, x: Math.sin(i * 1.3) * 0.8, z: Math.cos(i * 1.3) * 0.8 }
  })

  return (
    <ThreeCanvas width={1280} height={720} linear gl={{ antialias: true }}>
      <color attach="background" args={['#0a0e1a']} />
      <fog attach="fog" args={['#0a0e1a', 10, 30]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#fff5e0" />
      <pointLight position={[0, 4, 0]} intensity={1.5} color={PALETTE.accent} distance={12} />

      <perspectiveCamera
        makeDefault
        position={[camX, 3, camZ]}
        fov={50}
        onUpdate={(self: THREE.PerspectiveCamera) => self.lookAt(0, 1.5, 0)}
      />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a2340" roughness={0.7} />
      </mesh>

      {/* Grid lines */}
      <gridHelper args={[30, 30, '#2a3450', '#1a2340']} position={[0, 0.01, 0]} />

      {/* Bank counter */}
      <mesh position={[0, 0.8, -2]} castShadow>
        <boxGeometry args={[6, 1.6, 0.4]} />
        <meshStandardMaterial color="#2a3450" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.65, -1.82]}>
        <boxGeometry args={[6.2, 0.08, 0.8]} />
        <meshStandardMaterial color="#3a4460" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Advisor NPC — stylized cylinder + sphere */}
      <group position={[0, 0, -3]}>
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 1.6, 16]} />
          <meshStandardMaterial color="#4338ca" roughness={0.5} />
        </mesh>
        <mesh position={[0, 2.05, 0]}>
          <sphereGeometry args={[0.28, 20, 20]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.6} />
        </mesh>
      </group>

      {/* Player avatar — the user */}
      <group position={[interpolate(frame, [0, SCENE_FRAMES], [2.5, 0.5]), 0, 2]}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 1.4, 16]} />
          <meshStandardMaterial color={PALETTE.accent} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.25, 20, 20]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      </group>

      {/* Floating coins — "learning about money" */}
      {coins.map(({ i, y, alpha, x, z }) => (
        <mesh key={i} position={[x, y, z - 0.5]} rotation={[Math.PI / 2, 0, t * 2 + i]}>
          <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
          <meshStandardMaterial
            color={PALETTE.gold}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={alpha}
            emissive={PALETTE.gold}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Back wall */}
      <mesh position={[0, 3, -6]}>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#141929" />
      </mesh>
    </ThreeCanvas>
  )
}

function OutroCard() {
  const frame = useCurrentFrame()
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
  const scale = interpolate(frame, [0, 20], [0.95, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: PALETTE.bgGradient,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: PALETTE.muted,
            marginBottom: 24,
            letterSpacing: 2,
          }}
        >
          Pruébalo en tu headset
        </div>
        <div
          style={{
            fontSize: 72,
            color: PALETTE.accent,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          finanzas.victorgalvez.dev
        </div>
      </div>
    </AbsoluteFill>
  )
}

export const FinanzasVRVideo = () => {
  return (
    <AbsoluteFill style={{ background: PALETTE.bg }}>
      <Sequence from={TITLE_FRAMES} durationInFrames={SCENE_FRAMES}>
        <Suspense fallback={<AbsoluteFill style={{ background: PALETTE.bg }} />}>
          <BankScene />
        </Suspense>
      </Sequence>
      <Sequence from={0} durationInFrames={TITLE_FRAMES}>
        <TitleCard />
      </Sequence>
      <Sequence from={TITLE_FRAMES + SCENE_FRAMES} durationInFrames={OUTRO_FRAMES}>
        <OutroCard />
      </Sequence>
    </AbsoluteFill>
  )
}
