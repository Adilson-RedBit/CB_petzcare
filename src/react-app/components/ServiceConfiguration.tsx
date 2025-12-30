import { useState, useEffect } from 'react';
import { Service, ServicePricing } from '@/shared/types';
import { Plus, Edit, Trash2, Save, X, DollarSign, Clock, FileText } from 'lucide-react';

export default function ServiceConfiguration() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    duration_minutes: 60,
    price: 0,
    is_active: true
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const [pricingData, setPricingData] = useState<{ [key: number]: { [key: string]: number } }>({});

  useEffect(() => {
    fetchServices();
    fetchPricing();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/admin/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchPricing = async () => {
    try {
      const response = await fetch('/api/admin/service-pricing');
      const data = await response.json();
      
      // Organize pricing by service and size
      const organized: { [key: number]: { [key: string]: number } } = {};
      data.forEach((price: ServicePricing) => {
        if (!organized[price.service_id]) {
          organized[price.service_id] = {};
        }
        organized[price.service_id][price.size] = price.base_price;
      });
      setPricingData(organized);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch pricing:', error);
      setLoading(false);
    }
  };

  const handleCreateService = async () => {
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });
      
      if (!response.ok) throw new Error('Failed to create service');
      
      await fetchServices();
      setNewService({
        name: '',
        description: '',
        duration_minutes: 60,
        price: 0,
        is_active: true
      });
      setShowNewForm(false);
    } catch (error) {
      alert('Erro ao criar serviço: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleUpdateService = async () => {
    if (!editingService) return;
    
    try {
      const response = await fetch(`/api/admin/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });
      
      if (!response.ok) throw new Error('Failed to update service');
      
      await fetchServices();
      setEditingService(null);
    } catch (error) {
      alert('Erro ao atualizar serviço: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    
    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete service');
      
      await fetchServices();
    } catch (error) {
      alert('Erro ao excluir serviço: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const handleUpdatePricing = async (serviceId: number, size: string, price: number) => {
    try {
      const response = await fetch('/api/admin/service-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          size,
          base_price: price
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update pricing');
      
      await fetchPricing();
    } catch (error) {
      alert('Erro ao atualizar preço: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const toggleServiceStatus = async (service: Service) => {
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, is_active: !service.is_active }),
      });
      
      if (!response.ok) throw new Error('Failed to toggle service status');
      
      await fetchServices();
    } catch (error) {
      alert('Erro ao alterar status: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Gerenciar Serviços</h3>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* New Service Form */}
      {showNewForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-4">Criar Novo Serviço</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Nome</label>
              <input
                type="text"
                value={newService.name || ''}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do serviço"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Duração (minutos)</label>
              <input
                type="number"
                value={newService.duration_minutes || 60}
                onChange={(e) => setNewService({ ...newService, duration_minutes: parseInt(e.target.value) })}
                className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-900 mb-1">Descrição</label>
              <textarea
                value={newService.description || ''}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                rows={2}
                className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição do serviço"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCreateService}
              className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              <Save className="h-4 w-4" />
              <span>Salvar</span>
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="flex items-center space-x-1 text-gray-600 px-3 py-1 rounded text-sm hover:text-gray-800"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${service.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                {editingService?.id === service.id ? (
                  <input
                    type="text"
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="text-lg font-semibold bg-transparent border-b border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleServiceStatus(service)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    service.is_active 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {service.is_active ? 'Ativo' : 'Inativo'}
                </button>
                {editingService?.id === service.id ? (
                  <div className="flex space-x-1">
                    <button
                      onClick={handleUpdateService}
                      className="p-1 text-green-600 hover:bg-green-100 rounded"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingService(null)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setEditingService(service)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {editingService?.id === service.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Duração (minutos)
                  </label>
                  <input
                    type="number"
                    value={editingService.duration_minutes}
                    onChange={(e) => setEditingService({ ...editingService, duration_minutes: parseInt(e.target.value) })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="inline h-4 w-4 mr-1" />
                    Descrição
                  </label>
                  <textarea
                    value={editingService.description || ''}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 mb-4">
                <p><Clock className="inline h-4 w-4 mr-1" />{service.duration_minutes} minutos</p>
                {service.description && <p className="mt-1">{service.description}</p>}
              </div>
            )}

            {/* Pricing by Size */}
            <div className="border-t pt-4">
              <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Preços por Porte
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['pequeno', 'medio', 'grande'].map((size) => (
                  <div key={size} className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {size === 'medio' ? 'Médio' : size}
                    </label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">R$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={pricingData[service.id]?.[size] || 0}
                        onChange={(e) => {
                          const newPrice = parseFloat(e.target.value) || 0;
                          setPricingData(prev => ({
                            ...prev,
                            [service.id]: {
                              ...prev[service.id],
                              [size]: newPrice
                            }
                          }));
                        }}
                        onBlur={() => {
                          const newPrice = pricingData[service.id]?.[size] || 0;
                          handleUpdatePricing(service.id, size, newPrice);
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum serviço cadastrado ainda.</p>
          <p className="text-sm">Clique em "Novo Serviço" para começar.</p>
        </div>
      )}
    </div>
  );
}
