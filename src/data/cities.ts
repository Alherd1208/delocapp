export interface City {
    name: string
    country: string
    region?: string
}

export const CITIES: City[] = [
    // Russia (Western part)
    { name: 'Moscow', country: 'Russia', region: 'Central' },
    { name: 'Saint Petersburg', country: 'Russia', region: 'Northwest' },
    { name: 'Nizhny Novgorod', country: 'Russia', region: 'Volga' },
    { name: 'Kazan', country: 'Russia', region: 'Volga' },
    { name: 'Samara', country: 'Russia', region: 'Volga' },
    { name: 'Rostov-on-Don', country: 'Russia', region: 'South' },
    { name: 'Ufa', country: 'Russia', region: 'Volga' },
    { name: 'Volgograd', country: 'Russia', region: 'South' },
    { name: 'Perm', country: 'Russia', region: 'Volga' },
    { name: 'Voronezh', country: 'Russia', region: 'Central' },
    { name: 'Saratov', country: 'Russia', region: 'Volga' },
    { name: 'Krasnodar', country: 'Russia', region: 'South' },
    { name: 'Tula', country: 'Russia', region: 'Central' },
    { name: 'Yaroslavl', country: 'Russia', region: 'Central' },
    { name: 'Ryazan', country: 'Russia', region: 'Central' },
    { name: 'Kaliningrad', country: 'Russia', region: 'Northwest' },
    { name: 'Pskov', country: 'Russia', region: 'Northwest' },
    { name: 'Novgorod', country: 'Russia', region: 'Northwest' },
    { name: 'Smolensk', country: 'Russia', region: 'Central' },
    { name: 'Bryansk', country: 'Russia', region: 'Central' },

    // Belarus
    { name: 'Minsk', country: 'Belarus', region: 'Capital' },
    { name: 'Gomel', country: 'Belarus', region: 'Gomel' },
    { name: 'Mogilev', country: 'Belarus', region: 'Mogilev' },
    { name: 'Vitebsk', country: 'Belarus', region: 'Vitebsk' },
    { name: 'Grodno', country: 'Belarus', region: 'Grodno' },
    { name: 'Brest', country: 'Belarus', region: 'Brest' },
    { name: 'Bobruisk', country: 'Belarus', region: 'Mogilev' },
    { name: 'Baranovichi', country: 'Belarus', region: 'Brest' },
    { name: 'Borisov', country: 'Belarus', region: 'Minsk' },
    { name: 'Pinsk', country: 'Belarus', region: 'Brest' },

    // Georgia
    { name: 'Tbilisi', country: 'Georgia', region: 'Capital' },
    { name: 'Batumi', country: 'Georgia', region: 'Adjara' },
    { name: 'Kutaisi', country: 'Georgia', region: 'Imereti' },
    { name: 'Rustavi', country: 'Georgia', region: 'Kvemo Kartli' },
    { name: 'Zugdidi', country: 'Georgia', region: 'Samegrelo' },
    { name: 'Gori', country: 'Georgia', region: 'Shida Kartli' },
    { name: 'Poti', country: 'Georgia', region: 'Samegrelo' },
    { name: 'Kobuleti', country: 'Georgia', region: 'Adjara' },
    { name: 'Khashuri', country: 'Georgia', region: 'Shida Kartli' },
    { name: 'Senaki', country: 'Georgia', region: 'Samegrelo' },

    // Armenia
    { name: 'Yerevan', country: 'Armenia', region: 'Capital' },
    { name: 'Gyumri', country: 'Armenia', region: 'Shirak' },
    { name: 'Vanadzor', country: 'Armenia', region: 'Lori' },
    { name: 'Vagharshapat', country: 'Armenia', region: 'Armavir' },
    { name: 'Hrazdan', country: 'Armenia', region: 'Kotayk' },
    { name: 'Abovyan', country: 'Armenia', region: 'Kotayk' },
    { name: 'Kapan', country: 'Armenia', region: 'Syunik' },
    { name: 'Armavir', country: 'Armenia', region: 'Armavir' },
    { name: 'Goris', country: 'Armenia', region: 'Syunik' },
    { name: 'Artashat', country: 'Armenia', region: 'Ararat' },

    // Azerbaijan
    { name: 'Baku', country: 'Azerbaijan', region: 'Capital' },
    { name: 'Ganja', country: 'Azerbaijan', region: 'Ganja-Gazakh' },
    { name: 'Sumgayit', country: 'Azerbaijan', region: 'Capital' },
    { name: 'Mingachevir', country: 'Azerbaijan', region: 'Central Aran' },
    { name: 'Qabalá', country: 'Azerbaijan', region: 'Shaki-Zagatala' },
    { name: 'Lankaran', country: 'Azerbaijan', region: 'Lankaran' },
    { name: 'Shaki', country: 'Azerbaijan', region: 'Shaki-Zagatala' },
    { name: 'Yevlakh', country: 'Azerbaijan', region: 'Central Aran' },
    { name: 'Nakhchivan', country: 'Azerbaijan', region: 'Nakhchivan' },
    { name: 'Shirvan', country: 'Azerbaijan', region: 'Central Aran' },

    // Kazakhstan
    { name: 'Almaty', country: 'Kazakhstan', region: 'Almaty' },
    { name: 'Nur-Sultan', country: 'Kazakhstan', region: 'Capital' },
    { name: 'Shymkent', country: 'Kazakhstan', region: 'Turkestan' },
    { name: 'Aktobe', country: 'Kazakhstan', region: 'Aktobe' },
    { name: 'Taraz', country: 'Kazakhstan', region: 'Zhambyl' },
    { name: 'Pavlodar', country: 'Kazakhstan', region: 'Pavlodar' },
    { name: 'Ust-Kamenogorsk', country: 'Kazakhstan', region: 'East Kazakhstan' },
    { name: 'Semey', country: 'Kazakhstan', region: 'East Kazakhstan' },
    { name: 'Atyrau', country: 'Kazakhstan', region: 'Atyrau' },
    { name: 'Kostanay', country: 'Kazakhstan', region: 'Kostanay' },
    { name: 'Karaganda', country: 'Kazakhstan', region: 'Karaganda' },
    { name: 'Petropavl', country: 'Kazakhstan', region: 'North Kazakhstan' },
    { name: 'Oral', country: 'Kazakhstan', region: 'West Kazakhstan' },
    { name: 'Aktau', country: 'Kazakhstan', region: 'Mangystau' },
    { name: 'Temirtau', country: 'Kazakhstan', region: 'Karaganda' },

    // Uzbekistan
    { name: 'Tashkent', country: 'Uzbekistan', region: 'Capital' },
    { name: 'Samarkand', country: 'Uzbekistan', region: 'Samarkand' },
    { name: 'Namangan', country: 'Uzbekistan', region: 'Namangan' },
    { name: 'Andijan', country: 'Uzbekistan', region: 'Andijan' },
    { name: 'Nukus', country: 'Uzbekistan', region: 'Karakalpakstan' },
    { name: 'Fergana', country: 'Uzbekistan', region: 'Fergana' },
    { name: 'Kokand', country: 'Uzbekistan', region: 'Fergana' },
    { name: 'Margilan', country: 'Uzbekistan', region: 'Fergana' },
    { name: 'Bukhara', country: 'Uzbekistan', region: 'Bukhara' },
    { name: 'Qarshi', country: 'Uzbekistan', region: 'Kashkadarya' },
    { name: 'Termez', country: 'Uzbekistan', region: 'Surkhandarya' },
    { name: 'Chirchiq', country: 'Uzbekistan', region: 'Tashkent' },
    { name: 'Urganch', country: 'Uzbekistan', region: 'Khorezm' },
    { name: 'Jizzakh', country: 'Uzbekistan', region: 'Jizzakh' },
    { name: 'Navoiy', country: 'Uzbekistan', region: 'Navoiy' },

    // Tajikistan
    { name: 'Dushanbe', country: 'Tajikistan', region: 'Capital' },
    { name: 'Khujand', country: 'Tajikistan', region: 'Sughd' },
    { name: 'Kulob', country: 'Tajikistan', region: 'Khatlon' },
    { name: 'Qurghonteppa', country: 'Tajikistan', region: 'Khatlon' },
    { name: 'Istaravshan', country: 'Tajikistan', region: 'Sughd' },
    { name: 'Kanibadam', country: 'Tajikistan', region: 'Sughd' },
    { name: 'Isfara', country: 'Tajikistan', region: 'Sughd' },
    { name: 'Panjakent', country: 'Tajikistan', region: 'Sughd' },
    { name: 'Khorog', country: 'Tajikistan', region: 'GBAO' },
    { name: 'Tursunzoda', country: 'Tajikistan', region: 'Districts of Republican Subordination' },

    // Kyrgyzstan
    { name: 'Bishkek', country: 'Kyrgyzstan', region: 'Capital' },
    { name: 'Osh', country: 'Kyrgyzstan', region: 'Osh' },
    { name: 'Jalal-Abad', country: 'Kyrgyzstan', region: 'Jalal-Abad' },
    { name: 'Karakol', country: 'Kyrgyzstan', region: 'Issyk-Kul' },
    { name: 'Tokmok', country: 'Kyrgyzstan', region: 'Chuy' },
    { name: 'Uzgen', country: 'Kyrgyzstan', region: 'Osh' },
    { name: 'Naryn', country: 'Kyrgyzstan', region: 'Naryn' },
    { name: 'Talas', country: 'Kyrgyzstan', region: 'Talas' },
    { name: 'Batken', country: 'Kyrgyzstan', region: 'Batken' },
    { name: 'Kant', country: 'Kyrgyzstan', region: 'Chuy' }
]

// Group cities by country for easier selection
export const CITIES_BY_COUNTRY = CITIES.reduce((acc, city) => {
    if (!acc[city.country]) {
        acc[city.country] = []
    }
    acc[city.country].push(city)
    return acc
}, {} as Record<string, City[]>)

// Get all unique countries
export const COUNTRIES = Object.keys(CITIES_BY_COUNTRY).sort()

// Search function for cities
export function searchCities(query: string): City[] {
    if (!query.trim()) return CITIES

    const searchTerm = query.toLowerCase().trim()
    return CITIES.filter(city =>
        city.name.toLowerCase().includes(searchTerm) ||
        city.country.toLowerCase().includes(searchTerm) ||
        (city.region && city.region.toLowerCase().includes(searchTerm))
    )
}
