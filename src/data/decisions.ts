import type { SceneId } from '../store/gameStore'

export interface DecisionOption {
  id: string
  text: string
  description: string
  impact: {
    money: number
    savings: number
    knowledge: number
  }
  feedback: string
  nextScene?: SceneId
}

export interface DecisionPoint {
  id: string
  scene: SceneId
  title: string
  situation: string
  options: DecisionOption[]
}

export const decisions: DecisionPoint[] = [
  {
    id: 'first-salary-decision',
    scene: 'first-salary',
    title: 'Tu Primer Sueldo',
    situation: 'Has recibido tu primer sueldo: $1,000. Es un momento importante. ¿Qué harás con este dinero?',
    options: [
      {
        id: 'spend-most',
        text: 'Gastar $900',
        description: 'Celebrar comprando lo que siempre quisiste',
        impact: { money: -900, savings: 0, knowledge: 5 },
        feedback: 'La gratificación inmediata se siente bien, pero no has construido ningún colchón financiero.',
        nextScene: 'impulse-buy',
      },
      {
        id: 'balanced',
        text: 'Gastar $500, Ahorrar $500',
        description: 'Un enfoque equilibrado: disfrutar y guardar',
        impact: { money: -500, savings: 500, knowledge: 15 },
        feedback: '¡Excelente equilibrio! La regla 50/50 es un buen comienzo para construir hábitos financieros.',
        nextScene: 'bank',
      },
      {
        id: 'save-most',
        text: 'Gastar $200, Ahorrar $800',
        description: 'Priorizar el ahorro sobre el gasto',
        impact: { money: -200, savings: 800, knowledge: 20 },
        feedback: '¡Impresionante disciplina! Ahorrar el 80% es ambicioso y te dará una base sólida.',
        nextScene: 'bank',
      },
    ],
  },
  {
    id: 'impulse-buy-decision',
    scene: 'impulse-buy',
    title: 'Compra Impulsiva',
    situation: 'Ves unos auriculares premium de $300 que no necesitas pero te encantan. Solo te quedan $100 en el banco.',
    options: [
      {
        id: 'buy-anyway',
        text: 'Comprarlos con crédito',
        description: 'Los quiero ahora, pagaré después',
        impact: { money: -350, savings: 0, knowledge: 10 },
        feedback: 'Usaste crédito para algo no esencial. Los intereses aumentaron el costo a $350.',
        nextScene: 'bank',
      },
      {
        id: 'walk-away',
        text: 'Resistir la tentación',
        description: 'No los necesito realmente',
        impact: { money: 0, savings: 0, knowledge: 25 },
        feedback: '¡Gran autocontrol! Distinguir entre "querer" y "necesitar" es una habilidad financiera clave.',
        nextScene: 'bank',
      },
      {
        id: 'save-for-later',
        text: 'Crear meta de ahorro',
        description: 'Los compraré cuando tenga el dinero',
        impact: { money: 0, savings: 0, knowledge: 30 },
        feedback: '¡Estrategia inteligente! Establecer metas de ahorro es el camino hacia compras responsables.',
        nextScene: 'bank',
      },
    ],
  },
  {
    id: 'bank-decision',
    scene: 'bank',
    title: 'En el Banco',
    situation: 'El asesor te explica las opciones para tus ahorros. ¿Dónde pondrás tu dinero?',
    options: [
      {
        id: 'checking-only',
        text: 'Cuenta corriente',
        description: 'Fácil acceso, sin intereses',
        impact: { money: 0, savings: 0, knowledge: 10 },
        feedback: 'La cuenta corriente es útil para gastos diarios, pero tu dinero no crece.',
        nextScene: 'investment',
      },
      {
        id: 'savings-account',
        text: 'Cuenta de ahorros',
        description: 'Interés bajo pero seguro (0.5% mensual)',
        impact: { money: 0, savings: 0, knowledge: 20 },
        feedback: 'Buena opción para el fondo de emergencia. Seguro y con algo de crecimiento.',
        nextScene: 'investment',
      },
      {
        id: 'fixed-deposit',
        text: 'Depósito a plazo fijo',
        description: 'Mejor interés, menos liquidez (1.5% mensual)',
        impact: { money: 0, savings: 0, knowledge: 25 },
        feedback: '¡Excelente para metas a mediano plazo! Sacrificas acceso por mejor rendimiento.',
        nextScene: 'investment',
      },
    ],
  },
  {
    id: 'investment-decision',
    scene: 'investment',
    title: 'Primeras Inversiones',
    situation: 'Has aprendido sobre inversiones. Con tus ahorros actuales, ¿qué camino tomarás?',
    options: [
      {
        id: 'no-invest',
        text: 'No invertir aún',
        description: 'Prefiero mantener todo en ahorros seguros',
        impact: { money: 0, savings: 0, knowledge: 10 },
        feedback: 'Es válido ser conservador, pero la inflación puede erosionar tus ahorros con el tiempo.',
        nextScene: 'future',
      },
      {
        id: 'index-funds',
        text: 'Fondos indexados',
        description: 'Diversificado, riesgo moderado, largo plazo',
        impact: { money: 0, savings: -200, knowledge: 30 },
        feedback: '¡Excelente elección! Los fondos indexados son recomendados para principiantes por su diversificación.',
        nextScene: 'future',
      },
      {
        id: 'crypto-yolo',
        text: 'Todo a criptomonedas',
        description: 'Alto riesgo, potencial alto retorno',
        impact: { money: 0, savings: -500, knowledge: 15 },
        feedback: 'Las cripto son muy volátiles. Nunca inviertas más de lo que puedas perder.',
        nextScene: 'future',
      },
    ],
  },
]

export const getDecisionByScene = (scene: SceneId): DecisionPoint | undefined => {
  return decisions.find(d => d.scene === scene)
}
