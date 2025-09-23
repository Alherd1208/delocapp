'use client'

import { useStore } from '@/store/useStore'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { ArrowLeft, Plus, Minus, Truck, AlertTriangle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { DropdownCitySelector } from './DropdownCitySelector'

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
        formState: { errors },
        watch,
        setValue
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
            // Validate user authentication
            if (!currentUser || !currentUser.id) {
                console.error('No authenticated user for driver registration')
                console.error('Current user:', currentUser)
                throw new Error('Authentication required. Please ensure you are logged in through Telegram.')
            }

            // Filter out empty entries
            const priorityDirections = data.priorityDirections.filter(d => d.from && d.to)
            const excludedDirections = data.excludedDirections.filter(d => d.from && d.to)
            const cargoVolumes = data.cargoVolumes.filter(v => v.length > 0 && v.width > 0 && v.height > 0)

            console.log('Creating driver with userId:', currentUser.id.toString())

            addDriver({
                userId: currentUser.id.toString(),
                priorityDirections,
                excludedDirections,
                cargoVolumes
            })

            // Show success feedback
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
            }

            // Navigate to driver orders screen after successful registration
            setTimeout(() => {
                setScreen('driver-orders')
            }, 1000)
        } catch (error) {
            console.error('Driver registration error:', error)
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
            }

            // Show error message to user
            if (window.Telegram?.WebApp?.showAlert) {
                window.Telegram.WebApp.showAlert(error instanceof Error ? error.message : 'Registration failed. Please try again.')
            } else {
                alert(error instanceof Error ? error.message : 'Registration failed. Please try again.')
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
                        <h1 className="text-xl font-semibold">Driver Registration</h1>
                        <p className="text-sm text-muted-foreground">Setup your delivery preferences</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Priority Directions */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Priority Directions
                                    </CardTitle>
                                    <CardDescription>
                                        Routes you prefer to drive
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendPriority({ from: '', to: '' })}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Route
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {priorityFields.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Truck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No priority routes added yet</p>
                                    <p className="text-sm">Click "Add Route" to get started</p>
                                </div>
                            ) : (
                                priorityFields.map((field, index) => (
                                    <Card key={field.id} className="bg-green-50/50 border-green-200">
                                        <CardContent className="pt-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                    Route #{index + 1}
                                                </Badge>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removePriority(index)}
                                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>From</Label>
                                                    <DropdownCitySelector
                                                        value={watch(`priorityDirections.${index}.from`) || ''}
                                                        onChange={(value) => setValue(`priorityDirections.${index}.from`, value)}
                                                        placeholder="Select from city"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>To</Label>
                                                    <DropdownCitySelector
                                                        value={watch(`priorityDirections.${index}.to`) || ''}
                                                        onChange={(value) => setValue(`priorityDirections.${index}.to`, value)}
                                                        placeholder="Select to city"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Excluded Directions */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5" />
                                        Excluded Directions
                                    </CardTitle>
                                    <CardDescription>
                                        Routes you don't want to drive
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendExcluded({ from: '', to: '' })}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Route
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {excludedFields.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No excluded routes added yet</p>
                                    <p className="text-sm">Click "Add Route" to exclude specific routes</p>
                                </div>
                            ) : (
                                excludedFields.map((field, index) => (
                                    <Card key={field.id} className="bg-red-50/50 border-red-200">
                                        <CardContent className="pt-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <Badge variant="secondary" className="bg-red-100 text-red-700">
                                                    Excluded #{index + 1}
                                                </Badge>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeExcluded(index)}
                                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>From</Label>
                                                    <DropdownCitySelector
                                                        value={watch(`excludedDirections.${index}.from`) || ''}
                                                        onChange={(value) => setValue(`excludedDirections.${index}.from`, value)}
                                                        placeholder="Select from city"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>To</Label>
                                                    <DropdownCitySelector
                                                        value={watch(`excludedDirections.${index}.to`) || ''}
                                                        onChange={(value) => setValue(`excludedDirections.${index}.to`, value)}
                                                        placeholder="Select to city"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Cargo Volumes */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="h-5 w-5" />
                                        Cargo Volumes
                                    </CardTitle>
                                    <CardDescription>
                                        Maximum cargo sizes you can handle
                                    </CardDescription>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendVolume({ length: 0, width: 0, height: 0 })}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Size
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {volumeFields.map((field, index) => (
                                <Card key={field.id} className="bg-blue-50/50 border-blue-200">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                Volume #{index + 1}
                                            </Badge>
                                            {volumeFields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeVolume(index)}
                                                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-center block">Length (m)</Label>
                                                <Input
                                                    {...register(`cargoVolumes.${index}.length` as const, {
                                                        min: { value: 0.1, message: 'Min 0.1m' }
                                                    })}
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="0.0"
                                                    className="text-center"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-center block">Width (m)</Label>
                                                <Input
                                                    {...register(`cargoVolumes.${index}.width` as const, {
                                                        min: { value: 0.1, message: 'Min 0.1m' }
                                                    })}
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="0.0"
                                                    className="text-center"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-center block">Height (m)</Label>
                                                <Input
                                                    {...register(`cargoVolumes.${index}.height` as const, {
                                                        min: { value: 0.1, message: 'Min 0.1m' }
                                                    })}
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="0.0"
                                                    className="text-center"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 text-base font-medium"
                        size="lg"
                    >
                        {isSubmitting ? 'Registering...' : 'Register as Driver'}
                    </Button>
                </form>
            </div>
        </div>
    )
}