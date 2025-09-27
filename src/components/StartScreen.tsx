'use client'

import { useStore } from '@/store/useStore'
import { useEffect, useState } from 'react'
import { Truck, Package, Zap, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function StartScreen() {
    const { setScreen, setUserType, setCurrentUser, currentUser, getDriverByUserId, loadDrivers, getUserOrders, loadOrders, suppressAutoRedirectOnce, setSuppressAutoRedirectOnce } = useStore()
    const [isClient, setIsClient] = useState(false)
    const [isCheckingUser, setIsCheckingUser] = useState(true)
    const [commitInfo, setCommitInfo] = useState('')

    useEffect(() => {
        console.log('test2')
        setIsClient(true)

        // Fetch commit information
        const fetchCommitInfo = async () => {
            try {
                const response = await fetch('/api/commit-info')
                if (response.ok) {
                    const data = await response.json()
                    setCommitInfo(data.commitInfo)
                }
            } catch (error) {
                console.log('Could not fetch commit info:', error)
                // Fallback to static commit info
                setCommitInfo('a957f3e - add debug 3')
            }
        }

        fetchCommitInfo()

        // Function to check and set Telegram user
        const checkAndSetUser = () => {
            if (window.Telegram?.WebApp) {
                const user = window.Telegram.WebApp.initDataUnsafe.user
                if (user && user.id) {
                    setCurrentUser(user)
                    return true
                }
            }
            return false
        }

        // Function to check if user is already registered and redirect accordingly
        const checkUserRegistration = async () => {
            const userId = currentUser?.id
            if (!userId) return

            // Load drivers to check if user is already registered
            await loadDrivers()

            const existingDriver = getDriverByUserId(userId.toString())
            if (existingDriver) {
                // User is already registered as driver, redirect to orders screen
                setUserType('driver')
                setScreen('driver-orders')
            }
        }

        // Get Telegram user data
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            if (!checkAndSetUser()) {
                // Retry after a short delay if user data is not immediately available
                setTimeout(() => {
                    checkAndSetUser()
                }, 500)
            }
        } else {
            // Wait for Telegram WebApp to load if it's not available yet
            const checkForTelegram = () => {
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                    checkAndSetUser()
                } else {
                    setTimeout(checkForTelegram, 100)
                }
            }
            checkForTelegram()
        }
    }, [setCurrentUser, currentUser, getDriverByUserId, setUserType, setScreen])

    // Check user registration when currentUser changes
    useEffect(() => {
        if (currentUser?.id) {
            const checkUserRegistration = async () => {
                try {
                    console.log('Checking user registration for user:', currentUser.id)
                    // Load drivers and orders to check if user is already registered or has orders
                    await Promise.all([loadDrivers(), loadOrders()])

                    const existingDriver = getDriverByUserId(currentUser.id.toString())
                    const userOrders = getUserOrders()

                    console.log('Existing driver found:', existingDriver)
                    console.log('User orders found:', userOrders.length)

                    if (suppressAutoRedirectOnce) {
                        // Honor the flag once, then clear it so future visits behave normally
                        setSuppressAutoRedirectOnce(false)
                        setIsCheckingUser(false)
                        return
                    } else if (existingDriver) {
                        // User is already registered as driver, redirect to driver orders screen
                        console.log('Redirecting existing driver to driver orders screen')
                        setUserType('driver')
                        setScreen('driver-orders')
                    } else if (userOrders.length > 0) {
                        // User has created orders, redirect to profile to see their orders
                        console.log('Redirecting user with orders to profile screen')
                        setUserType('customer')
                        setScreen('profile')
                    } else {
                        // User is not registered and has no orders, show the start screen
                        console.log('User not registered and no orders, showing start screen')
                        setIsCheckingUser(false)
                    }
                } catch (error) {
                    console.error('Error checking user registration:', error)
                    setIsCheckingUser(false)
                }
            }

            checkUserRegistration()
        } else {
            // No user yet, show the start screen
            setIsCheckingUser(false)
        }
    }, [currentUser, getDriverByUserId, setUserType, setScreen, loadDrivers, getUserOrders, loadOrders])

    const handleDriverChoice = (isDriver: boolean) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }

        if (isDriver) {
            setUserType('driver')

            // Check if user is authenticated
            let userId = currentUser?.id

            // If no user in store, try to get from Telegram directly
            if (!userId && window.Telegram?.WebApp?.initDataUnsafe?.user) {
                const telegramUser = window.Telegram.WebApp.initDataUnsafe.user
                if (telegramUser && telegramUser.id) {
                    setCurrentUser(telegramUser)
                    userId = telegramUser.id
                }
            }

            if (!userId) {
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

    const handleProfileClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
        setScreen('profile')
    }

    // Show loading screen while checking user registration
    if (isCheckingUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center p-6">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <Zap className="w-10 h-10 text-primary-foreground animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">Cargo TMA</h1>
                        <p className="text-muted-foreground">Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col items-center justify-center p-6">
            {/* Commit Info */}
            {commitInfo && (
                <div className="absolute top-4 right-4 text-xs text-muted-foreground/60 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border">
                    {commitInfo}
                </div>
            )}

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
                        </div>
                        <p className="text-muted-foreground text-lg mt-2">
                            Secure crypto-powered logistics platform
                        </p>
                    </div>
                </div>

                {/* Profile Button */}
                {currentUser && (
                    <div className="text-center space-y-2">
                        <Button
                            variant="outline"
                            onClick={handleProfileClick}
                            className="flex items-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            Profile
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