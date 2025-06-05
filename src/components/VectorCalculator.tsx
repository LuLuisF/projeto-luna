import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Plotly from 'plotly.js-dist';
import { ArrowLeft } from 'lucide-react';
import { Rnd } from 'react-rnd';

function VectorCalculator() {
  const navigate = useNavigate();
  const [vectors, setVectors] = useState({
    ux: 1, uy: 0, uz: 0,
    vx: 0, vy: 1, vz: 0
  });
  const [result, setResult] = useState<string>('');
  const [draggable, setDraggable] = useState(false); // Toggle para layout post-it
  const graph3DRef = useRef<HTMLDivElement>(null);
  const graph2DRef = useRef<HTMLDivElement>(null);

  // Estados para tamanho dos gráficos no modo post-it
  const [size3D, setSize3D] = useState({ width: 420, height: 220 });
  const [size2D, setSize2D] = useState({ width: 420, height: 220 });

  // Novo estado para os inputs como string
  const [vectorInputs, setVectorInputs] = useState({
    ux: '1', uy: '0', uz: '0',
    vx: '0', vy: '1', vz: '0'
  });

  const calculate = () => {
    const { ux, uy, uz, vx, vy, vz } = vectors;

    // Produto vetorial
    const cx = uy * vz - uz * vy;
    const cy = uz * vx - ux * vz;
    const cz = ux * vy - uy * vx;

    // Produto escalar
    const produtoEscalar = ux * vx + uy * vy + uz * vz;

    // Magnitudes dos vetores
    const magU = Math.sqrt(ux * ux + uy * uy + uz * uz);
    const magV = Math.sqrt(vx * vx + vy * vy + vz * vz);
    const magProdVetorial = Math.sqrt(cx * cx + cy * cy + cz * cz);

    // Ângulo entre os vetores
    const angulo = Math.acos(produtoEscalar / (magU * magV));
    const anguloGraus = (angulo * 180 / Math.PI).toFixed(2);

    // Análise das características
    const caracteristicas = [];
    
    // Verificar se são paralelos
    const saoParalelos = magProdVetorial < 0.000001;
    if (saoParalelos) {
      caracteristicas.push("Os vetores são paralelos");
    }

    // Verificar se são ortogonais
    const saoOrtogonais = Math.abs(produtoEscalar) < 0.000001;
    if (saoOrtogonais) {
      caracteristicas.push("Os vetores são ortogonais (perpendiculares)");
    }

    caracteristicas.push("Os vetores são coplanares (estão no mesmo plano)");

    // Verificar se são concorrentes
    const saoConcorrentes = !saoParalelos && magU > 0 && magV > 0;
    if (saoConcorrentes) {
      caracteristicas.push("Os vetores são concorrentes (se intersectam em um ponto)");
    }

    const areaParalelogramo = magProdVetorial;
    const areaTriangulo = areaParalelogramo / 2;

    setResult(`
      <h2>Resultado</h2>
      <p><strong>Produto Vetorial (u × v):</strong> (${cx.toFixed(2)}, ${cy.toFixed(2)}, ${cz.toFixed(2)})</p>
      <p><strong>Produto Escalar (u · v):</strong> ${produtoEscalar.toFixed(2)}</p>
      <p><strong>Ângulo entre os vetores:</strong> ${anguloGraus}°</p>
      
      <h3>Características dos Vetores:</h3>
      <ul>
        ${caracteristicas.map(c => `<li>${c}</li>`).join('')}
      </ul>
      
      <h3>Passo a Passo:</h3>
      <pre>
u = (${ux}, ${uy}, ${uz})
v = (${vx}, ${vy}, ${vz})

u × v = (uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx)
      = (${uy} * ${vz} - ${uz} * ${vy}, ${uz} * ${vx} - ${ux} * ${vz}, ${ux} * ${vy} - ${uy} * ${vx})
      = (${cx.toFixed(2)}, ${cy.toFixed(2)}, ${cz.toFixed(2)})

u · v = ux * vx + uy * vy + uz * vz
      = ${ux} * ${vx} + ${uy} * ${vy} + ${uz} * ${vz}
      = ${produtoEscalar.toFixed(2)}

Magnitude de u = √(ux² + uy² + uz²) = ${magU.toFixed(2)}
Magnitude de v = √(vx² + vy² + vz²) = ${magV.toFixed(2)}

Ângulo = arccos((u · v) / (|u| * |v|))
       = arccos(${produtoEscalar.toFixed(2)} / (${magU.toFixed(2)} * ${magV.toFixed(2)}))
       = ${anguloGraus}°

Área do Paralelogramo = |u × v| = ${areaParalelogramo.toFixed(2)}
Área do Triângulo = |u × v|/2 = ${areaTriangulo.toFixed(2)}
      </pre>
    `);

    const AB = [ux + vx, uy + vy, uz + vz];

    // Gráfico 3D
    const data3D = [
      {
        type: 'scatter3d',
        mode: 'lines',
        name: 'Vetor u',
        line: { width: 6 },
        x: [0, ux],
        y: [0, uy],
        z: [0, uz]
      },
      {
        type: 'scatter3d',
        mode: 'lines',
        name: 'Vetor v',
        line: { width: 6 },
        x: [0, vx],
        y: [0, vy],
        z: [0, vz]
      },
      {
        type: 'scatter3d',
        mode: 'lines',
        name: 'u × v (Normal)',
        line: { width: 4, dash: 'dot' },
        x: [0, cx],
        y: [0, cy],
        z: [0, cz]
      },
      {
        type: 'mesh3d',
        name: 'Paralelogramo',
        opacity: 0.4,
        color: 'orange',
        x: [0, ux, AB[0], vx],
        y: [0, uy, AB[1], vy],
        z: [0, uz, AB[2], vz],
        i: [0, 1, 2, 0],
        j: [1, 2, 3, 3],
        k: [2, 3, 0, 1]
      }
    ];

    const layout3D = {
      margin: { t: 0 },
      scene: {
        xaxis: { title: 'X' },
        yaxis: { title: 'Y' },
        zaxis: { title: 'Z' }
      },
      showlegend: true
    };

    // Gráfico 2D
    const data2D = [
      {
        type: 'scatter',
        mode: 'lines+markers+text',
        name: 'Vetor u (2D)',
        x: [0, ux],
        y: [0, uy],
        marker: { size: 6 },
        line: { width: 4 },
        text: ['O', 'u'],
        textposition: 'top center'
      },
      {
        type: 'scatter',
        mode: 'lines+markers+text',
        name: 'Vetor v (2D)',
        x: [0, vx],
        y: [0, vy],
        marker: { size: 6 },
        line: { width: 4 },
        text: ['O', 'v'],
        textposition: 'top center'
      },
      {
        type: 'scatter',
        mode: 'lines',
        name: 'Paralelogramo (2D)',
        fill: 'toself',
        fillcolor: 'rgba(255,165,0,0.3)',
        line: { width: 1 },
        x: [0, ux, AB[0], vx, 0],
        y: [0, uy, AB[1], vy, 0],
        showlegend: true
      }
    ];

    const layout2D = {
      title: 'Projeção no Plano XY',
      xaxis: { title: 'X', zeroline: true },
      yaxis: { title: 'Y', zeroline: true },
      showlegend: true
    };

    if (graph3DRef.current && graph2DRef.current) {
      Plotly.newPlot(graph3DRef.current, data3D, layout3D);
      Plotly.newPlot(graph2DRef.current, data2D, layout2D);
    }
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line
  }, [vectors, draggable]);

  // Atualiza os inputs e converte para número ao atualizar vectors
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Permite string vazia ou número válido
    if (/^-?\d*\.?\d*$/.test(value) || value === '') {
      setVectorInputs(prev => ({ ...prev, [name]: value }));
      setVectors(prev => ({ ...prev, [name]: value === '' ? 0 : parseFloat(value) }));
    }
  };

  // Atualiza gráficos ao redimensionar
  useEffect(() => {
    if (draggable && graph3DRef.current) {
      Plotly.Plots.resize(graph3DRef.current);
    }
  }, [size3D.width, size3D.height, draggable]);
  useEffect(() => {
    if (draggable && graph2DRef.current) {
      Plotly.Plots.resize(graph2DRef.current);
    }
  }, [size2D.width, size2D.height, draggable]);

  // Renderização condicional dos cartões
  const renderCards = () => {
    if (!draggable) {
      // Layout clássico
      return (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in min-h-[180px] flex flex-col justify-between">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#8A05BE]">Insira os vetores</h2>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Vetor u</h3>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">x</label>
                    <input
                      type="number"
                      name="ux"
                      value={vectorInputs.ux}
                      onChange={handleInputChange}
                      className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">y</label>
                    <input
                      type="number"
                      name="uy"
                      value={vectorInputs.uy}
                      onChange={handleInputChange}
                      className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">z</label>
                    <input
                      type="number"
                      name="uz"
                      value={vectorInputs.uz}
                      onChange={handleInputChange}
                      className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Vetor v</h3>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">x</label>
                    <input
                      type="number"
                      name="vx"
                      value={vectorInputs.vx}
                      onChange={handleInputChange}
                      className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">y</label>
                    <input
                      type="number"
                      name="vy"
                      value={vectorInputs.vy}
                      onChange={handleInputChange}
                      className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">z</label>
                    <input
                      type="number"
                      name="vz"
                      value={vectorInputs.vz}
                      onChange={handleInputChange}
                      className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl shadow-lg p-6 animate-fade-in flex-1 min-h-[220px] md:min-h-[320px] xl:min-h-[420px] max-h-[600px] overflow-y-auto">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#8A05BE]">Passo a Passo</h2>
              <div className="w-full" style={{wordBreak: 'break-word'}}>
                <div dangerouslySetInnerHTML={{ __html: result }} />
              </div>
            </div>
          </div>
          <div className="space-y-6 md:space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#8A05BE]">Gráfico 3D</h2>
              <div ref={graph3DRef} className="graph3d" style={{ width: '100%', height: '300px', minWidth: 0, maxWidth: '100vw', margin: '0 auto' }} />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
              <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#8A05BE]">Gráfico 2D (projeção XY)</h2>
              <div ref={graph2DRef} className="graph2d" style={{ width: '100%', height: '300px', minWidth: 0, maxWidth: '100vw', margin: '0 auto' }} />
            </div>
          </div>
        </div>
      );
    }
    // Layout post-it (draggable)
    return (
      <>
        {/* Cartão de entrada dos vetores */}
        <Rnd
          default={{ x: 40, y: 120, width: 340, height: 260 }}
          minWidth={260}
          minHeight={180}
          bounds="parent"
          className="bg-white rounded-2xl shadow-2xl p-6 animate-fade-in flex flex-col justify-between select-none border-2 border-[#e0c3f7]"
          dragHandleClassName="drag-handle"
          style={{zIndex: 10, position: 'absolute'}}
        >
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-[#8A05BE] drag-handle" style={{cursor:'grab'}}>Insira os vetores</h2>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Vetor u</h3>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">x</label>
                <input
                  type="number"
                  name="ux"
                  value={vectorInputs.ux}
                  onChange={handleInputChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">y</label>
                <input
                  type="number"
                  name="uy"
                  value={vectorInputs.uy}
                  onChange={handleInputChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">z</label>
                <input
                  type="number"
                  name="uz"
                  value={vectorInputs.uz}
                  onChange={handleInputChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Vetor v</h3>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">x</label>
                <input
                  type="number"
                  name="vx"
                  value={vectorInputs.vx}
                  onChange={handleInputChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">y</label>
                <input
                  type="number"
                  name="vy"
                  value={vectorInputs.vy}
                  onChange={handleInputChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">z</label>
                <input
                  type="number"
                  name="vz"
                  value={vectorInputs.vz}
                  onChange={handleInputChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </Rnd>
        {/* Cartão Passo a Passo */}
        <Rnd
          default={{ x: 40, y: 400, width: 380, height: 340 }}
          minWidth={260}
          minHeight={220 }
          bounds="parent"
          className="bg-gray-50 rounded-2xl shadow-2xl p-0 animate-fade-in flex flex-col max-h-[600px] overflow-hidden select-none border-2 border-[#e0c3f7]"
          dragHandleClassName="drag-handle"
          style={{zIndex: 11, position: 'absolute'}}
          enableResizing={{ top:false, right:true, bottom:true, left:true, topRight:true, bottomRight:true, bottomLeft:true, topLeft:true }}
        >
          <div className="p-6 pb-2 drag-handle" style={{cursor:'grab', userSelect:'none'}}>
            <h2 className="text-lg md:text-xl font-semibold mb-0 text-[#8A05BE]">Passo a Passo</h2>
          </div>
          <div className="w-full h-full overflow-y-auto p-6 pt-2" style={{wordBreak: 'break-word', pointerEvents: 'auto'}}>
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </div>
        </Rnd>
        {/* Cartão Gráfico 3D */}
        <Rnd
          default={{ x: 500, y: 120, width: 420, height: 320 }}
          minWidth={260}
          minHeight={220}
          bounds="parent"
          className="bg-white rounded-2xl shadow-2xl p-0 animate-fade-in flex flex-col select-none border-2 border-[#e0c3f7]"
          dragHandleClassName="drag-handle"
          style={{zIndex: 12, position: 'absolute'}}
          size={{ width: size3D.width, height: size3D.height + 100 }}
          onResize={(_, __, ref) => {
            setSize3D({ width: ref.offsetWidth, height: ref.offsetHeight - 100 });
          }}
        >
          <div className="p-6 pb-2 drag-handle" style={{cursor:'grab', userSelect:'none'}}>
            <h2 className="text-lg md:text-xl font-semibold mb-0 text-[#8A05BE]">Gráfico 3D</h2>
          </div>
          <div className="w-full h-full p-6 pt-2" style={{height: size3D.height}}>
            <div ref={graph3DRef} className="graph3d" style={{ width: '100%', height: size3D.height, minWidth: 0, maxWidth: '100vw', margin: '0 auto' }} />
          </div>
        </Rnd>
        {/* Cartão Gráfico 2D */}
        <Rnd
          default={{ x: 500, y: 480, width: 420, height: 320 }}
          minWidth={260}
          minHeight={220}
          bounds="parent"
          className="bg-white rounded-2xl shadow-2xl p-0 animate-fade-in flex flex-col select-none border-2 border-[#e0c3f7]"
          dragHandleClassName="drag-handle"
          style={{zIndex: 13, position: 'absolute'}}
          size={{ width: size2D.width, height: size2D.height + 100 }}
          onResize={(_, __, ref) => {
            setSize2D({ width: ref.offsetWidth, height: ref.offsetHeight - 100 });
          }}
        >
          <div className="p-6 pb-2 drag-handle" style={{cursor:'grab', userSelect:'none'}}>
            <h2 className="text-lg md:text-xl font-semibold mb-0 text-[#8A05BE]">Gráfico 2D (projeção XY)</h2>
          </div>
          <div className="w-full h-full p-6 pt-2" style={{height: size2D.height}}>
            <div ref={graph2DRef} className="graph2d" style={{ width: '100%', height: size2D.height, minWidth: 0, maxWidth: '100vw', margin: '0 auto' }} />
          </div>
        </Rnd>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e9fa] to-[#e6e6fa] flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 relative">
      {/* Interruptor do modo post-it no topo direito */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <span className="text-xs text-[#8A05BE] font-semibold">Post-it</span>
        <button
          onClick={() => setDraggable(!draggable)}
          aria-label="Alternar modo post-it"
          className={`w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${draggable ? 'bg-[#FF5733]' : 'bg-gray-300'}`}
          style={{ minWidth: 40 }}
        >
          <span
            className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${draggable ? 'translate-x-5' : 'translate-x-0'}`}
            style={{ minWidth: 20 }}
          />
        </button>
      </div>
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center text-[#8A05BE] hover:text-[#B5179E] transition-colors text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#8A05BE] bg-transparent border-none shadow-none z-50"
        aria-label="Voltar ao Menu"
        style={{position: 'fixed', top: 16, left: 16}}
      >
        <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
        Voltar ao Menu
      </button>
      <header className="text-center mb-8 w-full">
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-2 text-[#8A05BE] font-sans">Calculadora Vetorial Interativa</h1>
        <p className="text-base md:text-lg text-[#6B7280] font-medium">Entenda o cálculo vetorial e visualize o resultado em gráficos 2D e 3D.</p>
      </header>
      {renderCards()}
    </div>
  );
}

export default VectorCalculator;