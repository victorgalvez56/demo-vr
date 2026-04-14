import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { XR, createXRStore, XROrigin, useXRInputSourceState } from '@react-three/xr'
import { Text, RoundedBox, Box, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import './App.css'

const xrStore = createXRStore()

// ============== COMPONENTE: MOVIMIENTO VR ==============
function VRMovement({
  playerPosition,
  setPlayerPosition
}: {
  playerPosition: [number, number, number]
  setPlayerPosition: (pos: [number, number, number]) => void
}) {
  const leftController = useXRInputSourceState('controller', 'left')
  const rightController = useXRInputSourceState('controller', 'right')

  useFrame((_, delta) => {
    // Usar thumbstick izquierdo para moverse
    const leftThumbstick = leftController?.gamepad?.['xr-standard-thumbstick']
    // Usar thumbstick derecho para rotar (opcional)
    const rightThumbstick = rightController?.gamepad?.['xr-standard-thumbstick']

    if (leftThumbstick) {
      const x = leftThumbstick.xAxis || 0
      const z = leftThumbstick.yAxis || 0

      // Solo mover si hay input significativo
      if (Math.abs(x) > 0.1 || Math.abs(z) > 0.1) {
        const speed = 2 * delta
        const newX = playerPosition[0] + x * speed
        const newZ = playerPosition[2] + z * speed

        // Limitar movimiento dentro del banco
        const clampedX = Math.max(-6, Math.min(6, newX))
        const clampedZ = Math.max(-4, Math.min(4, newZ))

        setPlayerPosition([clampedX, playerPosition[1], clampedZ])
      }
    }

    // Thumbstick derecho - movimiento lateral alternativo
    if (rightThumbstick) {
      const x = rightThumbstick.xAxis || 0
      const z = rightThumbstick.yAxis || 0

      if (Math.abs(x) > 0.1 || Math.abs(z) > 0.1) {
        const speed = 2 * delta
        const newX = playerPosition[0] + x * speed
        const newZ = playerPosition[2] + z * speed

        const clampedX = Math.max(-6, Math.min(6, newX))
        const clampedZ = Math.max(-4, Math.min(4, newZ))

        setPlayerPosition([clampedX, playerPosition[1], clampedZ])
      }
    }
  })

  return null
}

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
  { speaker: 'narration', text: 'Un asesor del BCP se acerca a atenderte...', delay: 2000 },
  { speaker: 'advisor', text: '¡Hola! Soy Carlos, asesor financiero del BCP.', delay: 3000 },
  { speaker: 'advisor', text: 'Me comentaron que acabas de recibir tu primer sueldo. ¡Felicidades!', delay: 3500 },
  { speaker: 'advisor', text: 'Son S/1,000 soles... una cantidad importante.', delay: 3000 },
  { speaker: 'advisor', text: 'En el BCP queremos ayudarte a hacer crecer tu dinero.', delay: 3500 },
  { speaker: 'advisor', text: 'Déjame preguntarte algo...', delay: 2500 },
]

const choiceDialog: DialogLine[] = [
  { speaker: 'advisor', text: '¿Qué planeas hacer con tu primer sueldo?', delay: 2000 },
]

