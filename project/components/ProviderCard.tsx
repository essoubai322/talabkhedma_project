'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone } from 'lucide-react';
import { User } from '@/lib/types';

interface ProviderCardProps {
  provider: User;
  services?: Array<{ title: string; trade: string }>;
}

export default function ProviderCard({ provider, services = [] }: ProviderCardProps) {
  return (
    <Link href={`/provider/${provider.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={provider.profilePicture} alt={provider.name} />
              <AvatarFallback>{provider.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{provider.name}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-3 w-3 mr-1" />
                {provider.city}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {services.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {services.slice(0, 3).map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service.trade}
                </Badge>
              ))}
              {services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{services.length - 3} autres
                </Badge>
              )}
            </div>
          )}
          {provider.about && (
            <p className="text-sm text-gray-600 line-clamp-2">{provider.about}</p>
          )}
          {provider.phone && (
            <div className="flex items-center text-sm text-gray-600 mt-2">
              <Phone className="h-3 w-3 mr-1" />
              {provider.phone}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}