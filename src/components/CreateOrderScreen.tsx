'use client'

import { useStore } from '@/store/useStore'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Package, MapPin, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { DropdownCitySelector } from './DropdownCitySelector'

interface OrderForm {
    from: string
    to: string
    length: number
    width: number
    height: number
    paymentAmount: number
}

export function CreateOrderScreen() {
    const { addOrder, setScreen, currentUser } = useStore()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm<OrderForm>()

    // Register city fields with validation
    register('from', { required: 'From location is required' })
    register('to', { required: 'Destination is required' })

    const dimensions = watch(['length', 'width', 'height'])
    const volume = dimensions.every(d => d > 0)
        ? (dimensions[0] * dimensions[1] * dimensions[2]).toFixed(2)
        : '0'

    const onSubmit = async (data: OrderForm) => {
        setIsSubmitting(true)

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
        }

        try {
            addOrder({
                from: data.from,
                to: data.to,
                dimensions: {
                    length: data.length,
                    width: data.width,
                    height: data.height
                },
                paymentAmount: data.paymentAmount,
                status: 'pending',
                createdBy: currentUser?.id?.toString() || (() => {
                    console.error('No authenticated user for order creation')
                    throw new Error('Authentication required')
                })()
            })

            // Show success feedback
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
            }

            // Navigate to orders view (for now, back to start)
            setTimeout(() => {
                setScreen('start')
            }, 1000)
        } catch (error) {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
            }
        }

        setIsSubmitting(false)
    }

    const goBack = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
        setScreen('start')
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50">
                <div className="flex items-center gap-4 p-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goBack}
                        className="h-9 w-9"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold">Create Order</h1>
                        <p className="text-sm text-muted-foreground">Setup your delivery request</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Route Section */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Route Details
                            </CardTitle>
                            <CardDescription>
                                Select pickup and destination cities
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="from">From</Label>
                                <DropdownCitySelector
                                    value={watch('from') || ''}
                                    onChange={(value) => setValue('from', value, { shouldValidate: true })}
                                    placeholder="Select pickup city"
                                    error={errors.from?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="to">To</Label>
                                <DropdownCitySelector
                                    value={watch('to') || ''}
                                    onChange={(value) => setValue('to', value, { shouldValidate: true })}
                                    placeholder="Select destination city"
                                    error={errors.to?.message}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dimensions Section */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Cargo Dimensions
                            </CardTitle>
                            <CardDescription>
                                Enter the size of your package in meters
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="length" className="text-sm font-medium text-center block">Length (m)</Label>
                                    <Input
                                        {...register('length', {
                                            required: 'Length is required',
                                            min: { value: 0.1, message: 'Min 0.1m' }
                                        })}
                                        type="number"
                                        step="0.1"
                                        placeholder="0.0"
                                        className={`text-center ${errors.length ? "border-destructive" : ""}`}
                                    />
                                    {errors.length && (
                                        <p className="text-sm text-destructive text-center">{errors.length.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="width" className="text-sm font-medium text-center block">Width (m)</Label>
                                    <Input
                                        {...register('width', {
                                            required: 'Width is required',
                                            min: { value: 0.1, message: 'Min 0.1m' }
                                        })}
                                        type="number"
                                        step="0.1"
                                        placeholder="0.0"
                                        className={`text-center ${errors.width ? "border-destructive" : ""}`}
                                    />
                                    {errors.width && (
                                        <p className="text-sm text-destructive text-center">{errors.width.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="height" className="text-sm font-medium text-center block">Height (m)</Label>
                                    <Input
                                        {...register('height', {
                                            required: 'Height is required',
                                            min: { value: 0.1, message: 'Min 0.1m' }
                                        })}
                                        type="number"
                                        step="0.1"
                                        placeholder="0.0"
                                        className={`text-center ${errors.height ? "border-destructive" : ""}`}
                                    />
                                    {errors.height && (
                                        <p className="text-sm text-destructive text-center">{errors.height.message}</p>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div>
                                    <div className="text-sm font-medium">Calculated Volume</div>
                                    <div className="text-xs text-muted-foreground">Length × Width × Height</div>
                                </div>
                                <Badge variant="secondary" className="text-lg font-mono">
                                    {volume} m³
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Section */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Payment Details
                            </CardTitle>
                            <CardDescription>
                                Set the payment amount for delivery
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="paymentAmount">Payment Amount (USD)</Label>
                                <Input
                                    {...register('paymentAmount', {
                                        required: 'Payment amount is required',
                                        min: { value: 1, message: 'Min $1' }
                                    })}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={errors.paymentAmount ? "border-destructive" : ""}
                                />
                                {errors.paymentAmount && (
                                    <p className="text-sm text-destructive">{errors.paymentAmount.message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 text-base font-medium"
                        size="lg"
                    >
                        {isSubmitting ? 'Creating Order...' : 'Create Order'}
                    </Button>
                </form>
            </div>
        </div>
    )
}