const getResponseDialog = (choice: string): DialogLine[] => {
  switch (choice) {
    case 'gastar':
      return [
        { speaker: 'advisor', text: 'Hmm... entiendo la tentación.', delay: 2500 },
        { speaker: 'advisor', text: 'Pero déjame darte un consejo del BCP.', delay: 3000 },
        { speaker: 'advisor', text: 'Sin ahorros, cualquier emergencia se convierte en crisis.', delay: 3500 },
        { speaker: 'advisor', text: 'Una reparación del carro, una emergencia de salud...', delay: 3000 },
        { speaker: 'advisor', text: 'Te verías obligado a pedir préstamos con intereses altos.', delay: 2500 },
      ]
    case 'equilibrio':
      return [
        { speaker: 'advisor', text: '¡Excelente decisión!', delay: 2500 },
        { speaker: 'advisor', text: 'La regla 50/50 es lo que recomendamos en el BCP.', delay: 3000 },
        { speaker: 'advisor', text: 'Disfrutas el presente sin sacrificar tu futuro.', delay: 3000 },
        { speaker: 'advisor', text: 'Con nuestra Cuenta de Ahorros ganarás 5.5% TEA.', delay: 3000 },
      ]
    case 'ahorrar':
      return [
        { speaker: 'advisor', text: '¡Impresionante disciplina financiera!', delay: 2500 },
        { speaker: 'advisor', text: 'Ahorrar el 80% es lo que hacen los más exitosos.', delay: 3500 },
        { speaker: 'advisor', text: 'Con el interés compuesto del BCP, tu dinero crecerá cada mes.', delay: 4000 },
        { speaker: 'advisor', text: 'En 10 años, podrías duplicar tu capital.', delay: 3000 },
      ]
    default:
      return []
  }
}

