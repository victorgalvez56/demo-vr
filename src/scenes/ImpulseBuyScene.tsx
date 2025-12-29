import { Text, Box, Cylinder, RoundedBox } from '@react-three/drei'
import { Room } from '../components/environment/Room'
import { DecisionPanel } from '../components/ui/DecisionPanel'
import { HUD } from '../components/ui/HUD'
import { getDecisionByScene } from '../data/decisions'

export function ImpulseBuyScene() {
  const decision = getDecisionByScene('impulse-buy')

  return (
    <group>
      {/* Store room */}
      <Room color="#4a4a6a" floorColor="#3a3a5a" size={[12, 4, 10]} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[0, 3.5, 0]} intensity={1} color="#ffffff" />
      <spotLight
        position={[-2, 3, -2]}
        angle={0.5}
        penumbra={0.5}
        intensity={0.8}
        color="#ff9800"
      />

      {/* Store sign */}
      <Text
        position={[0, 3.2, -4.8]}
        fontSize={0.3}
        color="#ff5722"
        font="/fonts/Inter-Bold.woff"
      >
        TECH STORE
      </Text>

      {/* Product shelves */}
      {[-3, 0, 3].map((x, i) => (
        <group key={i} position={[x, 0, -3]}>
          {/* Shelf */}
          <Box args={[2, 0.05, 0.5]} position={[0, 1.2, 0]}>
            <meshStandardMaterial color="#8d6e63" />
          </Box>
          <Box args={[2, 0.05, 0.5]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#8d6e63" />
          </Box>

          {/* Random products */}
          {[...Array(3)].map((_, j) => (
            <Box
              key={j}
              args={[0.3, 0.3, 0.2]}
              position={[-0.6 + j * 0.6, 1.35, 0]}
            >
              <meshStandardMaterial
                color={['#2196F3', '#4CAF50', '#f44336'][j]}
              />
            </Box>
          ))}
        </group>
      ))}

      {/* Featured product: Headphones (the temptation) */}
      <group position={[0, 1.2, -1.5]}>
        {/* Display stand */}
        <Cylinder args={[0.3, 0.4, 0.1, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Cylinder>

        {/* Headphones model (simplified) */}
        <group position={[0, 0.3, 0]}>
          {/* Headband */}
          <mesh>
            <torusGeometry args={[0.15, 0.02, 8, 32, Math.PI]} />
            <meshStandardMaterial color="#212121" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Ear cups */}
          <Cylinder args={[0.08, 0.08, 0.04, 16]} position={[-0.15, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#424242" metalness={0.6} roughness={0.3} />
          </Cylinder>
          <Cylinder args={[0.08, 0.08, 0.04, 16]} position={[0.15, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#424242" metalness={0.6} roughness={0.3} />
          </Cylinder>
        </group>

        {/* Spotlight on product */}
        <spotLight
          position={[0, 1, 0]}
          angle={0.4}
          intensity={2}
          color="#FFD700"
          target-position={[0, 0.3, 0]}
        />

        {/* Price tag */}
        <RoundedBox args={[0.4, 0.15, 0.02]} position={[0, 0.6, 0.1]} radius={0.02}>
          <meshStandardMaterial color="#f44336" />
        </RoundedBox>
        <Text
          position={[0, 0.6, 0.12]}
          fontSize={0.06}
          color="#ffffff"
          font="/fonts/Inter-Bold.woff"
        >
          $300
        </Text>
        <Text
          position={[0, 0.52, 0.12]}
          fontSize={0.03}
          color="#ffcdd2"
        >
          Premium Edition
        </Text>
      </group>

      {/* Sale signs */}
      <Text
        position={[-4, 2.5, -3]}
        fontSize={0.2}
        color="#ffeb3b"
        rotation={[0, 0.3, 0]}
      >
        ¡OFERTA!
      </Text>
      <Text
        position={[4, 2.5, -3]}
        fontSize={0.2}
        color="#ffeb3b"
        rotation={[0, -0.3, 0]}
      >
        50% OFF
      </Text>

      {/* UI Elements */}
      <HUD position={[-2, 2, -1.5]} />

      {/* Decision panel */}
      {decision && (
        <DecisionPanel
          decision={decision}
          position={[0, 1.6, -0.5]}
        />
      )}
    </group>
  )
}
