import { useState } from 'react'
import { Text, RoundedBox, Stars, Float } from '@react-three/drei'
import { useGameStore } from '../store/gameStore'
import { DialogPanel } from '../components/ui/DialogPanel'
import { getDialogueByScene } from '../data/dialogues'

export function FutureScene() {
  const [showDialog, setShowDialog] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const money = useGameStore((state) => state.money)
  const savings = useGameStore((state) => state.savings)
  const investments = useGameStore((state) => state.investments)
  const knowledgePoints = useGameStore((state) => state.knowledgePoints)
  const decisionsHistory = useGameStore((state) => state.decisionsHistory)
  const getFinancialHealth = useGameStore((state) => state.getFinancialHealth)
  const resetGame = useGameStore((state) => state.resetGame)
  const setScene = useGameStore((state) => state.setScene)

  const dialogue = getDialogueByScene('future')

  // Simulate 5 years of growth
  const yearsElapsed = 5
  const annualSavingsRate = 0.06 // 6% annual
  const annualInvestmentRate = 0.10 // 10% annual

  const projectedSavings = savings * Math.pow(1 + annualSavingsRate, yearsElapsed)
  const projectedInvestments = investments * Math.pow(1 + annualInvestmentRate, yearsElapsed)
  const totalProjected = money + projectedSavings + projectedInvestments

  const health = getFinancialHealth()

  const getHealthMessage = () => {
    switch (health) {
      case 'excellent':
        return {
          title: '¡Excelente Futuro Financiero!',
          message: 'Tus decisiones inteligentes te han llevado a la libertad financiera. Tienes ahorros sólidos, inversiones diversificadas y el conocimiento para seguir creciendo.',
          color: '#00bcd4',
          emoji: '🏆',
        }
      case 'good':
        return {
          title: 'Buen Camino Financiero',
          message: 'Has tomado buenas decisiones. Tienes una base financiera estable y estás en camino hacia tus metas. Sigue aprendiendo y mejorando.',
          color: '#4CAF50',
          emoji: '⭐',
        }
      case 'fair':
        return {
          title: 'Futuro Financiero Regular',
          message: 'Algunas decisiones fueron buenas, otras no tanto. Todavía hay tiempo para mejorar tus hábitos financieros y construir un mejor futuro.',
          color: '#ff9800',
          emoji: '📊',
        }
      case 'poor':
        return {
          title: 'Advertencia Financiera',
          message: 'Las decisiones impulsivas han afectado tu futuro. Pero nunca es tarde para aprender. La educación financiera es el primer paso hacia la recuperación.',
          color: '#f44336',
          emoji: '⚠️',
        }
    }
  }

  const result = getHealthMessage()

  const handleDialogComplete = () => {
    setShowDialog(false)
    setShowResults(true)
  }

  const handleRestart = () => {
    resetGame()
    setScene('intro')
  }

  return (
    <group>
      {/* Space environment for "future" feel */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
      <color attach="background" args={['#0a0a1a']} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.8} color={result.color} />

      {/* Large emoji */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <Text position={[0, 3, -4]} fontSize={0.8}>
          {result.emoji}
        </Text>
      </Float>

      {/* Dialog */}
      {showDialog && dialogue && (
        <DialogPanel
          dialogue={dialogue}
          position={[0, 1.8, -2]}
          onComplete={handleDialogComplete}
        />
      )}

      {/* Results panel */}
      {showResults && (
        <group position={[0, 1.5, -3]}>
          {/* Main results card */}
          <RoundedBox args={[3.5, 2.5, 0.1]} radius={0.08}>
            <meshStandardMaterial color="#1a1a2e" opacity={0.95} transparent />
          </RoundedBox>

          {/* Title */}
          <Text
            position={[0, 1, 0.06]}
            fontSize={0.12}
            color={result.color}
            font="/fonts/Inter-Bold.woff"
            maxWidth={3}
            textAlign="center"
          >
            {result.title}
          </Text>

          {/* Message */}
          <Text
            position={[0, 0.55, 0.06]}
            fontSize={0.055}
            color="#cccccc"
            maxWidth={3}
            textAlign="center"
          >
            {result.message}
          </Text>

          {/* Stats after 5 years */}
          <Text
            position={[0, 0.1, 0.06]}
            fontSize={0.07}
            color="#FFD700"
            font="/fonts/Inter-Bold.woff"
          >
            Después de 5 años:
          </Text>

          {/* Financial breakdown */}
          <group position={[0, -0.2, 0.06]}>
            <Text position={[-1.2, 0, 0]} fontSize={0.05} color="#888888" anchorX="left">
              Efectivo:
            </Text>
            <Text position={[1.2, 0, 0]} fontSize={0.05} color="#4CAF50" anchorX="right">
              ${money.toFixed(0)}
            </Text>

            <Text position={[-1.2, -0.12, 0]} fontSize={0.05} color="#888888" anchorX="left">
              Ahorros (6% anual):
            </Text>
            <Text position={[1.2, -0.12, 0]} fontSize={0.05} color="#2196F3" anchorX="right">
              ${projectedSavings.toFixed(0)}
            </Text>

            <Text position={[-1.2, -0.24, 0]} fontSize={0.05} color="#888888" anchorX="left">
              Inversiones (10% anual):
            </Text>
            <Text position={[1.2, -0.24, 0]} fontSize={0.05} color="#9c27b0" anchorX="right">
              ${projectedInvestments.toFixed(0)}
            </Text>

            {/* Divider */}
            <mesh position={[0, -0.35, 0]}>
              <planeGeometry args={[2.5, 0.005]} />
              <meshBasicMaterial color="#444444" />
            </mesh>

            <Text position={[-1.2, -0.45, 0]} fontSize={0.06} color="#ffffff" anchorX="left" font="/fonts/Inter-Bold.woff">
              TOTAL:
            </Text>
            <Text position={[1.2, -0.45, 0]} fontSize={0.06} color="#FFD700" anchorX="right" font="/fonts/Inter-Bold.woff">
              ${totalProjected.toFixed(0)}
            </Text>
          </group>

          {/* Knowledge points */}
          <Text position={[0, -0.75, 0.06]} fontSize={0.045} color="#00bcd4">
            📚 Conocimiento adquirido: {knowledgePoints} puntos
          </Text>

          {/* Decisions made */}
          <Text position={[0, -0.9, 0.06]} fontSize={0.04} color="#888888">
            Decisiones tomadas: {decisionsHistory.length}
          </Text>
        </group>
      )}

      {/* Restart button */}
      {showResults && (
        <group position={[0, -0.3, -2.5]}>
          <RoundedBox
            args={[1.2, 0.4, 0.08]}
            radius={0.05}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onClick={handleRestart}
          >
            <meshStandardMaterial
              color={isHovered ? '#7c4dff' : '#5e35b1'}
              emissive={isHovered ? '#5e35b1' : '#000000'}
              emissiveIntensity={0.3}
            />
          </RoundedBox>
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.08}
            color="#ffffff"
            font="/fonts/Inter-Bold.woff"
          >
            VOLVER A JUGAR
          </Text>
        </group>
      )}

      {/* Tips panel on the side */}
      {showResults && (
        <group position={[2.5, 1.5, -2]}>
          <RoundedBox args={[1.8, 1.5, 0.05]} radius={0.05}>
            <meshStandardMaterial color="#1a2e1a" />
          </RoundedBox>
          <Text position={[0, 0.55, 0.03]} fontSize={0.07} color="#4CAF50" font="/fonts/Inter-Bold.woff">
            💡 Lecciones
          </Text>
          <Text position={[0, 0.2, 0.03]} fontSize={0.04} color="#ffffff" maxWidth={1.6} textAlign="center">
            • Págate a ti mismo primero
          </Text>
          <Text position={[0, 0, 0.03]} fontSize={0.04} color="#ffffff" maxWidth={1.6} textAlign="center">
            • Evita deudas de consumo
          </Text>
          <Text position={[0, -0.2, 0.03]} fontSize={0.04} color="#ffffff" maxWidth={1.6} textAlign="center">
            • Invierte a largo plazo
          </Text>
          <Text position={[0, -0.4, 0.03]} fontSize={0.04} color="#ffffff" maxWidth={1.6} textAlign="center">
            • Diversifica siempre
          </Text>
          <Text position={[0, -0.6, 0.03]} fontSize={0.04} color="#ffffff" maxWidth={1.6} textAlign="center">
            • Edúcate constantemente
          </Text>
        </group>
      )}

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0a0a1a" />
      </mesh>
    </group>
  )
}
