'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { MOROCCAN_CITIES, TRADES } from '@/lib/types';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = '' }: SearchBarProps) {
  const [trade, setTrade] = useState('');
  const [city, setCity] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (trade) params.append('trade', trade);
    if (city) params.append('city', city);
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="trade" className="block text-sm font-medium text-gray-700 mb-2">
            Quel service recherchez-vous ?
          </label>
          <Select value={trade} onValueChange={setTrade}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un métier" />
            </SelectTrigger>
            <SelectContent>
              {TRADES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            Dans quelle ville ?
          </label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une ville" />
            </SelectTrigger>
            <SelectContent>
              {MOROCCAN_CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <Button 
            onClick={handleSearch}
            className="bg-orange-600 hover:bg-orange-700 h-10 px-8"
            disabled={!trade && !city}
          >
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>
    </div>
  );
}