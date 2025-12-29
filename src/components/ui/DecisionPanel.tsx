import { useState } from 'react'
import { RoundedBox, Text } from '@react-three/drei'
import type { DecisionPoint, DecisionOption } from '../../data/decisions'
import { useGameStore } from '../../store/gameStore'

interface DecisionPanelProps {
  decision: DecisionPoint
  position?: [number, number, number]
  onDecisionMade?: (option: DecisionOption) => void
}

interface OptionButtonProps {
  option: DecisionOption
  index: number
  isHovered: boolean
  isSelected: boolean
  onHover: (index: number | null) => void
  onSelect: (option: DecisionOption) => void
}

function OptionButton({
  option,
  index,
  isHovered,
  isSelected,
  onHover,
  onSelect,
}: OptionButtonProps) {
  const yOffset = -0.4 - index * 0.35

  return (
    <group position={[0, yOffset, 0.02]}>
      <RoundedBox
        args={[2.3, 0.3, 0.03]}
        radius={0.03}
        onPointerEnter={() => onHover(index)}
        onPointerLeave={() => onHover(null)}
        onClick={() => onSelect(option)}
      >
        <meshStandardMaterial
          color={isSelected ? '#4CAF50' : isHovered ? '#3a3a5e' : '#2a2a4e'}
        />
      </RoundedBox>

      <Text
        position={[-1, 0.05, 0.02]}
        fontSize={0.065}
        color={isSelected ? '#ffffff' : '#e0e0e0'}
        anchorX="left"
        maxWidth={2.1}
        font="/fonts/Inter-Bold.woff"
      >
        {option.text}
      </Text>

      <Text
        position={[-1, -0.07, 0.02]}
        fontSize={0.045}
        color="#aaaaaa"
        anchorX="left"
        maxWidth={2.1}
        font="/fonts/Inter-Regular.woff"
      >
        {option.description}
      </Text>
    </group>
  )
}

export function DecisionPanel({
  decision,
  position = [0, 1.5, -2],
  onDecisionMade,
}: DecisionPanelProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedOption, setSelectedOption] = useState<DecisionOption | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const makeDecision = useGameStore((state) => state.makeDecision)
  const setScene = useGameStore((state) => state.setScene)

  const handleSelect = (option: DecisionOption) => {
    if (selectedOption) return

    setSelectedOption(option)
    setShowFeedback(true)

    // Apply decision to game state
    makeDecision({
      id: option.id,
      text: option.text,
      scene: decision.scene,
      chosen: true,
      impact: option.impact,
    })

    // Transition to next scene after showing feedback
    setTimeout(() => {
      onDecisionMade?.(option)
      if (option.nextScene) {
        setScene(option.nextScene)
      }
    }, 4000)
  }

  const panelHeight = 0.8 + decision.options.length * 0.35

  return (
    <group position={position}>
      {/* Main panel background */}
      <RoundedBox args={[2.6, panelHeight, 0.05]} radius={0.05}>
        <meshStandardMaterial color="#1a1a2e" opacity={0.95} transparent />
      </RoundedBox>

      {/* Title */}
      <Text
        position={[0, panelHeight / 2 - 0.15, 0.03]}
        fontSize={0.1}
        color="#FFD700"
        font="/fonts/Inter-Bold.woff"
      >
        {decision.title}
      </Text>

      {/* Situation description */}
      <Text
        position={[0, panelHeight / 2 - 0.35, 0.03]}
        fontSize={0.055}
        color="#cccccc"
        maxWidth={2.3}
        textAlign="center"
        font="/fonts/Inter-Regular.woff"
      >
        {decision.situation}
      </Text>

      {/* Options or Feedback */}
      {!showFeedback ? (
        <group position={[0, panelHeight / 2 - 0.3, 0]}>
          {decision.options.map((option, index) => (
            <OptionButton
              key={option.id}
              option={option}
              index={index}
              isHovered={hoveredIndex === index}
              isSelected={selectedOption?.id === option.id}
              onHover={setHoveredIndex}
              onSelect={handleSelect}
            />
          ))}
        </group>
      ) : (
        <group position={[0, 0, 0.03]}>
          {/* Feedback panel */}
          <RoundedBox args={[2.3, 0.6, 0.02]} radius={0.03}>
            <meshStandardMaterial color="#2e4a2e" />
          </RoundedBox>

          <Text
            position={[0, 0.15, 0.02]}
            fontSize={0.07}
            color="#4CAF50"
            font="/fonts/Inter-Bold.woff"
          >
            Resultado
          </Text>

          <Text
            position={[0, -0.08, 0.02]}
            fontSize={0.055}
            color="#ffffff"
            maxWidth={2.1}
            textAlign="center"
            font="/fonts/Inter-Regular.woff"
          >
            {selectedOption?.feedback}
          </Text>
        </group>
      )}
    </group>
  )
}
