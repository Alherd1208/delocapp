'use client'

import { useStore } from '@/store/useStore'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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
        watch
    } = useForm<OrderForm>()

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
                createdBy: currentUser?.id?.toString() || 'anonymous'
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
        <div className="min-h-screen bg-tg-bg">
            <div className="sticky top-0 bg-tg-bg border-b border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={goBack}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <svg className="w-6 h-6 text-tg-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-semibold text-tg-text">Create Order</h1>
                </div>
            </div>

            <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Route Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium text-tg-text">Route</h2>

                        <div>
                            <label className="block text-sm font-medium text-tg-text mb-2">
                                From
                            </label>
                            <input
                                {...register('from', { required: 'From location is required' })}
                                type="text"
                                placeholder="Enter pickup location"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                            />
                            {errors.from && (
                                <p className="mt-1 text-sm text-red-600">{errors.from.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-tg-text mb-2">
                                To
                            </label>
                            <input
                                {...register('to', { required: 'Destination is required' })}
                                type="text"
                                placeholder="Enter destination"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                            />
                            {errors.to && (
                                <p className="mt-1 text-sm text-red-600">{errors.to.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Dimensions Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium text-tg-text">Cargo Dimensions</h2>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-tg-text mb-2">
                                    Length (m)
                                </label>
                                <input
                                    {...register('length', {
                                        required: 'Length is required',
                                        min: { value: 0.1, message: 'Minimum 0.1m' }
                                    })}
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                                />
                                {errors.length && (
                                    <p className="mt-1 text-xs text-red-600">{errors.length.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-tg-text mb-2">
                                    Width (m)
                                </label>
                                <input
                                    {...register('width', {
                                        required: 'Width is required',
                                        min: { value: 0.1, message: 'Minimum 0.1m' }
                                    })}
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                                />
                                {errors.width && (
                                    <p className="mt-1 text-xs text-red-600">{errors.width.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-tg-text mb-2">
                                    Height (m)
                                </label>
                                <input
                                    {...register('height', {
                                        required: 'Height is required',
                                        min: { value: 0.1, message: 'Minimum 0.1m' }
                                    })}
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                                />
                                {errors.height && (
                                    <p className="mt-1 text-xs text-red-600">{errors.height.message}</p>
                                )}
                            </div>
                        </div>

                        {volume !== '0' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-700">
                                    <span className="font-medium">Total Volume:</span> {volume} m³
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payment Section */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium text-tg-text">Payment</h2>

                        <div>
                            <label className="block text-sm font-medium text-tg-text mb-2">
                                Payment Amount ($)
                            </label>
                            <input
                                {...register('paymentAmount', {
                                    required: 'Payment amount is required',
                                    min: { value: 1, message: 'Minimum $1' }
                                })}
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                            />
                            {errors.paymentAmount && (
                                <p className="mt-1 text-sm text-red-600">{errors.paymentAmount.message}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full tg-button py-4 text-lg font-medium rounded-lg disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating Order...' : 'Create Order'}
                    </button>
                </form>
            </div>
        </div>
    )
}
