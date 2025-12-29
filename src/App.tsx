import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { XR, createXRStore, XROrigin } from '@react-three/xr'
import { Text, RoundedBox, Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

const xrStore = createXRStore()

// ============== TIPOS ==============
interface DialogLine {
  speaker: 'advisor' | 'narration'
  text: string
  delay?: number
}

interface GameState {
  phase: 'waiting' | 'talking' | 'choice' | 'response' | 'lesson' | 'end'
  dialogIndex: number
  money: number
  savings: number
  choice: string | null
}

// ============== DIÁLOGOS ==============
const introDialog: DialogLine[] = [
  { speaker: 'narration', text: 'Un asesor financiero entra a tu oficina...', delay: 2000 },
  { speaker: 'advisor', text: '¡Hola! Soy Carlos, tu asesor financiero.', delay: 3000 },
  { speaker: 'advisor', text: 'Me dijeron que acabas de recibir tu primer sueldo. ¡Felicidades!', delay: 3500 },
  { speaker: 'advisor', text: 'Son $1,000... una cantidad importante.', delay: 3000 },
  { speaker: 'advisor', text: 'La forma en que manejes este dinero marcará tu futuro.', delay: 3500 },
  { speaker: 'advisor', text: 'Déjame preguntarte algo...', delay: 2500 },
]

const choiceDialog: DialogLine[] = [
  { speaker: 'advisor', text: '¿Qué planeas hacer con ese dinero?', delay: 2000 },
]

const getResponseDialog = (choice: string): DialogLine[] => {
  switch (choice) {
    case 'gastar':
      return [
        { speaker: 'advisor', text: 'Hmm... entiendo la tentación.', delay: 2500 },
        { speaker: 'advisor', text: 'Pero déjame contarte algo importante.', delay: 3000 },
        { speaker: 'advisor', text: 'Sin ahorros, cualquier emergencia se convierte en crisis.', delay: 3500 },
        { speaker: 'advisor', text: 'Un auto descompuesto, una emergencia médica...', delay: 3000 },
        { speaker: 'advisor', text: 'Te verías obligado a endeudarte.', delay: 2500 },
      ]
    case 'equilibrio':
      return [
        { speaker: 'advisor', text: '¡Esa es una decisión inteligente!', delay: 2500 },
        { speaker: 'advisor', text: 'La regla 50/50 es un excelente comienzo.', delay: 3000 },
        { speaker: 'advisor', text: 'Disfrutas el presente sin sacrificar el futuro.', delay: 3000 },
        { speaker: 'advisor', text: 'Muchos expertos recomiendan exactamente esto.', delay: 3000 },
      ]
    case 'ahorrar':
      return [
        { speaker: 'advisor', text: '¡Impresionante disciplina!', delay: 2500 },
        { speaker: 'advisor', text: 'Ahorrar el 80% es ambicioso, pero muy inteligente.', delay: 3500 },
        { speaker: 'advisor', text: 'Con el interés compuesto, ese dinero crecerá exponencialmente.', delay: 4000 },
        { speaker: 'advisor', text: 'En 10 años, podrías tener el doble o más.', delay: 3000 },
      ]
    default:
      return []
  }
}

const lessonDialog: DialogLine[] = [
  { speaker: 'advisor', text: 'Te dejo con esta lección...', delay: 2500 },
  { speaker: 'advisor', text: '"Págate a ti mismo primero."', delay: 3000 },
  { speaker: 'advisor', text: 'Antes de pagar cuentas o comprar cosas...', delay: 3000 },
  { speaker: 'advisor', text: 'Aparta un porcentaje para tu futuro.', delay: 3000 },
  { speaker: 'advisor', text: 'Tu yo del futuro te lo agradecerá.', delay: 3000 },
  { speaker: 'advisor', text: 'Fue un placer asesorarte. ¡Hasta pronto!', delay: 3500 },
]

// ============== COMPONENTE: ASESOR FINANCIERO ==============
function Advisor({
  position,
  isTalking,
  isVisible
}: {
  position: [number, number, number]
  isTalking: boolean
  isVisible: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [mouthOpen, setMouthOpen] = useState(false)

  // Animación de entrada
  useFrame((_, delta) => {
    if (!groupRef.current) return

    const targetX = isVisible ? position[0] : position[0] - 3
    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      delta * 2
    )
  })

  // Animación de hablar
  useEffect(() => {
    if (!isTalking) {
      setMouthOpen(false)
      return
    }

    const interval = setInterval(() => {
      setMouthOpen(prev => !prev)
    }, 150)

    return () => clearInterval(interval)
  }, [isTalking])

  return (
    <group ref={groupRef} position={[position[0] - 3, position[1], position[2]]}>
      {/* Cuerpo - Traje */}
      <Cylinder args={[0.25, 0.35, 1, 16]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#1a237e" />
      </Cylinder>

      {/* Camisa */}
      <Box args={[0.15, 0.3, 0.1]} position={[0, 0.85, 0.15]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>

      {/* Corbata */}
      <Box args={[0.08, 0.35, 0.05]} position={[0, 0.75, 0.18]}>
        <meshStandardMaterial color="#c62828" />
      </Box>

      {/* Cabeza */}
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#e8beac" />
      </mesh>

      {/* Pelo */}
      <mesh position={[0, 1.38, -0.02]}>
        <sphereGeometry args={[0.18, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3e2723" />
      </mesh>

      {/* Ojos */}
      <mesh position={[-0.07, 1.28, 0.15]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.07, 1.28, 0.15]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Boca (animada) */}
      <mesh position={[0, 1.15, 0.17]} scale={[1, mouthOpen ? 1.5 : 0.5, 1]}>
        <boxGeometry args={[0.08, 0.03, 0.02]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>

      {/* Brazos */}
      <Cylinder args={[0.06, 0.06, 0.5, 8]} position={[-0.35, 0.6, 0]} rotation={[0, 0, 0.3]}>
        <meshStandardMaterial color="#1a237e" />
      </Cylinder>
      <Cylinder args={[0.06, 0.06, 0.5, 8]} position={[0.35, 0.6, 0]} rotation={[0, 0, -0.3]}>
        <meshStandardMaterial color="#1a237e" />
      </Cylinder>

      {/* Manos */}
      <mesh position={[-0.45, 0.35, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#e8beac" />
      </mesh>
      <mesh position={[0.45, 0.35, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#e8beac" />
      </mesh>

      {/* Nombre flotante */}
      <Text
        position={[0, 1.65, 0]}
        fontSize={0.08}
        color="#4CAF50"
        anchorX="center"
      >
        Carlos - Asesor Financiero
      </Text>
    </group>
  )
}

// ============== COMPONENTE: BURBUJA DE DIÁLOGO ==============
function SpeechBubble({
  text,
  position,
  isVisible,
  isNarration = false
}: {
  text: string
  position: [number, number, number]
  isVisible: boolean
  isNarration?: boolean
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText('')
      setIsComplete(false)
      return
    }

    setDisplayedText('')
    setIsComplete(false)
    let index = 0

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [text, isVisible])

  if (!isVisible) return null

  return (
    <group position={position}>
      <RoundedBox
        args={[2.8, 0.6, 0.05]}
        radius={0.08}
      >
        <meshStandardMaterial
          color={isNarration ? '#37474f' : '#ffffff'}
          transparent
          opacity={0.95}
        />
      </RoundedBox>

      {/* Pico de la burbuja (solo para advisor) */}
      {!isNarration && (
        <mesh position={[-1.2, -0.35, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.15, 0.15, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}

      <Text
        position={[0, 0, 0.03]}
        fontSize={0.07}
        color={isNarration ? '#ffffff' : '#1a1a1a'}
        maxWidth={2.5}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {displayedText}{!isComplete ? '|' : ''}
      </Text>
    </group>
  )
}

// ============== COMPONENTE: OPCIONES DE DECISIÓN ==============
function ChoiceButton({
  position,
  text,
  description,
  color,
  onClick,
  delay = 0
}: {
  position: [number, number, number]
  text: string
  description: string
  color: string
  onClick: () => void
  delay?: number
}) {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const targetScale = visible ? 1 : 0
    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, delta * 4)
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, delta * 4)
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, delta * 4)
  })

  return (
    <group ref={groupRef} position={position} scale={0}>
      <RoundedBox
        args={[2.2, 0.4, 0.08]}
        radius={0.05}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial
          color={hovered ? color : '#2a2a4a'}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </RoundedBox>
      <Text
        position={[0, 0.05, 0.05]}
        fontSize={0.07}
        color="#ffffff"
        anchorX="center"
      >
        {text}
      </Text>
      <Text
        position={[0, -0.1, 0.05]}
        fontSize={0.04}
        color="#aaaaaa"
        anchorX="center"
      >
        {description}
      </Text>
    </group>
  )
}

// ============== COMPONENTE: OFICINA ==============
function Office() {
  return (
    <group>
      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Paredes */}
      <mesh position={[0, 2, -4]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#5d4e37" />
      </mesh>
      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#5d4e37" />
      </mesh>
      <mesh position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial color="#5d4e37" />
      </mesh>

      {/* Ventana */}
      <mesh position={[4.95, 2, -1]}>
        <planeGeometry args={[0.1, 2]} />
        <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.5} />
      </mesh>

      {/* Escritorio del usuario */}
      <Box args={[2, 0.05, 1]} position={[0, 0.75, 0.5]} castShadow>
        <meshStandardMaterial color="#5d4037" />
      </Box>
      {/* Patas del escritorio */}
      <Box args={[0.05, 0.75, 0.05]} position={[-0.9, 0.375, 0.1]}>
        <meshStandardMaterial color="#4e342e" />
      </Box>
      <Box args={[0.05, 0.75, 0.05]} position={[0.9, 0.375, 0.1]}>
        <meshStandardMaterial color="#4e342e" />
      </Box>
      <Box args={[0.05, 0.75, 0.05]} position={[-0.9, 0.375, 0.9]}>
        <meshStandardMaterial color="#4e342e" />
      </Box>
      <Box args={[0.05, 0.75, 0.05]} position={[0.9, 0.375, 0.9]}>
        <meshStandardMaterial color="#4e342e" />
      </Box>

      {/* Laptop en el escritorio */}
      <group position={[0, 0.8, 0.3]}>
        <Box args={[0.4, 0.02, 0.25]}>
          <meshStandardMaterial color="#333333" />
        </Box>
        <Box args={[0.38, 0.25, 0.01]} position={[0, 0.13, -0.12]} rotation={[-0.2, 0, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box args={[0.35, 0.22, 0.005]} position={[0, 0.13, -0.115]} rotation={[-0.2, 0, 0]}>
          <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={0.3} />
        </Box>
      </group>

      {/* Silla del asesor */}
      <group position={[-1, 0, -1.5]}>
        <Box args={[0.5, 0.05, 0.5]} position={[0, 0.45, 0]}>
          <meshStandardMaterial color="#1a237e" />
        </Box>
        <Box args={[0.5, 0.6, 0.05]} position={[0, 0.75, -0.22]}>
          <meshStandardMaterial color="#1a237e" />
        </Box>
      </group>

      {/* Planta decorativa */}
      <group position={[3, 0, -3]}>
        <Cylinder args={[0.2, 0.25, 0.5, 16]} position={[0, 0.25, 0]}>
          <meshStandardMaterial color="#5d4037" />
        </Cylinder>
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#2e7d32" />
        </mesh>
      </group>

      {/* Cuadro en la pared */}
      <group position={[0, 2.5, -3.95]}>
        <Box args={[1.5, 1, 0.05]}>
          <meshStandardMaterial color="#3e2723" />
        </Box>
        <Box args={[1.3, 0.8, 0.02]} position={[0, 0, 0.04]}>
          <meshStandardMaterial color="#1565c0" />
        </Box>
        <Text position={[0, 0, 0.06]} fontSize={0.1} color="#ffffff">
          💰 FINANZAS
        </Text>
      </group>
    </group>
  )
}

// ============== COMPONENTE: HUD ==============
function MoneyDisplay({ money, savings }: { money: number; savings: number }) {
  return (
    <group position={[1.8, 2.2, -2]}>
      <RoundedBox args={[0.9, 0.5, 0.03]} radius={0.03}>
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.9} />
      </RoundedBox>
      <Text position={[0, 0.12, 0.02]} fontSize={0.06} color="#FFD700">
        Tu Dinero
      </Text>
      <Text position={[0, -0.02, 0.02]} fontSize={0.045} color="#4CAF50">
        {`💵 $${money}`}
      </Text>
      <Text position={[0, -0.14, 0.02]} fontSize={0.045} color="#2196F3">
        {`🏦 $${savings}`}
      </Text>
    </group>
  )
}

// ============== ESCENA PRINCIPAL ==============
function FinanceScene() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'waiting',
    dialogIndex: 0,
    money: 1000,
    savings: 0,
    choice: null,
  })

  const [currentText, setCurrentText] = useState('')
  const [isNarration, setIsNarration] = useState(false)
  const [showChoices, setShowChoices] = useState(false)
  const [advisorVisible, setAdvisorVisible] = useState(false)
  const [isTalking, setIsTalking] = useState(false)

  // Obtener los diálogos actuales según la fase
  const getCurrentDialogs = (): DialogLine[] => {
    switch (gameState.phase) {
      case 'talking': return introDialog
      case 'choice': return choiceDialog
      case 'response': return getResponseDialog(gameState.choice || '')
      case 'lesson': return lessonDialog
      default: return []
    }
  }

  // Iniciar la experiencia
  const startExperience = () => {
    setGameState({ ...gameState, phase: 'talking', dialogIndex: 0 })
    setTimeout(() => setAdvisorVisible(true), 500)
  }

  // Avanzar diálogo
  useEffect(() => {
    const dialogs = getCurrentDialogs()
    if (dialogs.length === 0 || gameState.dialogIndex >= dialogs.length) {
      setIsTalking(false)

      // Transiciones entre fases
      if (gameState.phase === 'talking') {
        setTimeout(() => {
          setGameState({ ...gameState, phase: 'choice', dialogIndex: 0 })
        }, 1000)
      } else if (gameState.phase === 'choice') {
        setShowChoices(true)
      } else if (gameState.phase === 'response') {
        setTimeout(() => {
          setGameState({ ...gameState, phase: 'lesson', dialogIndex: 0 })
        }, 1500)
      } else if (gameState.phase === 'lesson') {
        setTimeout(() => {
          setAdvisorVisible(false)
          setGameState({ ...gameState, phase: 'end' })
        }, 2000)
      }
      return
    }

    const currentDialog = dialogs[gameState.dialogIndex]
    setCurrentText(currentDialog.text)
    setIsNarration(currentDialog.speaker === 'narration')
    setIsTalking(currentDialog.speaker === 'advisor')

    const timer = setTimeout(() => {
      setGameState(prev => ({ ...prev, dialogIndex: prev.dialogIndex + 1 }))
    }, currentDialog.delay || 3000)

    return () => clearTimeout(timer)
  }, [gameState.phase, gameState.dialogIndex])

  // Manejar elección
  const handleChoice = (choice: string) => {
    setShowChoices(false)

    let newMoney = 1000
    let newSavings = 0

    switch (choice) {
      case 'gastar':
        newMoney = 900
        newSavings = 100
        break
      case 'equilibrio':
        newMoney = 500
        newSavings = 500
        break
      case 'ahorrar':
        newMoney = 200
        newSavings = 800
        break
    }

    setGameState({
      ...gameState,
      phase: 'response',
      dialogIndex: 0,
      choice,
      money: newMoney,
      savings: newSavings,
    })
  }

  // Reiniciar
  const restart = () => {
    setGameState({
      phase: 'waiting',
      dialogIndex: 0,
      money: 1000,
      savings: 0,
      choice: null,
    })
    setCurrentText('')
    setShowChoices(false)
    setAdvisorVisible(false)
  }

  return (
    <group>
      {/* Iluminación */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} castShadow />
      <pointLight position={[-2, 3, 0]} intensity={0.4} color="#fff5e6" />

      {/* Oficina */}
      <Office />

      {/* Asesor */}
      <Advisor
        position={[-1, 0, -1.5]}
        isTalking={isTalking}
        isVisible={advisorVisible}
      />

      {/* HUD con dinero */}
      {gameState.phase !== 'waiting' && (
        <MoneyDisplay money={gameState.money} savings={gameState.savings} />
      )}

      {/* Pantalla de inicio */}
      {gameState.phase === 'waiting' && (
        <group position={[0, 1.6, -2]}>
          <RoundedBox args={[2.5, 1.2, 0.05]} radius={0.08}>
            <meshStandardMaterial color="#1a1a2e" transparent opacity={0.95} />
          </RoundedBox>
          <Text position={[0, 0.35, 0.03]} fontSize={0.12} color="#FFD700">
            Educación Financiera VR
          </Text>
          <Text position={[0, 0.1, 0.03]} fontSize={0.06} color="#aaaaaa" maxWidth={2.2} textAlign="center">
            Un asesor financiero viene a visitarte.
          </Text>
          <Text position={[0, -0.1, 0.03]} fontSize={0.05} color="#cccccc">
            Escucha sus consejos y toma decisiones.
          </Text>

          <group position={[0, -0.35, 0.03]}>
            <RoundedBox
              args={[1.2, 0.3, 0.05]}
              radius={0.05}
              onClick={startExperience}
              onPointerEnter={() => {
                document.body.style.cursor = 'pointer'
              }}
              onPointerLeave={() => {
                document.body.style.cursor = 'default'
              }}
            >
              <meshStandardMaterial color="#2E7D32" />
            </RoundedBox>
            <Text position={[0, 0, 0.03]} fontSize={0.08} color="#ffffff">
              COMENZAR
            </Text>
          </group>
        </group>
      )}

      {/* Burbuja de diálogo */}
      <SpeechBubble
        text={currentText}
        position={[-1, 2.1, -1.5]}
        isVisible={currentText !== '' && gameState.phase !== 'waiting' && gameState.phase !== 'end'}
        isNarration={isNarration}
      />

      {/* Opciones de elección */}
      {showChoices && (
        <group position={[0, 1.4, -2]}>
          <ChoiceButton
            position={[0, 0.5, 0]}
            text="💸 Gastar casi todo"
            description="$900 para mí, $100 de ahorro"
            color="#c62828"
            onClick={() => handleChoice('gastar')}
            delay={0}
          />
          <ChoiceButton
            position={[0, 0, 0]}
            text="⚖️ Mitad y mitad"
            description="$500 para mí, $500 de ahorro"
            color="#1565C0"
            onClick={() => handleChoice('equilibrio')}
            delay={300}
          />
          <ChoiceButton
            position={[0, -0.5, 0]}
            text="🏦 Ahorrar la mayoría"
            description="$200 para mí, $800 de ahorro"
            color="#2E7D32"
            onClick={() => handleChoice('ahorrar')}
            delay={600}
          />
        </group>
      )}

      {/* Pantalla final */}
      {gameState.phase === 'end' && (
        <group position={[0, 1.6, -2]}>
          <RoundedBox args={[2.8, 1.5, 0.05]} radius={0.08}>
            <meshStandardMaterial color="#1a1a2e" transparent opacity={0.95} />
          </RoundedBox>
          <Text position={[0, 0.5, 0.03]} fontSize={0.12} color="#FFD700">
            ¡Sesión Completada!
          </Text>
          <Text position={[0, 0.25, 0.03]} fontSize={0.06} color="#ffffff">
            {`Tu decisión: ${gameState.choice === 'gastar' ? 'Gastador' : gameState.choice === 'equilibrio' ? 'Equilibrado' : 'Ahorrador'}`}
          </Text>
          <Text position={[0, 0.05, 0.03]} fontSize={0.055} color="#4CAF50">
            {`💵 Efectivo: $${gameState.money}  |  🏦 Ahorros: $${gameState.savings}`}
          </Text>
          <Text position={[0, -0.15, 0.03]} fontSize={0.05} color="#aaaaaa" maxWidth={2.5} textAlign="center">
            Recuerda: "Págate a ti mismo primero"
          </Text>

          <group position={[0, -0.45, 0.03]}>
            <RoundedBox
              args={[1.5, 0.3, 0.05]}
              radius={0.05}
              onClick={restart}
            >
              <meshStandardMaterial color="#5E35B1" />
            </RoundedBox>
            <Text position={[0, 0, 0.03]} fontSize={0.07} color="#ffffff">
              VOLVER A JUGAR
            </Text>
          </group>
        </group>
      )}
    </group>
  )
}

// ============== APP ==============
function App() {
  return (
    <div className="app-container">
      <button className="vr-button" onClick={() => xrStore.enterVR()}>
        Entrar en VR 🥽
      </button>

      <Canvas
        camera={{ position: [0, 1.6, 2], fov: 70 }}
        shadows
      >
        <XR store={xrStore}>
          <XROrigin position={[0, 0, 0]} />
          <FinanceScene />
        </XR>
      </Canvas>
    </div>
  )
}

export default App
