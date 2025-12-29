import { useState } from 'react'
import { Text, Box, RoundedBox, Line } from '@react-three/drei'
import { Room } from '../components/environment/Room'
import { DialogPanel } from '../components/ui/DialogPanel'
import { DecisionPanel } from '../components/ui/DecisionPanel'
import { HUD } from '../components/ui/HUD'
import { getDialogueByScene } from '../data/dialogues'
import { getDecisionByScene } from '../data/decisions'

// Animated stock chart component
function StockChart({ position = [0, 0, 0] as [number, number, number] }) {
  // Generate random-ish chart points
  const points: [number, number, number][] = []
  for (let i = 0; i < 20; i++) {
    const x = -1 + i * 0.1
    const y = Math.sin(i * 0.5) * 0.2 + Math.random() * 0.1 + 0.2
    points.push([x, y, 0])
  }

  return (
    <group position={position}>
      {/* Chart background */}
      <RoundedBox args={[2.4, 1.2, 0.05]} radius={0.03}>
        <meshStandardMaterial color="#1a1a2e" />
      </RoundedBox>

      {/* Grid lines */}
      {[0, 0.25, 0.5].map((y, i) => (
        <Line
          key={i}
          points={[
            [-1.1, y - 0.25, 0.03],
            [1.1, y - 0.25, 0.03],
          ]}
          color="#333344"
          lineWidth={1}
        />
      ))}

      {/* Chart line */}
      <Line points={points} color="#4CAF50" lineWidth={3} position={[0, -0.3, 0.04]} />

      {/* Labels */}
      <Text position={[-1, 0.45, 0.03]} fontSize={0.06} color="#4CAF50" anchorX="left">
        +12.5%
      </Text>
      <Text position={[1, 0.45, 0.03]} fontSize={0.05} color="#888888" anchorX="right">
        S&P 500
      </Text>
    </group>
  )
}

// Crypto chart (more volatile)
function CryptoChart({ position = [0, 0, 0] as [number, number, number] }) {
  const points: [number, number, number][] = []
  for (let i = 0; i < 20; i++) {
    const x = -1 + i * 0.1
    const y = Math.sin(i * 1.2) * 0.4 + Math.cos(i * 0.7) * 0.2
    points.push([x, y, 0])
  }

  return (
    <group position={position}>
      <RoundedBox args={[2.4, 1.2, 0.05]} radius={0.03}>
        <meshStandardMaterial color="#1a1a2e" />
      </RoundedBox>

      <Line points={points} color="#ff9800" lineWidth={3} position={[0, 0, 0.04]} />

      <Text position={[-1, 0.45, 0.03]} fontSize={0.06} color="#ff9800" anchorX="left">
        ±85%
      </Text>
      <Text position={[1, 0.45, 0.03]} fontSize={0.05} color="#888888" anchorX="right">
        CRYPTO
      </Text>
      <Text position={[0, -0.5, 0.03]} fontSize={0.04} color="#f44336">
        Alta Volatilidad
      </Text>
    </group>
  )
}

