import { Text } from '@react-three/drei'

interface VRTextProps {
  children: string
  position?: [number, number, number]
  fontSize?: number
  color?: string
  maxWidth?: number
  textAlign?: 'left' | 'center' | 'right'
  anchorX?: 'left' | 'center' | 'right'
  anchorY?: 'top' | 'middle' | 'bottom'
}

export function VRText({
  children,
  position = [0, 0, 0],
  fontSize = 0.1,
  color = '#ffffff',
  maxWidth = 2,
  textAlign = 'center',
  anchorX = 'center',
  anchorY = 'middle',
}: VRTextProps) {
  return (
    <Text
      position={position}
      fontSize={fontSize}
      color={color}
      maxWidth={maxWidth}
      textAlign={textAlign}
      anchorX={anchorX}
      anchorY={anchorY}
      font="/fonts/Inter-Bold.woff"
    >
      {children}
    </Text>
  )
}