const lessonDialog: DialogLine[] = [
  { speaker: 'advisor', text: 'Te dejo con el consejo más importante del BCP...', delay: 2500 },
  { speaker: 'advisor', text: '"Págate a ti mismo primero."', delay: 3000 },
  { speaker: 'advisor', text: 'Antes de pagar cuentas o comprar cosas...', delay: 3000 },
  { speaker: 'advisor', text: 'Aparta un porcentaje para tu Cuenta de Ahorros BCP.', delay: 3000 },
  { speaker: 'advisor', text: 'Tu yo del futuro te lo agradecerá.', delay: 3000 },
  { speaker: 'advisor', text: '¡Gracias por confiar en el BCP! Hasta pronto.', delay: 3500 },
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

  // Colores BCP
  const SKIN_COLOR = '#D4A574'
  const HAIR_COLOR = '#1a1a1a'
  const SUIT_COLOR = '#002A8D' // Azul BCP
  const TIE_COLOR = '#FF7800' // Naranja BCP

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
      {/* ========== PIERNAS ========== */}
      <Cylinder args={[0.07, 0.06, 0.7, 10]} position={[-0.1, 0.35, 0]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Cylinder>
      <Cylinder args={[0.07, 0.06, 0.7, 10]} position={[0.1, 0.35, 0]}>
        <meshStandardMaterial color="#1a1a2e" />
      </Cylinder>

      {/* Zapatos */}
      <Box args={[0.1, 0.05, 0.16]} position={[-0.1, -0.02, 0.03]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.1, 0.05, 0.16]} position={[0.1, -0.02, 0.03]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>

      {/* ========== TORSO (Saco azul BCP) ========== */}
      <Box args={[0.4, 0.55, 0.22]} position={[0, 0.95, 0]}>
        <meshStandardMaterial color={SUIT_COLOR} />
      </Box>

      {/* Solapas del saco */}
      <Box args={[0.1, 0.2, 0.03]} position={[-0.1, 1.05, 0.11]} rotation={[0, 0, 0.15]}>
        <meshStandardMaterial color={SUIT_COLOR} />
      </Box>
      <Box args={[0.1, 0.2, 0.03]} position={[0.1, 1.05, 0.11]} rotation={[0, 0, -0.15]}>
        <meshStandardMaterial color={SUIT_COLOR} />
      </Box>

      {/* Camisa visible */}
      <Box args={[0.1, 0.3, 0.02]} position={[0, 0.95, 0.11]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>

      {/* Corbata naranja BCP */}
      <Box args={[0.06, 0.35, 0.02]} position={[0, 0.9, 0.12]}>
        <meshStandardMaterial color={TIE_COLOR} />
      </Box>
      {/* Nudo de corbata */}
      <Box args={[0.07, 0.05, 0.02]} position={[0, 1.12, 0.12]}>
        <meshStandardMaterial color={TIE_COLOR} />
      </Box>

      {/* Fotocheck BCP */}
      <group position={[0.15, 1.05, 0.12]}>
        <Box args={[0.08, 0.1, 0.01]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        <Text position={[0, 0.015, 0.01]} fontSize={0.02} color="#002A8D">
          BCP
        </Text>
        <Text position={[0, -0.02, 0.01]} fontSize={0.012} color="#333333">
          Carlos
        </Text>
      </group>

      {/* Botones */}
      <mesh position={[0, 0.85, 0.12]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 0.75, 0.12]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* ========== CUELLO ========== */}
      <Cylinder args={[0.07, 0.08, 0.1, 10]} position={[0, 1.28, 0]}>
        <meshStandardMaterial color={SKIN_COLOR} />
      </Cylinder>

      {/* ========== CABEZA ========== */}
      <group position={[0, 1.5, 0]}>
        {/* Cabeza base */}
        <mesh>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial color={SKIN_COLOR} />
        </mesh>

        {/* Pelo */}
        <mesh position={[0, 0.06, -0.02]}>
          <sphereGeometry args={[0.15, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshStandardMaterial color={HAIR_COLOR} />
        </mesh>

        {/* Lados del pelo */}
        <Box args={[0.12, 0.06, 0.08]} position={[-0.08, 0.02, -0.04]}>
          <meshStandardMaterial color={HAIR_COLOR} />
        </Box>
        <Box args={[0.12, 0.06, 0.08]} position={[0.08, 0.02, -0.04]}>
          <meshStandardMaterial color={HAIR_COLOR} />
        </Box>

        {/* Orejas */}
        <mesh position={[-0.15, 0, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={SKIN_COLOR} />
        </mesh>
        <mesh position={[0.15, 0, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={SKIN_COLOR} />
        </mesh>

        {/* Cejas */}
        <Box args={[0.035, 0.01, 0.01]} position={[-0.045, 0.05, 0.12]} rotation={[0, 0, 0.1]}>
          <meshStandardMaterial color={HAIR_COLOR} />
        </Box>
        <Box args={[0.035, 0.01, 0.01]} position={[0.045, 0.05, 0.12]} rotation={[0, 0, -0.1]}>
          <meshStandardMaterial color={HAIR_COLOR} />
        </Box>

        {/* Ojos */}
        {/* Ojo izquierdo */}
        <mesh position={[-0.045, 0.02, 0.12]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.045, 0.02, 0.14]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
        <mesh position={[-0.045, 0.02, 0.145]}>
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>

        {/* Ojo derecho */}
        <mesh position={[0.045, 0.02, 0.12]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.045, 0.02, 0.14]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
        <mesh position={[0.045, 0.02, 0.145]}>
          <sphereGeometry args={[0.006, 6, 6]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>

        {/* Nariz */}
        <mesh position={[0, -0.02, 0.14]} scale={[0.6, 0.8, 0.8]}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshStandardMaterial color={SKIN_COLOR} />
        </mesh>

        {/* Boca (animada) */}
        <mesh position={[0, -0.08, 0.12]} scale={[1, mouthOpen ? 1.5 : 0.5, 1]}>
          <boxGeometry args={[0.05, 0.02, 0.02]} />
          <meshStandardMaterial color="#a06050" />
        </mesh>
      </group>

      {/* ========== BRAZOS ========== */}
      {/* Brazo izquierdo */}
      <Cylinder args={[0.05, 0.045, 0.35, 8]} position={[-0.26, 1.0, 0]} rotation={[0, 0, 0.15]}>
        <meshStandardMaterial color={SUIT_COLOR} />
      </Cylinder>
      <Cylinder args={[0.045, 0.04, 0.3, 8]} position={[-0.32, 0.65, 0.05]} rotation={[0.2, 0, 0.1]}>
        <meshStandardMaterial color={SUIT_COLOR} />
      </Cylinder>
      {/* Mano izquierda */}
      <mesh position={[-0.35, 0.48, 0.1]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial color={SKIN_COLOR} />
      </mesh>

      {/* Brazo derecho */}
      <Cylinder args={[0.05, 0.045, 0.35, 8]} position={[0.26, 1.0, 0]} rotation={[0, 0, -0.15]}>
        <meshStandardMaterial color={SUIT_COLOR} />
      </Cylinder>
      <Cylinder args={[0.045, 0.04, 0.3, 8]} position={[0.32, 0.65, 0.05]} rotation={[0.2, 0, -0.1]}>
        <meshStandardMaterial color={SUIT_COLOR} />
      </Cylinder>
      {/* Mano derecha */}
      <mesh position={[0.35, 0.48, 0.1]}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial color={SKIN_COLOR} />
      </mesh>

      {/* ========== NOMBRE FLOTANTE ========== */}
      <group position={[0, 1.85, 0]}>
        <RoundedBox args={[0.9, 0.14, 0.02]} radius={0.02}>
          <meshStandardMaterial color="#002A8D" />
        </RoundedBox>
        <Text position={[0, 0, 0.015]} fontSize={0.05} color="#ffffff" anchorX="center">
          Carlos - Asesor BCP
        </Text>
      </group>
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

// ============== COMPONENTE: BANCO BCP ==============
function Bank() {
  // Colores oficiales BCP
  const BCP_BLUE = '#002A8D'
  const BCP_ORANGE = '#FF7800'

  return (
    <group>
      {/* ===== ESTRUCTURA PRINCIPAL ===== */}

      {/* Piso de mármol claro */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#f5f5f5" metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Patrón del piso */}
      {[-6, -3, 0, 3, 6].map((x, i) => (
        <mesh key={`floor-line-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
          <planeGeometry args={[0.03, 12]} />
          <meshStandardMaterial color="#e0e0e0" />
        </mesh>
      ))}

      {/* Pared trasera principal - Azul BCP */}
      <mesh position={[0, 3, -5.5]}>
        <planeGeometry args={[16, 6]} />
        <meshStandardMaterial color={BCP_BLUE} />
      </mesh>

      {/* Franja naranja BCP decorativa */}
      <mesh position={[0, 1.2, -5.48]}>
        <planeGeometry args={[16, 0.2]} />
        <meshStandardMaterial color={BCP_ORANGE} />
      </mesh>

      {/* Paredes laterales */}
      <mesh position={[-8, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[8, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Techo */}
      <mesh position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#fafafa" />
      </mesh>

      {/* ===== LOGO BCP ===== */}
      <group position={[0, 4.2, -5.4]}>
        {/* Símbolo > naranja izquierdo */}
        <Text position={[-1.3, 0, 0.02]} fontSize={0.6} color={BCP_ORANGE}>
          {'›'}
        </Text>
        {/* Texto BCP */}
        <Text position={[0, 0, 0.02]} fontSize={0.5} color="#ffffff" fontWeight="bold">
          BCP
        </Text>
        {/* Símbolo > naranja derecho (más pequeño) */}
        <Text position={[1.1, -0.15, 0.02]} fontSize={0.35} color={BCP_ORANGE}>
          {'›'}
        </Text>
        {/* Nombre completo debajo */}
        <Text position={[0, -0.8, 0.02]} fontSize={0.12} color="#ffffff">
          Banco de Crédito del Perú
        </Text>
      </group>

      {/* ===== MOSTRADOR DE ATENCIÓN BCP ===== */}
      <group position={[0, 0, -2.5]}>
        {/* Mostrador base */}
        <Box args={[4.5, 1.1, 0.9]} position={[0, 0.55, 0]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        {/* Superficie del mostrador */}
        <Box args={[4.6, 0.05, 1]} position={[0, 1.12, 0]}>
          <meshStandardMaterial color="#e0e0e0" metalness={0.3} roughness={0.4} />
        </Box>
        {/* Frente azul BCP */}
        <Box args={[4.3, 0.85, 0.05]} position={[0, 0.5, 0.43]}>
          <meshStandardMaterial color={BCP_BLUE} />
        </Box>
        {/* Línea naranja BCP */}
        <Box args={[4.3, 0.08, 0.06]} position={[0, 0.98, 0.43]}>
          <meshStandardMaterial color={BCP_ORANGE} />
        </Box>
        {/* Logo pequeño en mostrador */}
        <Text position={[0, 0.5, 0.47]} fontSize={0.15} color="#ffffff">
          BCP
        </Text>
      </group>

      {/* ===== MONITOR EN MOSTRADOR ===== */}
      <group position={[1.5, 1.15, -2.5]}>
        <Cylinder args={[0.12, 0.15, 0.04, 16]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#333333" />
        </Cylinder>
        <Box args={[0.04, 0.25, 0.04]} position={[0, 0.12, 0]}>
          <meshStandardMaterial color="#333333" />
        </Box>
        <Box args={[0.45, 0.32, 0.02]} position={[0, 0.32, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box args={[0.42, 0.28, 0.01]} position={[0, 0.32, 0.015]}>
          <meshStandardMaterial color={BCP_BLUE} emissive={BCP_BLUE} emissiveIntensity={0.15} />
        </Box>
      </group>

      {/* ===== SILLAS DE ESPERA BCP ===== */}
      {[-2.5, -1.2, 1.2, 2.5].map((x, i) => (
        <group key={`chair-${i}`} position={[x, 0, 2.5]}>
          <Box args={[0.5, 0.08, 0.5]} position={[0, 0.45, 0]}>
            <meshStandardMaterial color={BCP_BLUE} />
          </Box>
          <Box args={[0.5, 0.5, 0.08]} position={[0, 0.75, -0.21]}>
            <meshStandardMaterial color={BCP_BLUE} />
          </Box>
          {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([px, pz], j) => (
            <Cylinder key={j} args={[0.02, 0.02, 0.45, 8]} position={[px, 0.225, pz]}>
              <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </Cylinder>
          ))}
        </group>
      ))}

      {/* ===== PLANTAS DECORATIVAS ===== */}
      {[[-7, -4], [7, -4]].map(([x, z], i) => (
        <group key={`plant-${i}`} position={[x, 0, z]}>
          <Cylinder args={[0.3, 0.25, 0.6, 16]} position={[0, 0.3, 0]}>
            <meshStandardMaterial color="#f0f0f0" />
          </Cylinder>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#2e7d32" />
          </mesh>
          <mesh position={[0.25, 1.2, 0.15]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial color="#388e3c" />
          </mesh>
        </group>
      ))}

      {/* ===== VENTANALES ===== */}
      {[-3, 3].map((z, i) => (
        <group key={`window-${i}`} position={[7.95, 3, z]}>
          <Box args={[0.1, 3.5, 2.8]}>
            <meshStandardMaterial color="#e0e0e0" />
          </Box>
          <Box args={[0.05, 3.2, 2.5]} position={[0.03, 0, 0]}>
            <meshStandardMaterial
              color="#a8d5ff"
              transparent
              opacity={0.5}
              emissive="#87CEEB"
              emissiveIntensity={0.2}
            />
          </Box>
          <pointLight position={[0.5, 0, 0]} intensity={0.4} color="#fff8e1" />
        </group>
      ))}

      {/* ===== PANTALLA DIGITAL BCP ===== */}
      <group position={[-5.5, 3.2, -5.35]}>
        <Box args={[2.2, 1.4, 0.1]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box args={[2, 1.2, 0.05]} position={[0, 0, 0.06]}>
          <meshStandardMaterial color={BCP_BLUE} emissive={BCP_BLUE} emissiveIntensity={0.2} />
        </Box>
        <Text position={[0, 0.35, 0.09]} fontSize={0.1} color={BCP_ORANGE}>
          Cuenta de Ahorros
        </Text>
        <Text position={[0, 0.05, 0.09]} fontSize={0.14} color="#ffffff">
          5.5% TEA
        </Text>
        <Text position={[0, -0.2, 0.09]} fontSize={0.06} color="#aaaaaa">
          *Sujeto a condiciones
        </Text>
        <Text position={[0, -0.45, 0.09]} fontSize={0.05} color="#ffffff">
          viabcp.com
        </Text>
      </group>

      {/* ===== PANTALLA DE TURNOS ===== */}
      <group position={[5.5, 3.2, -5.35]}>
        <Box args={[1.8, 1.4, 0.1]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box args={[1.6, 1.2, 0.05]} position={[0, 0, 0.06]}>
          <meshStandardMaterial color="#111111" />
        </Box>
        <Text position={[0, 0.35, 0.09]} fontSize={0.08} color={BCP_ORANGE}>
          TURNO ACTUAL
        </Text>
        <Text position={[0, 0, 0.09]} fontSize={0.25} color="#00ff00">
          A-015
        </Text>
        <Text position={[0, -0.35, 0.09]} fontSize={0.06} color="#888888">
          Ventanilla 2
        </Text>
      </group>

      {/* ===== CAJEROS ATM ===== */}
      <group position={[-6.5, 0, 0]}>
        <Box args={[0.8, 1.8, 0.6]} position={[0, 0.9, 0]}>
          <meshStandardMaterial color={BCP_BLUE} />
        </Box>
        <Box args={[0.5, 0.4, 0.05]} position={[0, 1.3, 0.33]}>
          <meshStandardMaterial color="#111111" />
        </Box>
        <Box args={[0.45, 0.35, 0.02]} position={[0, 1.3, 0.35]}>
          <meshStandardMaterial color="#0066cc" emissive="#0066cc" emissiveIntensity={0.3} />
        </Box>
        <Text position={[0, 1.65, 0.31]} fontSize={0.06} color="#ffffff">
          ATM
        </Text>
        <Box args={[0.3, 0.05, 0.08]} position={[0, 0.9, 0.35]}>
          <meshStandardMaterial color="#333333" />
        </Box>
      </group>

      {/* ===== CUERDA DE ESPERA ===== */}
      <group position={[0, 0, 1]}>
        {[-2, 2].map((x, i) => (
          <group key={`post-${i}`} position={[x, 0, 0]}>
            <Cylinder args={[0.04, 0.06, 1, 16]} position={[0, 0.5, 0]}>
              <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </Cylinder>
            <mesh position={[0, 1.02, 0]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}
        <Cylinder args={[0.015, 0.015, 4, 8]} position={[0, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color={BCP_BLUE} />
        </Cylinder>
      </group>

      {/* ===== SEÑALIZACIÓN BCP ===== */}
      <group position={[3.5, 0, -1]}>
        <Cylinder args={[0.03, 0.03, 1.3, 8]} position={[0, 0.65, 0]}>
          <meshStandardMaterial color="#666666" />
        </Cylinder>
        <Box args={[0.7, 0.45, 0.05]} position={[0, 1.4, 0]}>
          <meshStandardMaterial color={BCP_BLUE} />
        </Box>
        <Text position={[0, 1.48, 0.03]} fontSize={0.07} color="#ffffff">
          Plataforma
        </Text>
        <Text position={[0, 1.32, 0.03]} fontSize={0.05} color={BCP_ORANGE}>
          Atención al Cliente
        </Text>
      </group>

      {/* ===== DISPENSER DE TICKETS ===== */}
      <group position={[-3.5, 0, 1.5]}>
        <Box args={[0.4, 1.2, 0.3]} position={[0, 0.6, 0]}>
          <meshStandardMaterial color={BCP_BLUE} />
        </Box>
        <Box args={[0.25, 0.2, 0.05]} position={[0, 1, 0.18]}>
          <meshStandardMaterial color="#111111" />
        </Box>
        <Text position={[0, 1.3, 0.16]} fontSize={0.04} color="#ffffff">
          RETIRE SU
        </Text>
        <Text position={[0, 1.22, 0.16]} fontSize={0.04} color={BCP_ORANGE}>
          TICKET
        </Text>
      </group>
    </group>
  )
}

// ============== COMPONENTE: HUD ==============
function MoneyDisplay({ money, savings }: { money: number; savings: number }) {
  return (
    <group position={[2, 2.5, -2.5]}>
      <RoundedBox args={[0.9, 0.5, 0.03]} radius={0.03}>
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.9} />
      </RoundedBox>
      <Text position={[0, 0.12, 0.02]} fontSize={0.06} color="#FFD700">
        Tu Dinero
      </Text>
      <Text position={[0, -0.02, 0.02]} fontSize={0.045} color="#4CAF50">
        {`💵 S/${money}`}
      </Text>
      <Text position={[0, -0.14, 0.02]} fontSize={0.045} color="#2196F3">
        {`🏦 S/${savings}`}
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
      {/* Iluminación profesional de banco */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={0.7} castShadow />
      <pointLight position={[-4, 4, -2]} intensity={0.4} color="#fff8e1" />
      <pointLight position={[4, 4, -2]} intensity={0.4} color="#fff8e1" />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffffff" />
      {/* Luz de acento en el mostrador */}
      <spotLight
        position={[0, 4, -1]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.6}
        color="#fff5e6"
        castShadow
      />

      {/* Banco */}
      <Bank />

      {/* Asesor - posicionado más a la izquierda para no obstruir */}
      <Advisor
        position={[-1.5, 0, -2]}
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

      {/* Burbuja de diálogo - Se oculta cuando aparecen las opciones */}
      <SpeechBubble
        text={currentText}
        position={[-1.5, 2.2, -2.5]}
        isVisible={currentText !== '' && gameState.phase !== 'waiting' && gameState.phase !== 'end' && !showChoices}
        isNarration={isNarration}
      />

      {/* Opciones de elección - Centradas frente al usuario */}
      {showChoices && (
        <group position={[0.5, 1.4, -2]}>
          {/* Título de la pregunta */}
          <Text position={[0, 0.8, 0]} fontSize={0.1} color="#FF7800">
            ¿Qué harás con tu sueldo?
          </Text>
          <ChoiceButton
            position={[0, 0.35, 0]}
            text="💸 Gastar casi todo"
            description="S/900 para mí, S/100 de ahorro"
            color="#c62828"
            onClick={() => handleChoice('gastar')}
            delay={0}
          />
          <ChoiceButton
            position={[0, -0.15, 0]}
            text="⚖️ Mitad y mitad"
            description="S/500 para mí, S/500 de ahorro"
            color="#0066cc"
            onClick={() => handleChoice('equilibrio')}
            delay={300}
          />
          <ChoiceButton
            position={[0, -0.65, 0]}
            text="🏦 Ahorrar la mayoría"
            description="S/200 para mí, S/800 de ahorro"
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
            {`💵 Efectivo: S/${gameState.money}  |  🏦 Ahorros: S/${gameState.savings}`}
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

// ============== COMPONENTE: ESCENA CON MOVIMIENTO ==============
function XRScene() {
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 1])

  return (
    <>
      <XROrigin position={playerPosition} />
      <VRMovement playerPosition={playerPosition} setPlayerPosition={setPlayerPosition} />
      <FinanceScene />
    </>
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
        camera={{ position: [0, 1.6, 1], fov: 75 }}
        shadows
      >
        <XR store={xrStore}>
          <XRScene />
        </XR>
      </Canvas>
    </div>
  )
}

export default App
