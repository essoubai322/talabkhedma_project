'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Service } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import ProviderCard from '@/components/ProviderCard';
import { Card, CardContent } from '@/components/ui/card';

export default function SearchPage() {
  const [providers, setProviders] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const trade = searchParams.get('trade');
  const city = searchParams.get('city');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // First, get services that match the trade
        let serviceQuery = query(collection(db, 'services'));
        if (trade) {
          serviceQuery = query(collection(db, 'services'), where('trade', '==', trade));
        }
        
        const servicesSnapshot = await getDocs(serviceQuery);
        const fetchedServices = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        
        setServices(fetchedServices);
        
        // Then get providers based on city and services
        let providerQuery = query(collection(db, 'users'), where('role', '==', 'provider'));
        if (city) {
          providerQuery = query(
            collection(db, 'users'),
            where('role', '==', 'provider'),
            where('city', '==', city)
          );
        }
        
        const providersSnapshot = await getDocs(providerQuery);
        const fetchedProviders = providersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        
        // Filter providers based on services if trade is specified
        if (trade && fetchedServices.length > 0) {
          const providerIds = fetchedServices.map(service => service.providerId);
          const filteredProviders = fetchedProviders.filter(provider => 
            providerIds.includes(provider.id)
          );
          setProviders(filteredProviders);
        } else {
          setProviders(fetchedProviders);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [trade, city]);

  const getProviderServices = (providerId: string) => {
    return services.filter(service => service.providerId === providerId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Résultats de recherche
          </h1>
          <p className="text-gray-600">
            {trade && city ? `${trade} à ${city}` : 
             trade ? `${trade}` : 
             city ? `Artisans à ${city}` : 
             'Tous les artisans'}
          </p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <ProviderCard 
                key={provider.id} 
                provider={provider} 
                services={getProviderServices(provider.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Aucun artisan trouvé pour ces critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}