'use client'

import { useState, useRef, useEffect } from 'react'
import { searchCities, CITIES_BY_COUNTRY, COUNTRIES, type City } from '@/data/cities'

interface CitySelectorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
    error?: string
}

export function CitySelector({ value, onChange, placeholder = "Select city", className = "", error }: CitySelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCountry, setSelectedCountry] = useState<string>('all')
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Filter cities based on search query and selected country
    const filteredCities = searchCities(searchQuery).filter(city =>
        selectedCountry === 'all' || city.country === selectedCountry
    )

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                setSearchQuery('')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleCitySelect = (city: City) => {
        const cityDisplay = `${city.name}, ${city.country}`
        onChange(cityDisplay)
        setIsOpen(false)
        setSearchQuery('')

        // Haptic feedback if available
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        }
    }

    const handleInputClick = () => {
        setIsOpen(!isOpen)
        if (!isOpen) {
            // Focus the search input when opening
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setIsOpen(true)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Main input field */}
            <div
                onClick={handleInputClick}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg cursor-pointer focus-within:ring-2 focus-within:ring-tg-button focus-within:border-transparent ${className} ${error ? 'border-red-500' : ''}`}
            >
                <div className="flex items-center justify-between">
                    <span className={value ? 'text-tg-text' : 'text-gray-400'}>
                        {value || placeholder}
                    </span>
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                    {/* Search and filter header */}
                    <div className="p-3 border-b border-gray-200 space-y-3">
                        {/* Search input */}
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search cities..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                        />

                        {/* Country filter */}
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tg-button focus:border-transparent"
                        >
                            <option value="all">All Countries</option>
                            {COUNTRIES.map(country => (
                                <option key={country} value={country}>
                                    {country} ({CITIES_BY_COUNTRY[country].length})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Cities list */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredCities.length > 0 ? (
                            <div className="py-2">
                                {filteredCities.map((city, index) => (
                                    <button
                                        key={`${city.name}-${city.country}-${index}`}
                                        onClick={() => handleCitySelect(city)}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-tg-text">{city.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {city.country}{city.region ? `, ${city.region}` : ''}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {city.country}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500">
                                <div className="text-lg mb-2">🔍</div>
                                <div>No cities found</div>
                                <div className="text-sm">Try adjusting your search or filter</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
