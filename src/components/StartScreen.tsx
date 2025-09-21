'use client'

import { useStore } from '@/store/useStore'
import { useEffect } from 'react'

export function StartScreen() {
    const { setScreen, setUserType, setCurrentUser } = useStore()

    useEffect(() => {
        // Get Telegram user data
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const user = window.Telegram.WebApp.initDataUnsafe.user
            if (user) {
                setCurrentUser(user)
            }
        }
    }, [setCurrentUser])

    const handleDriverChoice = (isDriver: boolean) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }

        if (isDriver) {
            setUserType('driver')
            setScreen('driver-registration')
        } else {
            setUserType('customer')
            setScreen('create-order')
        }
    }

    return (
        <div className="min-h-screen bg-tg-bg flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md mx-auto text-center space-y-8">
                <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto bg-tg-button rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-tg-button-text" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l.94 3.76A2 2 0 006.88 12h4.24a2 2 0 001.94-1.24L14 8h2a1 1 0 100-2H3.28L3 4z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-tg-text">
                        Welcome to Cargo TMA
                    </h1>
                    <p className="text-tg-hint text-lg">
                        Connect cargo owners with drivers for efficient delivery
                    </p>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-tg-text">
                        Are you a driver?
                    </h2>

                    <div className="space-y-4">
                        <button
                            onClick={() => handleDriverChoice(true)}
                            className="w-full tg-button text-lg py-4 rounded-xl"
                        >
                            Yes, I'm a Driver
                        </button>

                        <button
                            onClick={() => handleDriverChoice(false)}
                            className="w-full bg-gray-100 text-gray-700 border-2 border-gray-200 py-4 rounded-xl text-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            No, I need to send cargo
                        </button>
                    </div>
                </div>

                <div className="text-sm text-tg-hint">
                    Choose your role to get started with the platform
                </div>
            </div>
        </div>
    )
}
