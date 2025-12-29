import { useState } from 'react'
import { Sky, Stars, Float, Text, RoundedBox } from '@react-three/drei'
import { DialogPanel } from '../components/ui/DialogPanel'
import { getDialogueByScene } from '../data/dialogues'
import { useGameStore } from '../store/gameStore'

export function IntroScene() {
  const [showDialog, setShowDialog] = useState(true)
  const [showStartButton, setShowStartButton] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const setScene = useGameStore((state) => state.setScene)
  const updateMoney = useGameStore((state) => state.updateMoney)

  const dialogue = getDialogueByScene('intro')

  const handleDialogComplete = () => {
    setShowDialog(false)
    setShowStartButton(true)
  }

  const handleStart = () => {
    // Give initial salary
    updateMoney(1000)
    setScene('first-salary')
  }

  return (
    <group>
      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />

      {/* Floating title */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 2.5, -4]}
          fontSize={0.4}
          color="#FFD700"
          font="/fonts/Inter-Bold.woff"
        >
          Educación Financiera VR
        </Text>
      </Float>

      {/* Subtitle */}
      <Text
        position={[0, 2, -4]}
        fontSize={0.15}
        color="#aaaaaa"
      >
        Tu camino hacia la libertad financiera
      </Text>

      {/* Dialog */}
      {showDialog && dialogue && (
        <DialogPanel
          dialogue={dialogue}
          position={[0, 1.3, -2.5]}
          onComplete={handleDialogComplete}
        />
      )}

      {/* Start button */}
      {showStartButton && (
        <group position={[0, 1, -2.5]}>
          <RoundedBox
            args={[1, 0.4, 0.1]}
            radius={0.05}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onClick={handleStart}
          >
            <meshStandardMaterial
              color={isHovered ? '#4CAF50' : '#2E7D32'}
              emissive={isHovered ? '#2E7D32' : '#000000'}
              emissiveIntensity={0.3}
            />
          </RoundedBox>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.1}
            color="#ffffff"
            font="/fonts/Inter-Bold.woff"
          >
            COMENZAR
          </Text>
        </group>
      )}

      {/* Decorative floating coins */}
      {[...Array(8)].map((_, i) => (
        <Float
          key={i}
          speed={1.5 + Math.random()}
          rotationIntensity={0.5}
          floatIntensity={0.8}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 8,
              1.5 + Math.random() * 2,
              -3 - Math.random() * 3,
            ]}
          >
            <cylinderGeometry args={[0.15, 0.15, 0.03, 32]} />
            <meshStandardMaterial
              color="#FFD700"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </group>
  )
}
