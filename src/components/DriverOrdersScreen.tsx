'use client'

import { useStore } from '@/store/useStore'
import { ArrowLeft, Package, MapPin, DollarSign, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Order, Driver } from '@/store/useStore'

export function DriverOrdersScreen() {
    const { setScreen, currentUser, getDriverByUserId, orders } = useStore()

    const currentDriver = getDriverByUserId(currentUser?.id?.toString() || 'anonymous')

    const goBack = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
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
        if (!currentDriver) return []

        // Filter available orders (pending status and not excluded)
        const availableOrders = orders.filter(order =>
            order.status === 'pending' &&
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

    if (!currentDriver) {
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
                        <h1 className="text-xl font-bold">Available Orders</h1>
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
                        const isPriority = isOrderPriority(order, currentDriver)

                        return (
                            <Card key={order.id} className={`transition-all hover:shadow-md ${isPriority ? 'border-yellow-500 bg-yellow-50/50' : ''}`}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CardTitle className="text-base">
                                                    Order #{order.id.slice(0, 6)}
                                                </CardTitle>
                                                {isPriority && (
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
                                        <Button
                                            className="flex-1"
                                            onClick={() => {
                                                if (window.Telegram?.WebApp?.HapticFeedback) {
                                                    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
                                                }
                                                // TODO: Implement bid functionality
                                            }}
                                        >
                                            Place Bid
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                if (window.Telegram?.WebApp?.HapticFeedback) {
                                                    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
                                                }
                                                // TODO: Implement view details functionality
                                            }}
                                        >
                                            Details
                                        </Button>
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
