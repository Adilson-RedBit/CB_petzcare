export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🐾 PetCare Agenda - Área do Cliente
          </h1>
          <p className="text-lg text-gray-600">
            Agende serviços para o seu pet
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Serviços Disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">🐕 Banho e Tosa</h3>
                <p className="text-gray-600">Serviço completo de higiene para seu pet</p>
                <p className="text-blue-600 font-semibold mt-2">A partir de R$ 50,00</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">✂️ Tosa Higiênica</h3>
                <p className="text-gray-600">Tosa especializada para higiene</p>
                <p className="text-blue-600 font-semibold mt-2">A partir de R$ 30,00</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Agendar Serviço</h2>
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 mb-4">
                Funcionalidade em desenvolvimento
              </p>
              <p className="text-sm text-gray-400">
                Em breve você poderá agendar serviços diretamente aqui
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

