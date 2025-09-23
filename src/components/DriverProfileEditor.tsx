'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, X, Save, Edit, Truck } from 'lucide-react'
import { CITIES } from '@/data/cities'
import { Driver } from '@/lib/models'

interface DriverProfileEditorProps {
    driver: Driver
    onSave: (updates: Partial<Driver>) => Promise<void>
    onCancel: () => void
}

interface Direction {
    from: string
    to: string
}

interface CargoVolume {
    length: number
    width: number
    height: number
}

export function DriverProfileEditor({ driver, onSave, onCancel }: DriverProfileEditorProps) {
    const [priorityDirections, setPriorityDirections] = useState<Direction[]>(driver.priorityDirections || [])
    const [excludedDirections, setExcludedDirections] = useState<Direction[]>(driver.excludedDirections || [])
    const [cargoVolumes, setCargoVolumes] = useState<CargoVolume[]>(driver.cargoVolumes || [])
    const [isSaving, setIsSaving] = useState(false)
    const [editingDirection, setEditingDirection] = useState<'priority' | 'excluded' | null>(null)
    const [editingVolume, setEditingVolume] = useState<number | null>(null)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await onSave({
                priorityDirections,
                excludedDirections,
                cargoVolumes
            })
        } catch (error) {
            console.error('Failed to save driver profile:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const addDirection = (type: 'priority' | 'excluded') => {
        const newDirection = { from: '', to: '' }
        if (type === 'priority') {
            setPriorityDirections([...priorityDirections, newDirection])
        } else {
            setExcludedDirections([...excludedDirections, newDirection])
        }
        setEditingDirection(type)
    }

    const updateDirection = (type: 'priority' | 'excluded', index: number, field: 'from' | 'to', value: string) => {
        if (type === 'priority') {
            const updated = [...priorityDirections]
            updated[index][field] = value
            setPriorityDirections(updated)
        } else {
            const updated = [...excludedDirections]
            updated[index][field] = value
            setExcludedDirections(updated)
        }
    }

    const removeDirection = (type: 'priority' | 'excluded', index: number) => {
        if (type === 'priority') {
            setPriorityDirections(priorityDirections.filter((_, i) => i !== index))
        } else {
            setExcludedDirections(excludedDirections.filter((_, i) => i !== index))
        }
    }

    const addCargoVolume = () => {
        const newVolume = { length: 0, width: 0, height: 0 }
        setCargoVolumes([...cargoVolumes, newVolume])
        setEditingVolume(cargoVolumes.length)
    }

    const updateCargoVolume = (index: number, field: 'length' | 'width' | 'height', value: number) => {
        const updated = [...cargoVolumes]
        updated[index][field] = value
        setCargoVolumes(updated)
    }

    const removeCargoVolume = (index: number) => {
        setCargoVolumes(cargoVolumes.filter((_, i) => i !== index))
    }

    const cityOptions = CITIES.map(city => ({
        value: city.name,
        label: `${city.name}, ${city.country}`
    }))

    return (
        <div className="space-y-6">
            {/* Priority Directions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        Priority Directions
                    </CardTitle>
                    <CardDescription>
                        Routes you prefer to drive and want to prioritize
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {priorityDirections.map((direction, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs">From</Label>
                                    <Select
                                        value={direction.from}
                                        onValueChange={(value) => updateDirection('priority', index, 'from', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cityOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs">To</Label>
                                    <Select
                                        value={direction.to}
                                        onValueChange={(value) => updateDirection('priority', index, 'to', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cityOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDirection('priority', index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        onClick={() => addDirection('priority')}
                        className="w-full"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Priority Direction
                    </Button>
                </CardContent>
            </Card>

            {/* Excluded Directions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <X className="w-5 h-5" />
                        Excluded Directions
                    </CardTitle>
                    <CardDescription>
                        Routes you want to avoid or exclude from your driving options
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {excludedDirections.map((direction, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs">From</Label>
                                    <Select
                                        value={direction.from}
                                        onValueChange={(value) => updateDirection('excluded', index, 'from', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cityOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-xs">To</Label>
                                    <Select
                                        value={direction.to}
                                        onValueChange={(value) => updateDirection('excluded', index, 'to', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select city" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {cityOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDirection('excluded', index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        onClick={() => addDirection('excluded')}
                        className="w-full"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Excluded Direction
                    </Button>
                </CardContent>
            </Card>

            {/* Cargo Volumes */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        Cargo Volumes
                    </CardTitle>
                    <CardDescription>
                        Maximum cargo dimensions you can transport (in centimeters)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {cargoVolumes.map((volume, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-center block">Length (cm)</Label>
                                    <Input
                                        type="number"
                                        value={volume.length}
                                        onChange={(e) => updateCargoVolume(index, 'length', parseInt(e.target.value) || 0)}
                                        min="0"
                                        className="text-center"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-center block">Width (cm)</Label>
                                    <Input
                                        type="number"
                                        value={volume.width}
                                        onChange={(e) => updateCargoVolume(index, 'width', parseInt(e.target.value) || 0)}
                                        min="0"
                                        className="text-center"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs font-medium text-center block">Height (cm)</Label>
                                    <Input
                                        type="number"
                                        value={volume.height}
                                        onChange={(e) => updateCargoVolume(index, 'height', parseInt(e.target.value) || 0)}
                                        min="0"
                                        className="text-center"
                                    />
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCargoVolume(index)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        onClick={addCargoVolume}
                        className="w-full"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Cargo Volume
                    </Button>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex-1"
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}
