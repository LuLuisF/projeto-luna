import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, Box } from 'lucide-react';

function Menu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Calculadora Matemática Avançada
          </h1>
          <p className="text-lg text-gray-600">
            Explore diferentes cálculos e visualizações matemáticas
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/vector-calculator')}
            className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Calculator className="w-8 h-8 text-blue-500" />
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Duas Retas
            </h2>
            <p className="text-gray-600">
              Calcule produtos vetoriais, analise características e visualize vetores em 2D e 3D
            </p>
          </button>

          <button
            onClick={() => navigate('/plane-calculator')}
            className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Box className="w-8 h-8 text-purple-500" />
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Equação do Plano
            </h2>
            <p className="text-gray-600">
              Determine a equação do plano a partir de um ponto e vetor normal
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;