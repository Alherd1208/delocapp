'use client'

import { useStore } from '@/store/useStore'
import { ArrowLeft, Package, MapPin, DollarSign, Clock, Star, Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { telegramService } from '@/services/telegramService'
import { useState } from 'react'
import { Order, Driver } from '@/store/useStore'

export function DriverOrdersScreen() {
    const { setScreen, currentUser, getDriverByUserId, orders, isDebugMode, setDebugMode, acceptOrder } = useStore()
    const [acceptingOrders, setAcceptingOrders] = useState<Set<string>>(new Set())

    const currentDriver = getDriverByUserId(currentUser?.id?.toString() || 'anonymous')

    const goBack = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
        setDebugMode(false) // Reset debug mode when going back
        setScreen('start')
    }

    // Function to check if an order matches driver's priority directions
    const isOrderPriority = (order: Order, driver: Driver): boolean => {
        return driver.priorityDirections.some(
            priority => priority.from === order.from && priority.to === order.to
        )
    }

    // Function to check if an order is excluded by driver
    const isOrderExcluded = (order: Order, driver: Driver): boolean => {
        return driver.excludedDirections.some(
            excluded => excluded.from === order.from && excluded.to === order.to
        )
    }

    // Function to check if order cargo fits driver's cargo volumes
    const doesCargoFit = (order: Order, driver: Driver): boolean => {
        return driver.cargoVolumes.some(volume =>
            order.dimensions.length <= volume.length &&
            order.dimensions.width <= volume.width &&
            order.dimensions.height <= volume.height
        )
    }

    // Get filtered and sorted orders
    const getFilteredAndSortedOrders = () => {
        // In debug mode, show all pending orders without driver filtering
        if (isDebugMode && !currentDriver) {
            return orders
                .filter(order => order.status === 'pending')
                .sort((a, b) => {
                    // Sort by payment amount (descending), then by creation date
                    if (a.paymentAmount !== b.paymentAmount) {
                        return b.paymentAmount - a.paymentAmount
                    }
                    return b.createdAt.getTime() - a.createdAt.getTime()
                })
        }

        if (!currentDriver) return []

        // Filter available orders (pending status and not excluded) and assigned orders to current driver
        const availableOrders = orders.filter(order =>
            (order.status === 'pending' || (order.status === 'assigned' && order.assignedDriver === currentDriver.id)) &&
            !isOrderExcluded(order, currentDriver) &&
            doesCargoFit(order, currentDriver)
        )

        // Sort orders: priority orders first, then by payment amount (descending), then by creation date
        return availableOrders.sort((a, b) => {
            const aPriority = isOrderPriority(a, currentDriver)
            const bPriority = isOrderPriority(b, currentDriver)

            // Priority orders come first
            if (aPriority && !bPriority) return -1
            if (!aPriority && bPriority) return 1

            // If both are priority or both are not, sort by payment amount
            if (a.paymentAmount !== b.paymentAmount) {
                return b.paymentAmount - a.paymentAmount
            }

            // If payment amounts are equal, sort by creation date (newest first)
            return b.createdAt.getTime() - a.createdAt.getTime()
        })
    }

    const sortedOrders = getFilteredAndSortedOrders()

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleAcceptOrder = async (order: Order) => {
        if (!currentUser || !currentDriver) {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
            }
            return
        }

        const orderId = order.id
        const driverId = currentDriver.id

        // Add to accepting set to show loading state
        setAcceptingOrders(prev => {
            const newSet = new Set(prev)
            newSet.add(orderId)
            return newSet
        })

        try {
            // Haptic feedback for action
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
            }

            // Accept the order in the store
            acceptOrder(orderId, driverId)

            // Create Telegram chat or send notifications
            const clientUser = {
                id: parseInt(order.createdBy) || 0,
                first_name: 'Client', // In a real app, this would come from user data
                username: undefined
            }

            const driverUser = {
                id: currentUser.id || 0,
                first_name: currentUser.first_name || 'Driver',
                last_name: currentUser.last_name,
                username: currentUser.username
            }

            const orderInfo = {
                id: order.id,
                from: order.from,
                to: order.to,
                paymentAmount: order.paymentAmount
            }

            // Try to create chat or send notifications
            const result = await telegramService.createChatBetweenUsers(
                clientUser,
                driverUser,
                orderInfo
            )

            if (result.success) {
                // Show success message
                if (window.Telegram?.WebApp?.showAlert) {
                    window.Telegram.WebApp.showAlert(
                        `✅ Order accepted successfully!\n\nYou and the client will be connected for communication. Check your Telegram messages for contact details.`
                    )
                } else if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
                }

                // Also try to send notification
                await telegramService.notifyOrderAccepted(
                    orderId,
                    order.createdBy,
                    currentUser.id?.toString() || '',
                    orderInfo
                )
            } else {
                // Fallback success message
                if (window.Telegram?.WebApp?.showAlert) {
                    window.Telegram.WebApp.showAlert(
                        `✅ Order accepted!\n\nThe order has been assigned to you. Please contact the client directly to coordinate pickup and delivery details.`
                    )
                }
            }

        } catch (error) {
            console.error('Error accepting order:', error)

            if (window.Telegram?.WebApp?.showAlert) {
                window.Telegram.WebApp.showAlert(
                    `⚠️ Order accepted, but there was an issue setting up communication. Please contact the client directly.`
                )
            } else if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning')
            }
        } finally {
            // Remove from accepting set
            setAcceptingOrders(prev => {
                const newSet = new Set(prev)
                newSet.delete(orderId)
                return newSet
            })
        }
    }

    if (!currentDriver && !isDebugMode) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Driver Not Found</CardTitle>
                        <CardDescription className="text-center">
                            Please register as a driver first.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={goBack} className="w-full">
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goBack}
                        className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold">Available Orders</h1>
                            {isDebugMode && (
                                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                                    <Bug className="h-3 w-3 mr-1" />
                                    Debug Mode
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm opacity-90">
                            {sortedOrders.length} orders available
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {sortedOrders.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold mb-2">No Orders Available</h3>
                            <p className="text-muted-foreground">
                                There are no orders matching your preferences at the moment.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    sortedOrders.map((order) => {
                        const isPriority = currentDriver ? isOrderPriority(order, currentDriver) : false
                        const isAssigned = order.status === 'assigned' && order.assignedDriver === currentDriver?.id

                        return (
                            <Card key={order.id} className={`transition-all hover:shadow-md ${isAssigned ? 'border-green-500 bg-green-50/50' :
                                    isPriority ? 'border-yellow-500 bg-yellow-50/50' : ''
                                }`}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-base">
                                                    Order #{order.id.slice(0, 6)}
                                                </CardTitle>
                                                {isAssigned && (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                                                        ✅ Accepted
                                                    </Badge>
                                                )}
                                                {isPriority && !isAssigned && (
                                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Priority
                                                    </Badge>
                                                )}
                                            </div>
                                            <CardDescription className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Created {formatDate(order.createdAt)}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                            <DollarSign className="h-3 w-3 mr-1" />
                                            ${order.paymentAmount}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Route */}
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{order.from}</div>
                                            <div className="text-xs text-muted-foreground">to</div>
                                            <div className="text-sm font-medium">{order.to}</div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Cargo Details */}
                                    <div className="flex items-center gap-3">
                                        <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">Cargo Dimensions</div>
                                            <div className="text-xs text-muted-foreground">
                                                {order.dimensions.length} × {order.dimensions.width} × {order.dimensions.height} cm
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        {isAssigned ? (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={() => {
                                                        if (window.Telegram?.WebApp?.HapticFeedback) {
                                                            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                                                        }
                                                        // TODO: Implement contact client functionality
                                                        if (window.Telegram?.WebApp?.showAlert) {
                                                            window.Telegram.WebApp.showAlert(
                                                                '📞 Contact the client directly via Telegram to coordinate pickup and delivery details.'
                                                            )
                                                        }
                                                    }}
                                                >
                                                    💬 Contact Client
                                                </Button>
                                                <Button
                                                    className="flex-1"
                                                    onClick={() => {
                                                        if (window.Telegram?.WebApp?.HapticFeedback) {
                                                            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                                                        }
                                                        // TODO: Implement start delivery functionality
                                                        if (window.Telegram?.WebApp?.showAlert) {
                                                            window.Telegram.WebApp.showAlert(
                                                                '🚚 Starting delivery... (This feature will be implemented soon)'
                                                            )
                                                        }
                                                    }}
                                                >
                                                    🚚 Start Delivery
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    className="flex-1"
                                                    onClick={() => handleAcceptOrder(order)}
                                                    disabled={acceptingOrders.has(order.id) || order.status !== 'pending'}
                                                >
                                                    {acceptingOrders.has(order.id) ? 'Accepting...' : 'Accept'}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={() => {
                                                        if (window.Telegram?.WebApp?.HapticFeedback) {
                                                            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                                                        }
                                                        // TODO: Implement reject functionality
                                                    }}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
