export interface DialogLine {
  id: string
  speaker: 'guide' | 'player' | 'npc'
  speakerName: string
  text: string
  duration?: number // milliseconds
}

export interface Dialogue {
  id: string
  scene: string
  lines: DialogLine[]
}

export const dialogues: Dialogue[] = [
  {
    id: 'intro-welcome',
    scene: 'intro',
    lines: [
      {
        id: 'intro-1',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: '¡Bienvenido al simulador de Educación Financiera!',
        duration: 3000,
      },
      {
        id: 'intro-2',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: 'Aquí aprenderás a tomar decisiones inteligentes sobre tu dinero.',
        duration: 4000,
      },
      {
        id: 'intro-3',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: 'Cada decisión que tomes afectará tu futuro financiero.',
        duration: 3500,
      },
      {
        id: 'intro-4',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: '¿Estás listo para comenzar tu viaje?',
        duration: 2500,
      },
    ],
  },
  {
    id: 'first-salary-intro',
    scene: 'first-salary',
    lines: [
      {
        id: 'salary-1',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: '¡Felicitaciones! Has conseguido tu primer trabajo.',
        duration: 3000,
      },
      {
        id: 'salary-2',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: 'Tu sueldo mensual es de $1,000.',
        duration: 2500,
      },
      {
        id: 'salary-3',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: 'La forma en que manejes este dinero definirá tu futuro.',
        duration: 3500,
      },
    ],
  },
  {
    id: 'bank-intro',
    scene: 'bank',
    lines: [
      {
        id: 'bank-1',
        speaker: 'npc',
        speakerName: 'Asesor Bancario',
        text: 'Bienvenido al banco. Soy tu asesor financiero.',
        duration: 3000,
      },
      {
        id: 'bank-2',
        speaker: 'npc',
        speakerName: 'Asesor Bancario',
        text: 'Tenemos varias opciones para hacer crecer tu dinero.',
        duration: 3000,
      },
      {
        id: 'bank-3',
        speaker: 'npc',
        speakerName: 'Asesor Bancario',
        text: 'Recuerda: mayor rendimiento suele significar mayor riesgo.',
        duration: 3500,
      },
    ],
  },
  {
    id: 'investment-intro',
    scene: 'investment',
    lines: [
      {
        id: 'invest-1',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: 'Has llegado al mundo de las inversiones.',
        duration: 2500,
      },
      {
        id: 'invest-2',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: 'Invertir es hacer que tu dinero trabaje para ti.',
        duration: 3000,
      },
      {
        id: 'invest-3',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: 'La diversificación es clave: nunca pongas todos los huevos en una canasta.',
        duration: 4000,
      },
    ],
  },
  {
    id: 'future-results',
    scene: 'future',
    lines: [
      {
        id: 'future-1',
        speaker: 'guide',
        speakerName: 'Mentor Financiero',
        text: 'Han pasado 5 años. Veamos el resultado de tus decisiones.',
        duration: 3500,
      },
    ],
  },
]

export const getDialogueByScene = (scene: string): Dialogue | undefined => {
  return dialogues.find(d => d.scene === scene)
}
