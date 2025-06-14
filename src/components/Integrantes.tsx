import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const nomes = [
  'BRENDA DE JESUS SILVA GONCALVES',
  'MARILYA THUANE DE PAIVA SANTANA SALES',
  'LUIS CESAR SERRA PENHA FILHO',
  'LUCAS COUTINHO RIBEIRO',
];

export default function Integrantes() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e9fa] to-[#e6e6fa] flex flex-col items-center justify-center p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center text-gray-500 hover:text-blue-600 transition-colors text-base sm:text-lg"
        style={{background: 'none', border: 'none', boxShadow: 'none'}}>
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </button>
      <h1 className="text-2xl md:text-3xl font-bold text-[#8A05BE] mb-8 text-center">Integrantes</h1>
      <div className="flex flex-col gap-6 w-full max-w-md">
        {nomes.map((nome) => (
          <div
            key={nome}
            className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-center text-center text-lg font-semibold text-[#8A05BE] animate-fade-in transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
          >
            {nome}
          </div>
        ))}
      </div>
    </div>
  );
}
