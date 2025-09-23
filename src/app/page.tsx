'use client'

import { useStore } from '@/store/useStore'
import { StartScreen } from '@/components/StartScreen'
import { CreateOrderScreen } from '@/components/CreateOrderScreen'
import { DriverRegistrationScreen } from '@/components/DriverRegistrationScreen'
import { DriverOrdersScreen } from '@/components/DriverOrdersScreen'
import { ProfileScreen } from '@/components/ProfileScreen'

export default function Home() {
    const { currentScreen } = useStore()

    switch (currentScreen) {
        case 'start':
            return <StartScreen />
        case 'create-order':
            return <CreateOrderScreen />
        case 'driver-registration':
            return <DriverRegistrationScreen />
        case 'driver-orders':
            return <DriverOrdersScreen />
        case 'profile':
            return <ProfileScreen />
        default:
            return <StartScreen />
    }
}
