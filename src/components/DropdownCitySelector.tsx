'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CITIES_BY_COUNTRY, COUNTRIES, type City } from '@/data/cities'

interface DropdownCitySelectorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    error?: string
}

export function DropdownCitySelector({
    value,
    onChange,
    placeholder = "Select city",
    className = "",
    error
}: DropdownCitySelectorProps) {
    const [selectedCountry, setSelectedCountry] = useState<string>('')
    const [selectedCity, setSelectedCity] = useState<string>('')

    // Parse the current value to extract country and city
    useEffect(() => {
        if (value) {
            const parts = value.split(', ')
            if (parts.length === 2) {
                const [cityName, countryName] = parts
                setSelectedCity(cityName)
                setSelectedCountry(countryName)
            }
        } else {
            setSelectedCity('')
            setSelectedCountry('')
        }
    }, [value])

    const handleCountryChange = (country: string) => {
        setSelectedCountry(country)
        setSelectedCity('')
        onChange('')

        // Haptic feedback if available
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
    }

    const handleCityChange = (cityName: string) => {
        setSelectedCity(cityName)
        const cityDisplay = `${cityName}, ${selectedCountry}`
        onChange(cityDisplay)

        // Haptic feedback if available
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
    }

    const availableCities = selectedCountry ? CITIES_BY_COUNTRY[selectedCountry] || [] : []

    return (
        <div className={cn("space-y-3", className)}>
            {/* Country Selector */}
            <div className="space-y-1">
                <Select value={selectedCountry} onValueChange={handleCountryChange}>
                    <SelectTrigger className={cn(
                        "w-full",
                        error && "border-red-500 focus:ring-red-500"
                    )}>
                        <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                        {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                                <div className="flex items-center gap-2">
                                    <span>{country}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({CITIES_BY_COUNTRY[country]?.length || 0} cities)
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* City Selector */}
            <div className="space-y-1">
                <Select
                    value={selectedCity}
                    onValueChange={handleCityChange}
                    disabled={!selectedCountry}
                >
                    <SelectTrigger className={cn(
                        "w-full",
                        error && "border-red-500 focus:ring-red-500",
                        !selectedCountry && "opacity-50 cursor-not-allowed"
                    )}>
                        <SelectValue placeholder={selectedCountry ? "Select city" : "Select country first"} />
                    </SelectTrigger>
                    <SelectContent>
                        {availableCities.map((city) => (
                            <SelectItem key={`${city.name}-${city.country}`} value={city.name}>
                                <div className="flex items-center gap-2">
                                    <span>{city.name}</span>
                                    {city.region && (
                                        <span className="text-xs text-muted-foreground">
                                            ({city.region})
                                        </span>
                                    )}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Selected Value Display */}
            {value && (
                <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                        <Check className="h-4 w-4" />
                        <span>{value}</span>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    )
}
