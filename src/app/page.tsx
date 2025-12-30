import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🐾 PetCare Agenda
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sistema de agendamento para banho e tosa de pets
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Bem-vindo!</h2>

          <div className="space-y-4">
            <Link
              href="/home"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              👤 Área do Cliente
            </Link>

            <Link
              href="/login"
              className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-center"
            >
              🔐 Área Profissional
            </Link>

            <Link
              href="/test"
              className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-center"
            >
              🧪 Página de Teste
            </Link>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Modo Desenvolvimento:</strong> Use admin@petcare.com / admin123 para login profissional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

