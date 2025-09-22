'use client'

import { useStore } from '@/store/useStore'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

interface DriverForm {
    priorityDirections: Array<{ from: string; to: string }>
    excludedDirections: Array<{ from: string; to: string }>
    cargoVolumes: Array<{ length: number; width: number; height: number }>
}

export function DriverRegistrationScreen() {
    const { addDriver, setScreen, currentUser } = useStore()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<DriverForm>({
        defaultValues: {
            priorityDirections: [],
            excludedDirections: [],
            cargoVolumes: [{ length: 0, width: 0, height: 0 }]
        }
    })

    const {
        fields: priorityFields,
        append: appendPriority,
        remove: removePriority
    } = useFieldArray({
        control,
        name: 'priorityDirections'
    })

    const {
        fields: excludedFields,
        append: appendExcluded,
        remove: removeExcluded
    } = useFieldArray({
        control,
        name: 'excludedDirections'
    })

    const {
        fields: volumeFields,
        append: appendVolume,
        remove: removeVolume
    } = useFieldArray({
        control,
        name: 'cargoVolumes'
    })

    const onSubmit = async (data: DriverForm) => {
        setIsSubmitting(true)

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
        }

        try {
            // Filter out empty entries
            const priorityDirections = data.priorityDirections.filter(d => d.from && d.to)
            const excludedDirections = data.excludedDirections.filter(d => d.from && d.to)
            const cargoVolumes = data.cargoVolumes.filter(v => v.length > 0 && v.width > 0 && v.height > 0)

            addDriver({
                userId: currentUser?.id?.toString() || 'anonymous',
                priorityDirections,
                excludedDirections,
                cargoVolumes
            })

            // Show success feedback
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
            }

            // Navigate back (for now, to start)
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
                    <h1 className="text-xl font-semibold text-tg-text">Driver Registration</h1>
                </div>
            </div>

            <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Priority Directions */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-tg-text">Priority Directions</h2>
                            <button
                                type="button"
                                onClick={() => appendPriority({ from: '', to: '' })}
                                className="text-tg-button font-medium text-sm"
                            >
                                + Add
                            </button>
                        </div>

                        {priorityFields.map((field, index) => (
                            <div key={field.id} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Direction #{index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removePriority(index)}
                                        className="text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        {...register(`priorityDirections.${index}.from` as const)}
                                        type="text"
                                        placeholder="From"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                                    />
                                    <input
                                        {...register(`priorityDirections.${index}.to` as const)}
                                        type="text"
                                        placeholder="To"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Excluded Directions */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-tg-text">Excluded Directions</h2>
                            <button
                                type="button"
                                onClick={() => appendExcluded({ from: '', to: '' })}
                                className="text-tg-button font-medium text-sm"
                            >
                                + Add
                            </button>
                        </div>

                        {excludedFields.map((field, index) => (
                            <div key={field.id} className="space-y-3 p-4 bg-red-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-red-600">Excluded #{index + 1}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeExcluded(index)}
                                        className="text-red-500 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        {...register(`excludedDirections.${index}.from` as const)}
                                        type="text"
                                        placeholder="From"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                                    />
                                    <input
                                        {...register(`excludedDirections.${index}.to` as const)}
                                        type="text"
                                        placeholder="To"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cargo Volumes */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-tg-text">Cargo Volumes</h2>
                            <button
                                type="button"
                                onClick={() => appendVolume({ length: 0, width: 0, height: 0 })}
                                className="text-tg-button font-medium text-sm"
                            >
                                + Add
                            </button>
                        </div>

                        {volumeFields.map((field, index) => (
                            <div key={field.id} className="space-y-3 p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-blue-600">Volume #{index + 1}</span>
                                    {volumeFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVolume(index)}
                                            className="text-red-500 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Length (m)</label>
                                        <input
                                            {...register(`cargoVolumes.${index}.length` as const, {
                                                min: { value: 0.1, message: 'Min 0.1m' }
                                            })}
                                            type="number"
                                            step="0.1"
                                            placeholder="0.0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Width (m)</label>
                                        <input
                                            {...register(`cargoVolumes.${index}.width` as const, {
                                                min: { value: 0.1, message: 'Min 0.1m' }
                                            })}
                                            type="number"
                                            step="0.1"
                                            placeholder="0.0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Height (m)</label>
                                        <input
                                            {...register(`cargoVolumes.${index}.height` as const, {
                                                min: { value: 0.1, message: 'Min 0.1m' }
                                            })}
                                            type="number"
                                            step="0.1"
                                            placeholder="0.0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full tg-button py-4 text-lg font-medium rounded-lg disabled:opacity-50"
                    >
                        {isSubmitting ? 'Registering...' : 'Register as Driver'}
                    </button>
                </form>
            </div>
        </div>
    )
}
