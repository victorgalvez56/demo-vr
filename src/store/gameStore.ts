import { create } from 'zustand'

export type SceneId =
  | 'intro'
  | 'first-salary'
  | 'impulse-buy'
  | 'bank'
  | 'investment'
  | 'future'

export interface Decision {
  id: string
  text: string
  scene: SceneId
  chosen: boolean
  impact: {
    money: number
    savings: number
    knowledge: number
  }
}

interface GameState {
  // Player stats
  money: number
  savings: number
  investments: number
  knowledgePoints: number

  // Progress
  currentScene: SceneId
  decisionsHistory: Decision[]
  monthsElapsed: number

  // UI state
  isDialogOpen: boolean
  currentDialogId: string | null

  // Actions
  setScene: (scene: SceneId) => void
  makeDecision: (decision: Decision) => void
  updateMoney: (amount: number) => void
  addToSavings: (amount: number) => void
  addToInvestments: (amount: number) => void
  addKnowledge: (points: number) => void
  advanceMonth: () => void
  openDialog: (dialogId: string) => void
  closeDialog: () => void
  resetGame: () => void

  // Computed
  getTotalWealth: () => number
  getFinancialHealth: () => 'poor' | 'fair' | 'good' | 'excellent'
}

const initialState = {
  money: 0,
  savings: 0,
  investments: 0,
  knowledgePoints: 0,
  currentScene: 'intro' as SceneId,
  decisionsHistory: [] as Decision[],
  monthsElapsed: 0,
  isDialogOpen: false,
  currentDialogId: null as string | null,
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  setScene: (scene) => set({ currentScene: scene }),

  makeDecision: (decision) => {
    const { money, savings, knowledgePoints, decisionsHistory } = get()
    set({
      money: money + decision.impact.money,
      savings: savings + decision.impact.savings,
      knowledgePoints: knowledgePoints + decision.impact.knowledge,
      decisionsHistory: [...decisionsHistory, { ...decision, chosen: true }],
    })
  },

  updateMoney: (amount) => set((state) => ({ money: state.money + amount })),

  addToSavings: (amount) => set((state) => ({
    savings: state.savings + amount,
    money: state.money - amount
  })),

  addToInvestments: (amount) => set((state) => ({
    investments: state.investments + amount,
    money: state.money - amount
  })),

  addKnowledge: (points) => set((state) => ({
    knowledgePoints: state.knowledgePoints + points
  })),

  advanceMonth: () => {
    const { monthsElapsed, savings, investments } = get()
    // Apply interest: 0.5% monthly on savings, 1% on investments (simplified)
    const savingsInterest = savings * 0.005
    const investmentReturn = investments * 0.01
    set({
      monthsElapsed: monthsElapsed + 1,
      savings: savings + savingsInterest,
      investments: investments + investmentReturn,
    })
  },

  openDialog: (dialogId) => set({ isDialogOpen: true, currentDialogId: dialogId }),
  closeDialog: () => set({ isDialogOpen: false, currentDialogId: null }),

  resetGame: () => set(initialState),

  getTotalWealth: () => {
    const { money, savings, investments } = get()
    return money + savings + investments
  },

  getFinancialHealth: () => {
    const { savings, investments, money, knowledgePoints } = get()
    const total = savings + investments
    const ratio = total / (money + total + 1)
    const score = ratio * 50 + knowledgePoints

    if (score < 20) return 'poor'
    if (score < 40) return 'fair'
    if (score < 60) return 'good'
    return 'excellent'
  },
}))