export function InvestmentScene() {
  const [showDialog, setShowDialog] = useState(true)
  const [showDecision, setShowDecision] = useState(false)

  const dialogue = getDialogueByScene('investment')
  const decision = getDecisionByScene('investment')

  const handleDialogComplete = () => {
    setShowDialog(false)
    setShowDecision(true)
  }

  return (
    <group>
      {/* Modern office/trading floor */}
      <Room color="#1a1a2e" floorColor="#0d0d1a" size={[16, 4, 12]} />

      {/* Lighting - blue tech vibe */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 3.5, 0]} intensity={0.5} color="#4fc3f7" />
      <pointLight position={[-5, 2, -2]} intensity={0.3} color="#7c4dff" />
      <pointLight position={[5, 2, -2]} intensity={0.3} color="#4CAF50" />

      {/* Title */}
      <Text
        position={[0, 3.2, -5.8]}
        fontSize={0.3}
        color="#4fc3f7"
        font="/fonts/Inter-Bold.woff"
      >
        CENTRO DE INVERSIONES
      </Text>

      {/* Stock chart display - left */}
      <StockChart position={[-3.5, 2, -5]} />
      <Text position={[-3.5, 0.9, -5]} fontSize={0.08} color="#4CAF50">
        Fondos Indexados
      </Text>
      <Text position={[-3.5, 0.7, -5]} fontSize={0.05} color="#888888" maxWidth={2} textAlign="center">
        Diversificado • Bajo costo • Largo plazo
      </Text>

      {/* Crypto chart display - right */}
      <CryptoChart position={[3.5, 2, -5]} />
      <Text position={[3.5, 0.9, -5]} fontSize={0.08} color="#ff9800">
        Criptomonedas
      </Text>
      <Text position={[3.5, 0.7, -5]} fontSize={0.05} color="#888888" maxWidth={2} textAlign="center">
        Alto riesgo • Alta volatilidad • Especulativo
      </Text>

      {/* Center info panel */}
      <group position={[0, 2, -5.5]}>
        <RoundedBox args={[2, 1.5, 0.05]} radius={0.05}>
          <meshStandardMaterial color="#263238" />
        </RoundedBox>
        <Text position={[0, 0.5, 0.03]} fontSize={0.08} color="#FFD700" font="/fonts/Inter-Bold.woff">
          Regla de Oro
        </Text>
        <Text position={[0, 0.1, 0.03]} fontSize={0.055} color="#ffffff" maxWidth={1.8} textAlign="center">
          Nunca inviertas dinero que no puedas permitirte perder
        </Text>
        <Text position={[0, -0.25, 0.03]} fontSize={0.05} color="#4CAF50" maxWidth={1.8} textAlign="center">
          Diversificar reduce el riesgo
        </Text>
        <Text position={[0, -0.5, 0.03]} fontSize={0.05} color="#2196F3" maxWidth={1.8} textAlign="center">
          El tiempo es tu mejor aliado
        </Text>
      </group>

      {/* Trading desk setup */}
      <group position={[0, 0, -2]}>
        {/* Desk */}
        <Box args={[3, 0.05, 1]} position={[0, 0.75, 0]}>
          <meshStandardMaterial color="#37474f" />
        </Box>

        {/* Multiple monitors */}
        {[-0.8, 0, 0.8].map((x, i) => (
          <group key={i} position={[x, 1, -0.3]}>
            <Box args={[0.5, 0.35, 0.02]}>
              <meshStandardMaterial color="#1a1a1a" />
            </Box>
            <Box args={[0.45, 0.3, 0.01]} position={[0, 0, 0.015]}>
              <meshStandardMaterial
                color={['#4CAF50', '#2196F3', '#ff9800'][i]}
                emissive={['#4CAF50', '#2196F3', '#ff9800'][i]}
                emissiveIntensity={0.2}
              />
            </Box>
          </group>
        ))}
      </group>

      {/* Floating investment icons */}
      {[
        { pos: [-6, 2.5, -3], color: '#4CAF50', label: '📈' },
        { pos: [6, 2.5, -3], color: '#f44336', label: '📉' },
        { pos: [-6, 1.5, -4], color: '#FFD700', label: '💰' },
        { pos: [6, 1.5, -4], color: '#9c27b0', label: '💎' },
      ].map((item, i) => (
        <group key={i} position={item.pos as [number, number, number]}>
          <Text fontSize={0.3}>{item.label}</Text>
        </group>
      ))}

      {/* UI Elements */}
      <HUD position={[-2.5, 2, -1]} />

      {/* Dialog */}
      {showDialog && dialogue && (
        <DialogPanel
          dialogue={dialogue}
          position={[0, 1.8, -0.5]}
          onComplete={handleDialogComplete}
        />
      )}

      {/* Decision panel */}
      {showDecision && decision && (
        <DecisionPanel
          decision={decision}
          position={[0, 1.5, -0.5]}
        />
      )}
    </group>
  )
}
