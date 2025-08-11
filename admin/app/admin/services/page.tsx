"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, CheckCircle, Search, Filter, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api-client';
import { API_PATHS } from '@/lib/api-client';

// Types
interface Service {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  clientName: string;
  clientEmail: string;
  createdAt: string;
}

const StatusBadge = ({ status }: { status: Service['status'] }) => {
  const statusConfig = {
    Pending: {
      variant: 'secondary',
      icon: <Clock className="mr-1 h-3 w-3" />,
      label: 'Pending',
    },
    'In Progress': {
      variant: 'default',
      icon: <AlertCircle className="mr-1 h-3 w-3" />,
      label: 'In Progress',
    },
    Completed: {
      variant: 'default',
      icon: <CheckCircle className="mr-1 h-3 w-3" />,
      label: 'Completed',
    },
  };

  const config = statusConfig[status] || { variant: 'outline', icon: null, label: 'Unknown' };

  return (
    <Badge variant={config.variant as any}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default function ServicesPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Define service categories
  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'income-tax', name: 'Income Tax' },
    { id: 'gst', name: 'GST' },
    { id: 'tds', name: 'TDS' },
    { id: 'private-limited', name: 'Private Limited' },
    { id: 'llp', name: 'LLP' },
    { id: 'opc', name: 'OPC' },
    { id: 'partnership', name: 'Partnership' },
    { id: 'sole-proprietorship', name: 'Sole Proprietorship' },
    { id: 'public-limited', name: 'Public Limited' },
    { id: 'section-8', name: 'Section 8' },
    { id: 'trademark', name: 'Trademark' },
    { id: 'copyright', name: 'Copyright' },
    { id: 'iso', name: 'ISO' },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // This will need to be updated with the actual API endpoint
        const response = await api.get('/api/admin/services');
        
        // Check if response.data is an object with a data property
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If API returns { data: [...] } structure, use the nested data
          setServices(response.data.data);
        } else if (Array.isArray(response.data)) {
          // Otherwise use the response data directly if it's an array
          setServices(response.data);
        } else {
          // If neither, set empty array
          setServices([]);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast({ title: 'Error', description: 'Failed to load services.', variant: 'destructive' });
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [toast]);

  // Filter services based on search query and active category
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleServiceClick = (id: string) => {
    router.push(`/admin/services/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Services</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Services</h1>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Service
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <div className="overflow-x-auto pb-2">
            <TabsList className="inline-flex w-auto h-auto bg-transparent p-0 space-x-2">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="rounded-md px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map(service => (
                    <Card 
                      key={service._id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleServiceClick(service._id)}
                    >
                      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div>
                          <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{service.category}</p>
                        </div>
                        <StatusBadge status={service.status} />
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm line-clamp-2 mb-4">{service.description}</p>
                        <div className="flex flex-col space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Client:</span>
                            <span className="font-medium">{service.clientName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created:</span>
                            <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">No services found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchQuery ? 'Try a different search term or filter.' : 'No services available in this category.'}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
}