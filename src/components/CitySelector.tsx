'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
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

    // Filter cities based on search query and selected country
    const filteredCities = searchCities(searchQuery).filter(city =>
        selectedCountry === 'all' || city.country === selectedCountry
    )

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

    const selectedCity = value ? filteredCities.find(city => `${city.name}, ${city.country}` === value) : null

    return (
        <div className={cn("space-y-2", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        className={cn(
                            "w-full justify-between h-auto py-3 px-4",
                            !value && "text-muted-foreground",
                            error && "border-destructive"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            {selectedCity && (
                                <Badge variant="secondary" className="text-xs">
                                    {selectedCity.country}
                                </Badge>
                            )}
                            <span className="truncate">
                                {value || placeholder}
                            </span>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 shrink-0 opacity-50 transition-transform", isOpen && "rotate-180")} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <div className="p-3 space-y-3 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search cities..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Countries ({filteredCities.length})
                                    </SelectItem>
                                    <Separator className="my-1" />
                                    {COUNTRIES.map(country => (
                                        <SelectItem key={country} value={country}>
                                            <div className="flex items-center justify-between w-full">
                                                <span>{country}</span>
                                                <Badge variant="outline" className="ml-2 text-xs">
                                                    {CITIES_BY_COUNTRY[country].length}
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <CommandList>
                            <ScrollArea className="h-60">
                                {filteredCities.length > 0 ? (
                                    <CommandGroup>
                                        {filteredCities.map((city, index) => (
                                            <CommandItem
                                                key={`${city.name}-${city.country}-${index}`}
                                                value={`${city.name}, ${city.country}`}
                                                onSelect={() => handleCitySelect(city)}
                                                className="flex items-center justify-between py-3 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col">
                                                        <div className="font-medium">{city.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {city.country}{city.region ? `, ${city.region}` : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {city.country}
                                                    </Badge>
                                                    {value === `${city.name}, ${city.country}` && (
                                                        <Check className="h-4 w-4 text-primary" />
                                                    )}
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ) : (
                                    <CommandEmpty>
                                        <div className="flex flex-col items-center gap-2 py-8">
                                            <Search className="h-8 w-8 text-muted-foreground" />
                                            <div className="text-sm font-medium">No cities found</div>
                                            <div className="text-xs text-muted-foreground">
                                                Try adjusting your search or filter
                                            </div>
                                        </div>
                                    </CommandEmpty>
                                )}
                            </ScrollArea>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    )
}
