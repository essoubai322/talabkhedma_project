'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Service } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Star } from 'lucide-react';

export default function ProviderPage() {
  const { id } = useParams();
  const [provider, setProvider] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return;
      
      try {
        // Fetch provider data
        const providerDoc = await getDoc(doc(db, 'users', id as string));
        if (providerDoc.exists()) {
          setProvider({ id: providerDoc.id, ...providerDoc.data() } as User);
        }
        
        // Fetch provider's services
        const servicesQuery = query(
          collection(db, 'services'),
          where('providerId', '==', id)
        );
        const servicesSnapshot = await getDocs(servicesQuery);
        const fetchedServices = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        
        setServices(fetchedServices);
      } catch (error) {
        console.error('Error fetching provider:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Artisan non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={provider.profilePicture} alt={provider.name} />
                <AvatarFallback className="text-2xl">{provider.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2" />
                  {provider.city}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {services.map((service) => (
                    <Badge key={service.id} variant="secondary">
                      {service.trade}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setShowPhone(!showPhone)}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {showPhone ? provider.phone : 'Voir le téléphone'}
                  </Button>
                  
                  {provider.email && (
                    <Button variant="outline" asChild>
                      <a href={`mailto:${provider.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Envoyer un email
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* About Section */}
        {provider.about && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>À propos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{provider.about}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle>Services proposés</CardTitle>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <div className="grid gap-4">
                {services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                      <Badge variant="outline">{service.trade}</Badge>
                    </div>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucun service listé pour le moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}