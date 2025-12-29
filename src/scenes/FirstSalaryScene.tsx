import { useState } from 'react'
import { Text, Box } from '@react-three/drei'
import { Room, Desk, Chair } from '../components/environment/Room'
import { DialogPanel } from '../components/ui/DialogPanel'
import { DecisionPanel } from '../components/ui/DecisionPanel'
import { HUD } from '../components/ui/HUD'
import { getDialogueByScene } from '../data/dialogues'
import { getDecisionByScene } from '../data/decisions'

export function FirstSalaryScene() {
  const [showDialog, setShowDialog] = useState(true)
  const [showDecision, setShowDecision] = useState(false)

  const dialogue = getDialogueByScene('first-salary')
  const decision = getDecisionByScene('first-salary')

  const handleDialogComplete = () => {
    setShowDialog(false)
    setShowDecision(true)
  }

  return (
    <group>
      {/* Office room */}
      <Room color="#3d3d5c" floorColor="#2a2a4a" size={[8, 3.5, 8]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#fff5e6" />
      <spotLight
        position={[2, 3, 2]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.5}
        castShadow
      />

      {/* Office furniture */}
      <Desk position={[0, 0, -2]} />
      <Chair position={[0, 0, -1]} />

      {/* Computer on desk */}
      <group position={[0, 0.8, -2.2]}>
        {/* Monitor */}
        <Box args={[0.6, 0.4, 0.03]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        {/* Screen */}
        <Box args={[0.55, 0.35, 0.01]} position={[0, 0.2, 0.02]}>
          <meshStandardMaterial color="#4a9eff" emissive="#4a9eff" emissiveIntensity={0.3} />
        </Box>
        {/* Stand */}
        <Box args={[0.1, 0.15, 0.1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#333333" />
        </Box>
      </group>

      {/* Salary notification on screen */}
      <Text
        position={[0, 1.0, -2.15]}
        fontSize={0.04}
        color="#ffffff"
        textAlign="center"
      >
        {`DEPÓSITO RECIBIDO\n$1,000.00\nSueldo Mensual`}
      </Text>

      {/* Window with light */}
      <group position={[3.9, 2, 0]}>
        <Box args={[0.05, 1.5, 1.5]}>
          <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.5} />
        </Box>
      </group>

      {/* Plant decoration */}
      <group position={[-2, 0, -3]}>
        <Box args={[0.3, 0.4, 0.3]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#5d4037" />
        </Box>
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#2e7d32" />
        </mesh>
      </group>

      {/* UI Elements */}
      <HUD position={[-1.8, 1.8, -2]} />

      {/* Dialog */}
      {showDialog && dialogue && (
        <DialogPanel
          dialogue={dialogue}
          position={[0, 1.5, -1.5]}
          onComplete={handleDialogComplete}
        />
      )}

      {/* Decision panel */}
      {showDecision && decision && (
        <DecisionPanel
          decision={decision}
          position={[0, 1.5, -1.5]}
        />
      )}
    </group>
  )
}
