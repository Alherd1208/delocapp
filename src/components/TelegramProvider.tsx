'use client'

import { useEffect } from 'react'

interface TelegramProviderProps {
    children: React.ReactNode
}

export function TelegramProvider({ children }: TelegramProviderProps) {
    useEffect(() => {
        // Initialize Telegram WebApp
        if (typeof window !== 'undefined') {
            const script = document.createElement('script')
            script.src = 'https://telegram.org/js/telegram-web-app.js'
            script.async = true
            document.head.appendChild(script)

            script.onload = () => {
                if (window.Telegram?.WebApp) {
                    console.log('Telegram WebApp loaded successfully')
                    window.Telegram.WebApp.ready()
                    window.Telegram.WebApp.expand()

                    // Apply theme
                    const colorScheme = window.Telegram.WebApp.colorScheme
                    if (colorScheme === 'dark') {
                        document.documentElement.setAttribute('data-theme', 'dark')
                    }

                    // Log user data for debugging
                    console.log('Telegram initDataUnsafe:', window.Telegram.WebApp.initDataUnsafe)
                    console.log('Telegram user:', window.Telegram.WebApp.initDataUnsafe.user)
                }
            }

            return () => {
                document.head.removeChild(script)
            }
        }
    }, [])

    return <>{children}</>
}
