import { Service } from '@/shared/types';
import { Clock, DollarSign, Check } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onSelect: (service: Service) => void;
  multiSelect?: boolean;
}

export default function ServiceCard({ service, selected, onSelect, multiSelect = false }: ServiceCardProps) {
  return (
    <div
      className={`
        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
        ${selected 
          ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100' 
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
        }
      `}
      onClick={() => onSelect(service)}
    >
      {multiSelect && selected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
          <Check className="h-4 w-4" />
        </div>
      )}
      
      <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
      
      {service.description && (
        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
      )}
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1 text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{service.duration_minutes}min</span>
        </div>
        
        <div className="flex items-center space-x-1 text-green-600 font-semibold">
          <DollarSign className="h-4 w-4" />
          <span>R$ {service.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
