# Finanzas VR

A WebXR financial literacy demo built with React Three Fiber and `@react-three/xr`. Put on a headset, stand inside a virtual bank, and walk up to an advisor who guides you through a short dialog about saving, spending, and basic money decisions.

**Live demo:** https://finanzas.victorgalvez.dev (open on a WebXR-capable headset)

## Preview

![Finanzas VR preview](https://github.com/victorgalvez56/demo-vr/releases/download/v0.1.0/preview.gif)

Full-quality MP4: [preview.mp4](https://finanzas.victorgalvez.dev/preview.mp4)

## Stack

- React 19 + TypeScript
- Three.js via `@react-three/fiber`
- WebXR via `@react-three/xr`
- `drei` for 3D UI primitives (`Text`, `RoundedBox`, `Cylinder`)
- Zustand for game state
- Vite + `@vitejs/plugin-basic-ssl` (WebXR requires HTTPS even in dev)

## What's in it

- Room-scale VR scene with thumbstick locomotion (left stick moves, right stick as fallback lateral control)
- Dialog-driven advisor NPC with phases: `waiting → talking → choice → response → lesson → end`
- 3D UI panels rendered inside the headset from `drei` primitives

## Run locally

```bash
npm install
npm run dev           # https://localhost:5173 (self-signed cert)
```

Open the URL on a Quest / WebXR-capable headset browser and click **Enter VR**.

## Render the preview video

```bash
npm run remotion:studio   # interactive preview
npm run remotion:render   # writes public/preview.mp4
```

The composition is in `remotion/FinanzasVRVideo.tsx` and uses `@remotion/three` to recreate the bank scene programmatically.
