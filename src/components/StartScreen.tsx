'use client'

import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'
import { Truck, Package, Zap, Bug, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function StartScreen() {
    const { setScreen, setUserType, setCurrentUser, currentUser, getDriverByUserId, setDebugMode } = useStore()
    const [isClient, setIsClient] = useState(false)
    const [isDebugMode, setIsDebugMode] = useState(false)

    useEffect(() => {
        setIsClient(true)

        // Check if we're in debug mode (not in Telegram environment)
        const debugMode = typeof window === 'undefined' || !window.Telegram?.WebApp
        setIsDebugMode(debugMode)
        setDebugMode(debugMode)

        // Function to check and set Telegram user
        const checkAndSetUser = () => {
            console.log('=== TELEGRAM USER DEBUG ===')
            console.log('window.Telegram exists:', !!window.Telegram)
            console.log('window.Telegram.WebApp exists:', !!window.Telegram?.WebApp)
            
            if (window.Telegram?.WebApp) {
                console.log('Telegram WebApp initData:', window.Telegram.WebApp.initData)
                console.log('Telegram WebApp initDataUnsafe:', window.Telegram.WebApp.initDataUnsafe)
                
                const user = window.Telegram.WebApp.initDataUnsafe.user
                console.log('Telegram user data:', user)
                console.log('User ID:', user?.id)
                console.log('User first_name:', user?.first_name)
                console.log('User last_name:', user?.last_name)
                console.log('User username:', user?.username)
                
                if (user && user.id) {
                    console.log('✅ Valid user data found, setting current user:', user)
                    setCurrentUser(user)
                    return true
                } else {
                    console.warn('❌ No valid user data found in Telegram WebApp')
                    console.warn('User object:', user)
                    console.warn('User ID type:', typeof user?.id)
                }
            } else {
                console.warn('❌ Telegram WebApp not available')
            }
            console.log('=== END TELEGRAM USER DEBUG ===')
            return false
        }

        // Get Telegram user data
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            console.log('Telegram WebApp detected')
            if (!checkAndSetUser()) {
                // Retry after a short delay if user data is not immediately available
                setTimeout(() => {
                    checkAndSetUser()
                }, 500)
            }
        } else if (debugMode) {
            // Set debug user when not in Telegram environment
            const debugUser = {
                id: 12345,
                first_name: 'Debug',
                last_name: 'User',
                username: 'debug_user'
            }
            setCurrentUser(debugUser)
        } else {
            // Wait for Telegram WebApp to load if it's not available yet
            const checkForTelegram = () => {
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                    console.log('Telegram WebApp loaded later')
                    checkAndSetUser()
                } else {
                    setTimeout(checkForTelegram, 100)
                }
            }
            checkForTelegram()
        }
    }, [setCurrentUser, setDebugMode])

    const handleDriverChoice = (isDriver: boolean) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }

        setDebugMode(false) // Reset debug mode for normal navigation

        if (isDriver) {
            setUserType('driver')

            // Check if user is authenticated
            let userId = currentUser?.id
            
            // If no user in store, try to get from Telegram directly
            if (!userId && window.Telegram?.WebApp?.initDataUnsafe?.user) {
                console.log('No user in store, trying to get from Telegram directly in StartScreen')
                const telegramUser = window.Telegram.WebApp.initDataUnsafe.user
                if (telegramUser && telegramUser.id) {
                    console.log('Found user in Telegram, updating store:', telegramUser)
                    setCurrentUser(telegramUser)
                    userId = telegramUser.id
                }
            }
            
            if (!userId) {
                console.error('No authenticated user for driver registration')
                if (window.Telegram?.WebApp?.showAlert) {
                    window.Telegram.WebApp.showAlert('Authentication required. Please ensure you are logged in through Telegram.')
                } else {
                    alert('Authentication required. Please ensure you are logged in through Telegram.')
                }
                setScreen('start')
                return
            }

            // Check if driver is already registered
            const existingDriver = getDriverByUserId(userId.toString())
            if (existingDriver) {
                // Driver already registered, go to orders screen
                setScreen('driver-orders')
            } else {
                // Driver not registered, go to registration
                setScreen('driver-registration')
            }
        } else {
            setUserType('customer')
            setScreen('create-order')
        }
    }

    const handleDebugOrders = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
        setDebugMode(true)
        setScreen('driver-orders')
    }

    const handleProfileClick = () => {
        console.log('Profile button clicked, currentUser:', currentUser)
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
        setScreen('profile')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="relative">
                        <div className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                            <Zap className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <Badge className="absolute -top-2 -right-2 bg-green-500 hover:bg-green-500">
                            Live
                        </Badge>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight">
                                CryptoLoc Delivery
                            </h1>
                            {isClient && isDebugMode && (
                                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                                    <Bug className="w-3 h-3 mr-1" />
                                    Debug Mode
                                </Badge>
                            )}
                        </div>
                        <p className="text-muted-foreground text-lg mt-2">
                            Secure crypto-powered logistics platform
                        </p>
                    </div>
                </div>

                {/* Profile Button */}
                {(currentUser || (typeof window !== 'undefined' && window.Telegram?.WebApp)) && (
                    <div className="text-center space-y-2">
                        <Button
                            variant="outline"
                            onClick={handleProfileClick}
                            className={`flex items-center gap-2 ${!currentUser ? 'border-dashed opacity-70' : ''}`}
                        >
                            <User className="w-4 h-4" />
                            {currentUser ? 'Profile' : 'Profile (Loading...)'}
                        </Button>
                    </div>
                )}

                {/* Debug info */}
                <div className="p-3 bg-muted/50 rounded-lg text-xs text-left border">
                    <div className="font-semibold mb-2">🔍 Debug Info:</div>
                    <div>User: {currentUser ? `${currentUser.first_name} (ID: ${currentUser.id})` : 'Not authenticated'}</div>
                    <div>Telegram: {typeof window !== 'undefined' && window.Telegram?.WebApp ? 'Available' : 'Not available'}</div>
                    <div>Debug Mode: {isDebugMode ? 'Yes' : 'No'}</div>
                </div>

                {/* Debug Profile Button (for non-Telegram environments) */}
                {isClient && !currentUser && isDebugMode && (
                    <div className="text-center">
                        <Button
                            variant="outline"
                            onClick={handleProfileClick}
                            className="flex items-center gap-2 border-dashed text-muted-foreground"
                        >
                            <User className="w-4 h-4" />
                            Debug Profile
                        </Button>
                    </div>
                )}

                {/* Role Selection */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-center">
                        Choose your role
                    </h2>

                    <div className="grid gap-4">
                        {/* Driver Card */}
                        <Card
                            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 hover:border-primary/50"
                            onClick={() => handleDriverChoice(true)}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-blue-600" />
                                    </div>
                                    I'm a Driver
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Transport cargo and earn crypto payments
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                        Earn Money
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                        Flexible Routes
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                        Crypto Payments
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Customer Card */}
                        <Card
                            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] border-2 hover:border-primary/50"
                            onClick={() => handleDriverChoice(false)}
                        >
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-3 text-lg">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-green-600" />
                                    </div>
                                    I need delivery
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Send packages across multiple countries
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="text-xs">
                                        Fast Delivery
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                        Secure Tracking
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                        Multi-Country
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Debug Button */}
                <div className="text-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDebugOrders}
                        className="text-xs text-muted-foreground border-dashed hover:border-solid"
                    >
                        <Bug className="w-3 h-3 mr-1" />
                        Debug: View Orders
                    </Button>
                </div>

                {/* Footer */}
                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Powered by blockchain technology
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            160+ Cities
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            9 Countries
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            Secure
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}