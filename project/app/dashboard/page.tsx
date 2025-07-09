'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { Service } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { TRADES } from '@/lib/types';

export default function DashboardPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trade: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && (!user || userData?.role !== 'provider')) {
      router.push('/signin');
      return;
    }
    
    if (user && userData?.role === 'provider') {
      fetchServices();
    }
  }, [user, userData, loading, router]);

  const fetchServices = async () => {
    if (!user) return;
    
    try {
      const q = query(collection(db, 'services'), where('providerId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedServices = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Service[];
      
      setServices(fetchedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      if (editingService) {
        // Update existing service
        await updateDoc(doc(db, 'services', editingService.id), {
          title: formData.title,
          description: formData.description,
          trade: formData.trade
        });
      } else {
        // Create new service
        await addDoc(collection(db, 'services'), {
          providerId: user.uid,
          title: formData.title,
          description: formData.description,
          trade: formData.trade,
          createdAt: new Date()
        });
      }
      
      setFormData({ title: '', description: '', trade: '' });
      setEditingService(null);
      setIsDialogOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      trade: service.trade
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) return;
    
    try {
      await deleteDoc(doc(db, 'services', serviceId));
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

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

  if (!user || userData?.role !== 'provider') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
          <p className="text-gray-600">Gérez vos services et votre profil</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">{userData.name}</p>
                  <p className="text-gray-600">{userData.city}</p>
                  <p className="text-gray-600">{userData.phone}</p>
                </div>
                <Button variant="outline" className="w-full">
                  Modifier le profil
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Services Management */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Mes services</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      setEditingService(null);
                      setFormData({ title: '', description: '', trade: '' });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {editingService ? 'Modifier le service' : 'Ajouter un service'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titre du service</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Ex: Réparation de plomberie"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="trade">Métier</Label>
                      <Select value={formData.trade} onValueChange={(value) => setFormData(prev => ({ ...prev, trade: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un métier" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRADES.map((trade) => (
                            <SelectItem key={trade} value={trade}>
                              {trade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Décrivez votre service en détail..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting ? 'Enregistrement...' : editingService ? 'Modifier' : 'Ajouter'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{service.title}</h3>
                          <Badge variant="outline" className="mt-1">{service.trade}</Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(service.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Aucun service ajouté pour le moment.</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Cliquez sur "Ajouter un service" pour commencer.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}