import { create } from 'zustand'
import { Order, Driver, Bid } from '../lib/models'

interface AppState {
    currentScreen: 'start' | 'create-order' | 'driver-registration' | 'driver-orders' | 'orders' | 'bids' | 'profile'
    userType: 'customer' | 'driver' | null
    orders: Order[]
    drivers: Driver[]
    bids: Bid[]
    currentUser: any
    isDebugMode: boolean

    // Actions
    setScreen: (screen: AppState['currentScreen']) => void
    setUserType: (type: AppState['userType']) => void
    addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>
    addDriver: (driver: Omit<Driver, 'id' | 'createdAt'>) => Promise<void>
    addBid: (bid: Omit<Bid, 'id' | 'createdAt'>) => Promise<void>
    setCurrentUser: (user: any) => void
    getDriverByUserId: (userId: string) => Driver | undefined
    setDebugMode: (isDebug: boolean) => void
    acceptOrder: (orderId: string, driverId: string) => Promise<void>
    updateOrderChatId: (orderId: string, chatId: string) => Promise<void>
    loadOrders: () => Promise<void>
    loadDrivers: () => Promise<void>
    loadBids: () => Promise<void>
    updateCurrentUser: (userData: any) => void
    getUserOrders: () => Order[]
    getUserAcceptedOrders: () => Order[]
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

    loadOrders: async () => {
        try {
            const response = await fetch('/api/orders');
            if (response.ok) {
                const orders = await response.json();
                set({ orders });
            }
        } catch (error) {
            console.error('Failed to load orders:', error);
        }
    },

    loadDrivers: async () => {
        try {
            const response = await fetch('/api/drivers');
            if (response.ok) {
                const drivers = await response.json();
                set({ drivers });
            }
        } catch (error) {
            console.error('Failed to load drivers:', error);
        }
    },

    loadBids: async () => {
        try {
            const response = await fetch('/api/bids');
            if (response.ok) {
                const bids = await response.json();
                set({ bids });
            }
        } catch (error) {
            console.error('Failed to load bids:', error);
        }
    },

    addOrder: async (orderData) => {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const order = await response.json();
                set((state) => ({ orders: [...state.orders, order] }));
            } else {
                console.error('Failed to create order');
            }
        } catch (error) {
            console.error('Failed to create order:', error);
        }
    },

    addDriver: async (driverData) => {
        try {
            const response = await fetch('/api/drivers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(driverData),
            });

            if (response.ok) {
                const driver = await response.json();
                set((state) => ({ drivers: [...state.drivers, driver] }));
            } else {
                console.error('Failed to create driver');
            }
        } catch (error) {
            console.error('Failed to create driver:', error);
        }
    },

    addBid: async (bidData) => {
        try {
            const response = await fetch('/api/bids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bidData),
            });

            if (response.ok) {
                const bid = await response.json();
                set((state) => ({ bids: [...state.bids, bid] }));
            } else {
                console.error('Failed to create bid');
            }
        } catch (error) {
            console.error('Failed to create bid:', error);
        }
    },

    setCurrentUser: (user) => set({ currentUser: user }),

    getDriverByUserId: (userId) => {
        const state = get()
        return state.drivers.find(driver => driver.userId === userId)
    },

    acceptOrder: async (orderId, driverId) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'assigned',
                    assignedDriver: driverId,
                }),
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                set((state) => ({
                    orders: state.orders.map(order =>
                        order.id === orderId ? updatedOrder : order
                    )
                }));
            } else {
                console.error('Failed to accept order');
            }
        } catch (error) {
            console.error('Failed to accept order:', error);
        }
    },

    updateOrderChatId: async (orderId, chatId) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId }),
            });

            if (response.ok) {
                const updatedOrder = await response.json();
                set((state) => ({
                    orders: state.orders.map(order =>
                        order.id === orderId ? updatedOrder : order
                    )
                }));
            } else {
                console.error('Failed to update order chat ID');
            }
        } catch (error) {
            console.error('Failed to update order chat ID:', error);
        }
    },

    updateCurrentUser: (userData) => set({ currentUser: userData }),

    getUserOrders: () => {
        const state = get()
        const userId = state.currentUser?.id?.toString() || 'anonymous'
        return state.orders.filter(order => order.createdBy === userId)
    },

    getUserAcceptedOrders: () => {
        const state = get()
        const userId = state.currentUser?.id?.toString()
        if (!userId) return []

        const driver = state.drivers.find(driver => driver.userId === userId)
        if (!driver) return []

        return state.orders.filter(order => order.assignedDriver === driver.id)
    },
}))
