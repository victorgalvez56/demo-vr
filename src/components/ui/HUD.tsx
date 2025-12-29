import { RoundedBox, Text } from '@react-three/drei'
import { useGameStore } from '../../store/gameStore'

interface HUDProps {
  position?: [number, number, number]
}

export function HUD({ position = [-1.5, 2, -2] }: HUDProps) {
  const money = useGameStore((state) => state.money)
  const savings = useGameStore((state) => state.savings)
  const investments = useGameStore((state) => state.investments)
  const knowledgePoints = useGameStore((state) => state.knowledgePoints)
  const getFinancialHealth = useGameStore((state) => state.getFinancialHealth)

  const health = getFinancialHealth()
  const healthColors = {
    poor: '#f44336',
    fair: '#ff9800',
    good: '#4CAF50',
    excellent: '#00bcd4',
  }
  const healthLabels = {
    poor: 'Crítico',
    fair: 'Regular',
    good: 'Bueno',
    excellent: 'Excelente',
  }

  const totalWealth = money + savings + investments

  return (
    <group position={position}>
      {/* Background */}
      <RoundedBox args={[0.8, 1, 0.03]} radius={0.04}>
        <meshStandardMaterial color="#0a0a1a" opacity={0.9} transparent />
      </RoundedBox>

      {/* Title */}
      <Text
        position={[0, 0.4, 0.02]}
        fontSize={0.06}
        color="#FFD700"
        font="/fonts/Inter-Bold.woff"
      >
        💰 Estado Financiero
      </Text>

      {/* Money */}
      <group position={[0, 0.22, 0.02]}>
        <Text
          position={[-0.3, 0, 0]}
          fontSize={0.045}
          color="#888888"
          anchorX="left"
        >
          Efectivo:
        </Text>
        <Text
          position={[0.3, 0, 0]}
          fontSize={0.045}
          color="#4CAF50"
          anchorX="right"
        >
          ${money.toFixed(0)}
        </Text>
      </group>

      {/* Savings */}
      <group position={[0, 0.1, 0.02]}>
        <Text
          position={[-0.3, 0, 0]}
          fontSize={0.045}
          color="#888888"
          anchorX="left"
        >
          Ahorros:
        </Text>
        <Text
          position={[0.3, 0, 0]}
          fontSize={0.045}
          color="#2196F3"
          anchorX="right"
        >
          ${savings.toFixed(0)}
        </Text>
      </group>

      {/* Investments */}
      <group position={[0, -0.02, 0.02]}>
        <Text
          position={[-0.3, 0, 0]}
          fontSize={0.045}
          color="#888888"
          anchorX="left"
        >
          Inversiones:
        </Text>
        <Text
          position={[0.3, 0, 0]}
          fontSize={0.045}
          color="#9c27b0"
          anchorX="right"
        >
          ${investments.toFixed(0)}
        </Text>
      </group>

      {/* Divider line */}
      <mesh position={[0, -0.1, 0.02]}>
        <planeGeometry args={[0.6, 0.005]} />
        <meshBasicMaterial color="#333333" />
      </mesh>

      {/* Total */}
      <group position={[0, -0.18, 0.02]}>
        <Text
          position={[-0.3, 0, 0]}
          fontSize={0.05}
          color="#ffffff"
          anchorX="left"
          font="/fonts/Inter-Bold.woff"
        >
          Total:
        </Text>
        <Text
          position={[0.3, 0, 0]}
          fontSize={0.05}
          color="#FFD700"
          anchorX="right"
          font="/fonts/Inter-Bold.woff"
        >
          ${totalWealth.toFixed(0)}
        </Text>
      </group>

      {/* Knowledge Points */}
      <group position={[0, -0.3, 0.02]}>
        <Text
          position={[-0.3, 0, 0]}
          fontSize={0.04}
          color="#888888"
          anchorX="left"
        >
          📚 Conocimiento:
        </Text>
        <Text
          position={[0.3, 0, 0]}
          fontSize={0.04}
          color="#00bcd4"
          anchorX="right"
        >
          {knowledgePoints} pts
        </Text>
      </group>

      {/* Financial Health */}
      <group position={[0, -0.42, 0.02]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.04}
          color={healthColors[health]}
          textAlign="center"
        >
          {`Salud: ${healthLabels[health]}`}
        </Text>
      </group>
    </group>
  )
}
