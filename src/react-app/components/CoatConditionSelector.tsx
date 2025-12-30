import { Sparkles, Star, AlertTriangle, AlertCircle } from 'lucide-react';

interface CoatConditionSelectorProps {
  value?: string;
  onChange: (condition: string, notes?: string) => void;
}

const conditions = [
  {
    value: 'excelente',
    label: 'Excelente',
    description: 'Pelos limpos, bem cuidados, sem nós',
    icon: Sparkles,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    priceAdjustment: 'Valor padrão'
  },
  {
    value: 'bom',
    label: 'Bom',
    description: 'Pelos em boa condição, poucos nós',
    icon: Star,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    priceAdjustment: '+10%'
  },
  {
    value: 'regular',
    label: 'Regular',
    description: 'Alguns nós, precisa de cuidados extras',
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    priceAdjustment: '+20%'
  },
  {
    value: 'ruim',
    label: 'Ruim',
    description: 'Muitos nós, pelos embaraçados',
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    priceAdjustment: '+30%'
  }
];

export default function CoatConditionSelector({ value, onChange }: CoatConditionSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">
        Condição dos Pelos
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {conditions.map((condition) => (
          <div
            key={condition.value}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${value === condition.value 
                ? `${condition.border} ${condition.bg} shadow-md` 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
            onClick={() => onChange(condition.value)}
          >
            <div className="flex items-start space-x-3">
              <div className={`${condition.bg} p-2 rounded-lg`}>
                <condition.icon className={`h-5 w-5 ${condition.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{condition.label}</h3>
                  <span className="text-xs font-medium text-gray-500">
                    {condition.priceAdjustment}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{condition.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {value && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observações sobre os pelos (opcional)
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Ex: Nós nas patas traseiras, pelos muito longos..."
            onChange={(e) => onChange(value, e.target.value)}
          />
        </div>
      )}
      
      <div className="text-xs text-gray-500 bg-amber-50 p-3 rounded-lg border border-amber-200">
        <p className="font-medium text-amber-700 mb-1">ℹ️ Como funciona a precificação:</p>
        <p>O valor final é calculado baseado no tamanho do pet e nas condições dos pelos. Condições mais difíceis requerem mais trabalho e tempo.</p>
      </div>
    </div>
  );
}
