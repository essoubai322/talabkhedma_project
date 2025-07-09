'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import ProviderCard from '@/components/ProviderCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, UserCheck, Phone, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [featuredProviders, setFeaturedProviders] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProviders = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          where('role', '==', 'provider'),
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        const providers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        
        setFeaturedProviders(providers);
      } catch (error) {
        console.error('Error fetching featured providers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProviders();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Trouvez le bon <span className="text-yellow-300">Maallem</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Connectez-vous avec des artisans qualifiés près de chez vous au Maroc
            </p>
          </div>
          <SearchBar className="max-w-4xl mx-auto" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Search className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Recherchez</h3>
                <p className="text-gray-600">
                  Trouvez des artisans près de chez vous en sélectionnant le service et la ville
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Choisissez</h3>
                <p className="text-gray-600">
                  Consultez les profils des artisans et choisissez celui qui vous convient
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Phone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Contactez</h3>
                <p className="text-gray-600">
                  Appelez directement l'artisan pour discuter de vos besoins
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Providers Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Artisans recommandés</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez quelques-uns de nos artisans les plus appréciés
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Link href="/search">Voir tous les artisans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous êtes artisan ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme et trouvez de nouveaux clients facilement
          </p>
          <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
            <Link href="/signup">S'inscrire comme artisan</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}