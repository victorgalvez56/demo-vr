import { useState, useEffect } from 'react'
import { RoundedBox, Text } from '@react-three/drei'
import type { Dialogue, DialogLine } from '../../data/dialogues'

interface DialogPanelProps {
  dialogue: Dialogue
  position?: [number, number, number]
  onComplete?: () => void
}

export function DialogPanel({
  dialogue,
  position = [0, 1.5, -2],
  onComplete,
}: DialogPanelProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  const currentLine: DialogLine | undefined = dialogue.lines[currentLineIndex]

  // Typewriter effect
  useEffect(() => {
    if (!currentLine) return

    setDisplayedText('')
    setIsTyping(true)

    let charIndex = 0
    const text = currentLine.text
    const interval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [currentLine])

  // Auto-advance after duration
  useEffect(() => {
    if (isTyping || !currentLine) return

    const timeout = setTimeout(() => {
      if (currentLineIndex < dialogue.lines.length - 1) {
        setCurrentLineIndex(prev => prev + 1)
      } else {
        onComplete?.()
      }
    }, currentLine.duration || 3000)

    return () => clearTimeout(timeout)
  }, [isTyping, currentLineIndex, dialogue.lines.length, currentLine, onComplete])

  if (!currentLine) return null

  const speakerColor = currentLine.speaker === 'guide' ? '#4CAF50' : '#2196F3'

  return (
    <group position={position}>
      {/* Background panel */}
      <RoundedBox args={[2.5, 0.8, 0.05]} radius={0.05}>
        <meshStandardMaterial color="#1a1a2e" opacity={0.95} transparent />
      </RoundedBox>

      {/* Speaker name */}
      <Text
        position={[-1, 0.25, 0.03]}
        fontSize={0.08}
        color={speakerColor}
        anchorX="left"
        font="/fonts/Inter-Bold.woff"
      >
        {currentLine.speakerName}
      </Text>

      {/* Dialog text */}
      <Text
        position={[0, -0.05, 0.03]}
        fontSize={0.07}
        color="#ffffff"
        maxWidth={2.2}
        textAlign="center"
        anchorY="top"
        font="/fonts/Inter-Regular.woff"
      >
        {displayedText}
      </Text>

      {/* Progress indicator */}
      <Text
        position={[1, -0.3, 0.03]}
        fontSize={0.05}
        color="#666666"
        anchorX="right"
      >
        {`${currentLineIndex + 1}/${dialogue.lines.length}`}
      </Text>

      {/* Typing indicator */}
      {isTyping && (
        <Text
          position={[-1, -0.3, 0.03]}
          fontSize={0.05}
          color="#888888"
          anchorX="left"
        >
          ...
        </Text>
      )}
    </group>
  )
}
