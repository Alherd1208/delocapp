import { create } from 'zustand'

export interface Order {
    id: string
    from: string
    to: string
    dimensions: {
        length: number
        width: number
        height: number
    }
    paymentAmount: number
    status: 'pending' | 'assigned' | 'in_progress' | 'completed'
    createdBy: string
    assignedDriver?: string
    createdAt: Date
}

export interface Driver {
    id: string
    userId: string
    priorityDirections: Array<{ from: string; to: string }>
    excludedDirections: Array<{ from: string; to: string }>
    cargoVolumes: Array<{ length: number; width: number; height: number }>
    createdAt: Date
}

export interface Bid {
    id: string
    orderId: string
    driverId: string
    amount: number
    createdAt: Date
}

interface AppState {
    currentScreen: 'start' | 'create-order' | 'driver-registration' | 'orders' | 'bids'
    userType: 'customer' | 'driver' | null
    orders: Order[]
    drivers: Driver[]
    bids: Bid[]
    currentUser: any

    // Actions
    setScreen: (screen: AppState['currentScreen']) => void
    setUserType: (type: AppState['userType']) => void
    addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void
    addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => void
    addBid: (bid: Omit<Bid, 'id' | 'createdAt'>) => void
    setCurrentUser: (user: any) => void
}

export const useStore = create<AppState>((set, get) => ({
    currentScreen: 'start',
    userType: null,
    orders: [],
    drivers: [],
    bids: [],
    currentUser: null,

    setScreen: (screen) => set({ currentScreen: screen }),
    setUserType: (type) => set({ userType: type }),

    addOrder: (orderData) => {
        const order: Order = {
            ...orderData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
        }
        set((state) => ({ orders: [...state.orders, order] }))
    },

    addDriver: (driverData) => {
        const driver: Driver = {
            ...driverData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
        }
        set((state) => ({ drivers: [...state.drivers, driver] }))
    },

    addBid: (bidData) => {
        const bid: Bid = {
            ...bidData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date(),
        }
        set((state) => ({ bids: [...state.bids, bid] }))
    },

    setCurrentUser: (user) => set({ currentUser: user }),
}))
