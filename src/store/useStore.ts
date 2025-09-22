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
    chatId?: string // Telegram chat ID for driver-client communication
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
    currentScreen: 'start' | 'create-order' | 'driver-registration' | 'driver-orders' | 'orders' | 'bids'
    userType: 'customer' | 'driver' | null
    orders: Order[]
    drivers: Driver[]
    bids: Bid[]
    currentUser: any
    isDebugMode: boolean

    // Actions
    setScreen: (screen: AppState['currentScreen']) => void
    setUserType: (type: AppState['userType']) => void
    addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void
    addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => void
    addBid: (bid: Omit<Bid, 'id' | 'createdAt'>) => void
    setCurrentUser: (user: any) => void
    getDriverByUserId: (userId: string) => Driver | undefined
    setDebugMode: (isDebug: boolean) => void
    acceptOrder: (orderId: string, driverId: string) => void
    updateOrderChatId: (orderId: string, chatId: string) => void
}

// Sample orders for testing
const sampleOrders: Order[] = [
    {
        id: 'sample1',
        from: 'New York',
        to: 'Los Angeles',
        dimensions: { length: 100, width: 50, height: 30 },
        paymentAmount: 500,
        status: 'pending',
        createdBy: 'sample_user',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
        id: 'sample2',
        from: 'Chicago',
        to: 'Miami',
        dimensions: { length: 80, width: 60, height: 40 },
        paymentAmount: 350,
        status: 'pending',
        createdBy: 'sample_user',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
    },
    {
        id: 'sample3',
        from: 'New York',
        to: 'Los Angeles',
        dimensions: { length: 120, width: 70, height: 50 },
        paymentAmount: 750,
        status: 'pending',
        createdBy: 'sample_user',
        createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
    },
    {
        id: 'sample4',
        from: 'Seattle',
        to: 'Portland',
        dimensions: { length: 60, width: 40, height: 25 },
        paymentAmount: 200,
        status: 'pending',
        createdBy: 'sample_user',
        createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
    }
]

export const useStore = create<AppState>((set, get) => ({
    currentScreen: 'start',
    userType: null,
    orders: sampleOrders,
    drivers: [],
    bids: [],
    currentUser: null,
    isDebugMode: false,

    setScreen: (screen) => set({ currentScreen: screen }),
    setUserType: (type) => set({ userType: type }),
    setDebugMode: (isDebug) => set({ isDebugMode: isDebug }),

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

    getDriverByUserId: (userId) => {
        const state = get()
        return state.drivers.find(driver => driver.userId === userId)
    },

    acceptOrder: (orderId, driverId) => {
        set((state) => ({
            orders: state.orders.map(order =>
                order.id === orderId
                    ? { ...order, status: 'assigned' as const, assignedDriver: driverId }
                    : order
            )
        }))
    },

    updateOrderChatId: (orderId, chatId) => {
        set((state) => ({
            orders: state.orders.map(order =>
                order.id === orderId
                    ? { ...order, chatId }
                    : order
            )
        }))
    },
}))
