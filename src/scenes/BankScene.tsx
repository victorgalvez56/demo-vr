import { useState } from 'react'
import { Text, Box, Cylinder, RoundedBox } from '@react-three/drei'
import { Room, Desk, Chair } from '../components/environment/Room'
import { DialogPanel } from '../components/ui/DialogPanel'
import { DecisionPanel } from '../components/ui/DecisionPanel'
import { HUD } from '../components/ui/HUD'
import { getDialogueByScene } from '../data/dialogues'
import { getDecisionByScene } from '../data/decisions'

export function BankScene() {
  const [showDialog, setShowDialog] = useState(true)
  const [showDecision, setShowDecision] = useState(false)

  const dialogue = getDialogueByScene('bank')
  const decision = getDecisionByScene('bank')

  const handleDialogComplete = () => {
    setShowDialog(false)
    setShowDecision(true)
  }

  return (
    <group>
      {/* Bank interior - more formal colors */}
      <Room color="#2c3e50" floorColor="#1a252f" size={[14, 4, 10]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 3.5, 0]} intensity={0.6} color="#fff8e1" />
      <pointLight position={[-4, 3, 0]} intensity={0.4} color="#fff8e1" />
      <pointLight position={[4, 3, 0]} intensity={0.4} color="#fff8e1" />

      {/* Bank logo/sign */}
      <group position={[0, 3, -4.8]}>
        <RoundedBox args={[3, 0.8, 0.1]} radius={0.05}>
          <meshStandardMaterial color="#1565c0" />
        </RoundedBox>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.25}
          color="#ffffff"
          font="/fonts/Inter-Bold.woff"
        >
          BANCO FUTURO
        </Text>
      </group>

      {/* Advisor desk */}
      <Desk position={[0, 0, -2.5]} />
      <Chair position={[0, 0, -3.2]} />

      {/* Player chair */}
      <Chair position={[0, 0, -1.5]} />

      {/* Banker NPC representation (simple figure) */}
      <group position={[0, 0, -3]}>
        {/* Body */}
        <Cylinder args={[0.2, 0.25, 0.8, 16]} position={[0, 0.9, 0]}>
          <meshStandardMaterial color="#1565c0" />
        </Cylinder>
        {/* Head */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#ffcc80" />
        </mesh>
        {/* Tie */}
        <Box args={[0.06, 0.3, 0.02]} position={[0, 1, 0.2]}>
          <meshStandardMaterial color="#c62828" />
        </Box>
      </group>

      {/* Documents on desk */}
      <group position={[0, 0.78, -2.3]}>
        {/* Paper stack */}
        <Box args={[0.25, 0.02, 0.35]} position={[-0.4, 0, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <Box args={[0.25, 0.02, 0.35]} position={[-0.4, 0.015, 0]}>
          <meshStandardMaterial color="#f5f5f5" />
        </Box>

        {/* Pen holder */}
        <Cylinder args={[0.04, 0.04, 0.1, 16]} position={[0.4, 0.05, 0]}>
          <meshStandardMaterial color="#37474f" />
        </Cylinder>
      </group>

      {/* Side pillars for bank feel */}
      {[-5, 5].map((x, i) => (
        <Cylinder key={i} args={[0.3, 0.3, 4, 16]} position={[x, 2, -2]}>
          <meshStandardMaterial color="#37474f" />
        </Cylinder>
      ))}

      {/* Info boards on walls */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[side * 3.5, 2, -4.7]}>
          <RoundedBox args={[1.5, 1, 0.05]} radius={0.03}>
            <meshStandardMaterial color="#263238" />
          </RoundedBox>
          <Text
            position={[0, 0.3, 0.03]}
            fontSize={0.08}
            color="#4CAF50"
            font="/fonts/Inter-Bold.woff"
          >
            {i === 0 ? 'AHORRO' : 'INVERSIÓN'}
          </Text>
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.05}
            color="#aaaaaa"
            maxWidth={1.3}
            textAlign="center"
          >
            {i === 0
              ? 'Cuenta de ahorro\n0.5% mensual\nAcceso inmediato'
              : 'Depósito a plazo\n1.5% mensual\n6 meses mínimo'}
          </Text>
        </group>
      ))}

      {/* Potted plants */}
      {[-6, 6].map((x, i) => (
        <group key={i} position={[x, 0, -4]}>
          <Cylinder args={[0.2, 0.25, 0.4, 16]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#5d4037" />
          </Cylinder>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#2e7d32" />
          </mesh>
        </group>
      ))}

      {/* UI Elements */}
      <HUD position={[-2.2, 2, -1.5]} />

      {/* Dialog */}
      {showDialog && dialogue && (
        <DialogPanel
          dialogue={dialogue}
          position={[0, 1.8, -1]}
          onComplete={handleDialogComplete}
        />
      )}

      {/* Decision panel */}
      {showDecision && decision && (
        <DecisionPanel
          decision={decision}
          position={[0, 1.6, -0.8]}
        />
      )}
    </group>
  )
}
