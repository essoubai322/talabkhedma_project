export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'provider';
  profilePicture?: string;
  city: string;
  phone?: string;
  about?: string;
  createdAt: Date;
}

export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  trade: string;
  createdAt: Date;
}

export interface Provider extends User {
  role: 'provider';
  services: Service[];
}

export const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tangier',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kenitra',
  'Tétouan',
  'Salé',
  'Temara',
  'Safi',
  'Khouribga',
  'Jadida',
  'Settat',
  'Mohammedia',
  'Larache',
  'Ksar El Kebir',
  'Guelmim'
];

export const TRADES = [
  'Plombier',
  'Électricien',
  'Menuisier',
  'Peintre',
  'Maçon',
  'Carreleur',
  'Mécanicien',
  'Jardinier',
  'Serrurier',
  'Couvreur',
  'Vitrier',
  'Climatiseur',
  'Tapissier',
  'Parqueteur',
  'Soudeur'
];