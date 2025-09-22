'use client'

import { useStore } from '@/store/useStore'
import { useEffect } from 'react'
import { Truck, Package, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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
                        <h1 className="text-3xl font-bold tracking-tight">
                            CryptoLoc Delivery
                        </h1>
                        <p className="text-muted-foreground text-lg mt-2">
                            Secure crypto-powered logistics platform
                        </p>
                    </div>
                </div>

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