import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, Box, User } from 'lucide-react';

function Menu() {
  const navigate = useNavigate();
  const [isDevMode, setIsDevMode] = useState(() => {
    // Recuperar o estado do modo dev do localStorage
    const savedState = localStorage.getItem('isDevMode');
    return savedState === 'true';
  });
  const [showDevPrompt, setShowDevPrompt] = useState(false);
  const [devInput, setDevInput] = useState('');

  const toggleDevMode = () => {
    const newState = !isDevMode;
    setIsDevMode(newState);
    localStorage.setItem('isDevMode', newState.toString()); // Salvar no localStorage
    console.log(`Modo Dev ${newState ? 'ativado' : 'desativado'}`);
  };

  const handleDevClick = () => {
    if (!isDevMode) {
      setShowDevPrompt(true);
    } else {
      toggleDevMode();
    }
  };

  const handleDevSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (devInput === ';senha') {
      toggleDevMode();
      setShowDevPrompt(false);
      setDevInput('');
    } else {
      setDevInput('');
      alert('Senha incorreta!');
    }
  };

  useEffect(() => {
    console.log(`Modo Dev está ${isDevMode ? 'ativado' : 'desativado'}`);
  }, [isDevMode]);

  // Adicionando uma classe condicional para alterar o tema com base no modo dev
  useEffect(() => {
    const root = document.documentElement;
    if (isDevMode) {
      root.style.setProperty('--primary-color', '#FF5733'); // Laranja
      root.style.setProperty('--secondary-color', '#FFC300'); // Amarelo
    } else {
      root.style.setProperty('--primary-color', '#8A05BE'); // Roxo
      root.style.setProperty('--secondary-color', '#B5179E'); // Rosa
    }
  }, [isDevMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e9fa] to-[#e6e6fa] flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative">
      {/* Interruptor do modo dev no topo direito */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <span className="text-xs text-[#8A05BE] font-semibold">Dev</span>
        <button
          onClick={handleDevClick}
          aria-label="Alternar modo dev"
          className={`w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${isDevMode ? 'bg-[#FF5733]' : 'bg-gray-300'}`}
          style={{ minWidth: 40 }}
        >
          <span
            className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${isDevMode ? 'translate-x-5' : 'translate-x-0'}`}
            style={{ minWidth: 20 }}
          />
        </button>
      </div>
      {showDevPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleDevSubmit} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4 min-w-[260px]">
            <label className="text-[#8A05BE] font-semibold text-center">Digite a senha para ativar o modo desenvolvedor:</label>
            <input
              type="password"
              value={devInput}
              onChange={e => setDevInput(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8A05BE]"
              autoFocus
            />
            <div className="flex gap-2 justify-center">
              <button type="submit" className="bg-[#8A05BE] text-white px-4 py-1 rounded-md font-semibold hover:bg-[#B5179E] transition">Entrar</button>
              <button type="button" onClick={() => { setShowDevPrompt(false); setDevInput(''); }} className="bg-gray-200 text-gray-700 px-4 py-1 rounded-md font-semibold hover:bg-gray-300 transition">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className="w-full max-w-3xl mx-auto">
        <header className="text-center mb-10 md:mb-16">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2 text-[#8A05BE] font-sans">
            Calculadora Matemática Avançada
          </h1>
          <p className="text-base md:text-lg text-[#6B7280] font-medium">
            Explore diferentes cálculos e visualizações matemáticas
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/vector-calculator')}
            className="group bg-white p-6 min-h-[170px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#8A05BE] relative animate-fade-in"
            aria-label="Ir para calculadora de duas retas"
          >
            <div className="flex items-center justify-between mb-3">
              <Calculator className="w-8 h-8 text-[#8A05BE]" aria-hidden="true" />
              <ArrowRight className="w-6 h-6 text-[#B5179E] group-hover:text-[#8A05BE] transition-colors duration-300" aria-hidden="true" />
            </div>
            <h2 className="text-base md:text-lg font-semibold text-[#8A05BE] mb-1">
              Duas Retas
            </h2>
            <p className="text-xs md:text-sm text-[#6B7280] leading-tight">
              Calcule produtos vetoriais, analise características e visualize vetores em 2D e 3D
            </p>
          </button>

          <button
            onClick={() => navigate('/plane-calculator')}
            className="group bg-white p-6 min-h-[170px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#8A05BE] relative animate-fade-in"
            aria-label="Ir para calculadora de equação do plano"
          >
            <div className="flex items-center justify-between mb-3">
              <Box className="w-8 h-8 text-[#B5179E]" aria-hidden="true" />
              <ArrowRight className="w-6 h-6 text-[#8A05BE] group-hover:text-[#B5179E] transition-colors duration-300" aria-hidden="true" />
            </div>
            <h2 className="text-base md:text-lg font-semibold text-[#8A05BE] mb-1">
              Equação do Plano
            </h2>
            <p className="text-xs md:text-sm text-[#6B7280] leading-tight">
              Determine a equação do plano a partir de um ponto e vetor normal
            </p>
          </button>

          <button
            onClick={() => navigate('/integrantes')}
            className="group bg-white p-6 min-h-[170px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#8A05BE] relative animate-fade-in"
            aria-label="Ir para tela de integrantes"
          >
            <div className="flex items-center justify-between mb-3">
              <User className="w-8 h-8 text-[#8A05BE]" aria-hidden="true" />
              <ArrowRight className="w-6 h-6 text-[#8A05BE] group-hover:text-[#B5179E] transition-colors duration-300" aria-hidden="true" />
            </div>
            <h2 className="text-base md:text-lg font-semibold text-[#8A05BE] mb-1">
              Integrantes
            </h2>
            <p className="text-xs md:text-sm text-[#6B7280] leading-tight">
              Veja quem desenvolveu este projeto
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Menu;