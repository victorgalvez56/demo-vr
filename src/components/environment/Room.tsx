import { Box, Plane } from '@react-three/drei'

interface RoomProps {
  color?: string
  floorColor?: string
  size?: [number, number, number]
}

export function Room({
  color = '#2a2a4a',
  floorColor = '#1a1a2a',
  size = [10, 4, 10],
}: RoomProps) {
  const [width, height, depth] = size

  return (
    <group>
      {/* Floor */}
      <Plane
        args={[width, depth]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color={floorColor} />
      </Plane>

      {/* Ceiling */}
      <Plane
        args={[width, depth]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
      >
        <meshStandardMaterial color={color} />
      </Plane>

      {/* Back wall */}
      <Plane args={[width, height]} position={[0, height / 2, -depth / 2]}>
        <meshStandardMaterial color={color} />
      </Plane>

      {/* Front wall (with opening) */}
      <Plane
        args={[width, height]}
        position={[0, height / 2, depth / 2]}
        rotation={[0, Math.PI, 0]}
      >
        <meshStandardMaterial color={color} />
      </Plane>

      {/* Left wall */}
      <Plane
        args={[depth, height]}
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <meshStandardMaterial color={color} />
      </Plane>

      {/* Right wall */}
      <Plane
        args={[depth, height]}
        position={[width / 2, height / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <meshStandardMaterial color={color} />
      </Plane>
    </group>
  )
}

// Desk component for office/bank scenes
export function Desk({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      {/* Desk top */}
      <Box args={[1.5, 0.05, 0.8]} position={[0, 0.75, 0]} castShadow>
        <meshStandardMaterial color="#5d4037" />
      </Box>
      {/* Legs */}
      <Box args={[0.05, 0.75, 0.05]} position={[-0.7, 0.375, -0.35]}>
        <meshStandardMaterial color="#4e342e" />
      </Box>
      <Box args={[0.05, 0.75, 0.05]} position={[0.7, 0.375, -0.35]}>
        <meshStandardMaterial color="#4e342e" />
      </Box>
      <Box args={[0.05, 0.75, 0.05]} position={[-0.7, 0.375, 0.35]}>
        <meshStandardMaterial color="#4e342e" />
      </Box>
      <Box args={[0.05, 0.75, 0.05]} position={[0.7, 0.375, 0.35]}>
        <meshStandardMaterial color="#4e342e" />
      </Box>
    </group>
  )
}

// Simple chair
export function Chair({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      {/* Seat */}
      <Box args={[0.5, 0.05, 0.5]} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#37474f" />
      </Box>
      {/* Back */}
      <Box args={[0.5, 0.5, 0.05]} position={[0, 0.7, -0.225]}>
        <meshStandardMaterial color="#37474f" />
      </Box>
      {/* Legs */}
      <Box args={[0.05, 0.45, 0.05]} position={[-0.2, 0.225, -0.2]}>
        <meshStandardMaterial color="#263238" />
      </Box>
      <Box args={[0.05, 0.45, 0.05]} position={[0.2, 0.225, -0.2]}>
        <meshStandardMaterial color="#263238" />
      </Box>
      <Box args={[0.05, 0.45, 0.05]} position={[-0.2, 0.225, 0.2]}>
        <meshStandardMaterial color="#263238" />
      </Box>
      <Box args={[0.05, 0.45, 0.05]} position={[0.2, 0.225, 0.2]}>
        <meshStandardMaterial color="#263238" />
      </Box>
    </group>
  )
}
