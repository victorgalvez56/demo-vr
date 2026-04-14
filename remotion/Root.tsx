import { Composition } from 'remotion'
import { FinanzasVRVideo } from './FinanzasVRVideo'

const FPS = 30
const DURATION_SECONDS = 10

export const RemotionRoot = () => {
  return (
    <Composition
      id="FinanzasVR"
      component={FinanzasVRVideo}
      durationInFrames={FPS * DURATION_SECONDS}
      fps={FPS}
      width={1280}
      height={720}
    />
  )
}
