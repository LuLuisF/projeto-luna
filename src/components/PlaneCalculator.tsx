import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Plotly from 'plotly.js-dist';
import { ArrowLeft } from 'lucide-react';

function PlaneCalculator() {
  const navigate = useNavigate();
  const [point, setPoint] = useState({ x: 1, y: 1, z: 1 });
  const [normal, setNormal] = useState({ x: 0, y: 0, z: 1 });
  const [result, setResult] = useState<string>('');
  const graph3DRef = useRef<HTMLDivElement>(null);
  const graph2DRef = useRef<HTMLDivElement>(null);

  const calculate = (parsedPoint = point, parsedNormal = normal) => {
    // Calcular D da equação do plano ax + by + cz + d = 0
    const d = -(
      parsedNormal.x * parsedPoint.x +
      parsedNormal.y * parsedPoint.y +
      parsedNormal.z * parsedPoint.z
    );

    // Características do plano
    const characteristics = [];
    
    if (Math.abs(parsedNormal.z) === 1) {
      characteristics.push("O plano é paralelo ao plano XY");
    } else if (parsedNormal.z === 0) {
      characteristics.push("O plano é perpendicular ao plano XY");
    }

    if (Math.abs(parsedNormal.y) === 1) {
      characteristics.push("O plano é paralelo ao plano XZ");
    } else if (parsedNormal.y === 0) {
      characteristics.push("O plano é perpendicular ao plano XZ");
    }

    if (Math.abs(parsedNormal.x) === 1) {
      characteristics.push("O plano é paralelo ao plano YZ");
    } else if (parsedNormal.x === 0) {
      characteristics.push("O plano é perpendicular ao plano YZ");
    }

    // Gerar pontos para visualização do plano
    const [a, b, c] = [parsedNormal.x, parsedNormal.y, parsedNormal.z];
    
    const xRange = [-10, 10];
    const yRange = [-10, 10];
    const gridSize = 50;
    
    const x = [];
    const y = [];
    const z = [];
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const xi = xRange[0] + (xRange[1] - xRange[0]) * i / (gridSize - 1);
        const yi = yRange[0] + (yRange[1] - yRange[0]) * j / (gridSize - 1);
        const zi = (-d - a * xi - b * yi) / c;
        
        x.push(xi);
        y.push(yi);
        z.push(zi);
      }
    }

    // Verifica se o vetor normal é nulo
    const isNullNormal = parsedNormal.x === 0 && parsedNormal.y === 0 && parsedNormal.z === 0;

    let passoAPasso = '';
    if (isNullNormal) {
      passoAPasso = `1. Ponto P = (${point.x}, ${point.y}, ${point.z})\n2. Vetor normal n = <${normal.x}, ${normal.y}, ${normal.z}>\n3. Verificar se n = (0,0,0).\n   - Resultado: Não existe plano definido (vetor normal nulo).`;
    } else {
      passoAPasso = `1. Ponto P = (${point.x}, ${point.y}, ${point.z})\n2. Vetor normal n = <${normal.x}, ${normal.y}, ${normal.z}>\n3. Verificar se n = (0,0,0).\n   - Se sim: Não existe plano definido (vetor normal nulo).\n   - Se não: Prosseguir.\n4. Calcular d = -(${normal.x}*${point.x} + ${normal.y}*${point.y} + ${normal.z}*${point.z})\n   d = ${d}\n5. Equação final do plano:\n   ${normal.x}x + ${normal.y}y + ${normal.z}z + ${d} = 0`;
    }

    setResult(`
      <h2>Equação do Plano</h2>
      <p class="text-lg font-semibold mb-3">
        ${isNullNormal ? 'Não existe plano definido (vetor normal nulo)' : `${parsedNormal.x}x + ${parsedNormal.y}y + ${parsedNormal.z}z + ${d} = 0`}
      </p>

      <h3>Características do Plano:</h3>
      <ul class="mb-4">
        ${isNullNormal ? '<li>Não há características: plano não existe.</li>' : characteristics.map(c => `<li>${c}</li>`).join('')}
      </ul>

      <h3>Passo a Passo:</h3>
      <pre>${passoAPasso}</pre>
    `);

    // Plotagem 3D
    const data3D = [
      {
        type: 'scatter3d',
        mode: 'markers',
        name: 'Ponto P',
        x: [point.x],
        y: [point.y],
        z: [point.z],
        marker: {
          size: 8,
          color: 'red'
        }
      },
      {
        type: 'scatter3d',
        mode: 'lines',
        name: 'Vetor Normal',
        x: [point.x, point.x + parsedNormal.x * 2],
        y: [point.y, point.y + parsedNormal.y * 2],
        z: [point.z, point.z + parsedNormal.z * 2],
        line: {
          width: 6,
          color: 'blue'
        }
      },
      {
        type: 'surface',
        name: 'Plano',
        x: x,
        y: y,
        z: z,
        opacity: 0.7,
        colorscale: 'Viridis',
        showscale: false // Remove a barra lateral (colorbar)
      }
    ];

    const layout3D = {
      margin: { t: 0, l: 0, r: 0, b: 0 },
      scene: {
        xaxis: {
          title: 'X',
          range: xRange,
          showgrid: true, // Ativa o grid
          gridcolor: '#cccccc', // Cor do grid
          zeroline: true,
          zerolinecolor: '#888'
        },
        yaxis: {
          title: 'Y',
          range: yRange,
          showgrid: true, // Ativa o grid
          gridcolor: '#cccccc',
          zeroline: true,
          zerolinecolor: '#888'
        },
        zaxis: {
          title: 'Z',
          range: [-10, 10],
          showgrid: true, // Ativa o grid
          gridcolor: '#cccccc',
          zeroline: true,
          zerolinecolor: '#888'
        },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.5 }
        }
      },
      showlegend: true,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      autosize: true,
      responsive: true
    };

    // Plotagem 2D (projeção XY)
    const data2D = [
      {
        type: 'scatter',
        mode: 'markers+text',
        name: 'Ponto P (projeção)',
        x: [point.x],
        y: [point.y],
        text: ['P'],
        textposition: 'top center',
        marker: { size: 10, color: 'red' }
      },
      {
        type: 'scatter',
        mode: 'lines+text',
        name: 'Vetor Normal (projeção)',
        x: [point.x, point.x + parsedNormal.x * 2],
        y: [point.y, point.y + parsedNormal.y * 2],
        text: ['', 'n'],
        textposition: 'top center',
        line: { width: 3, color: 'blue' }
      }
    ];

    const layout2D = {
      title: 'Projeção no Plano XY',
      xaxis: { title: 'X', range: xRange },
      yaxis: { title: 'Y', range: yRange },
      showlegend: true
    };

    if (graph3DRef.current && graph2DRef.current) {
      Plotly.newPlot(graph3DRef.current, data3D, layout3D);
      Plotly.newPlot(graph2DRef.current, data2D, layout2D);
    }
  };

  useEffect(() => {
    const parsedPoint = {
      x: parseFloat(point.x as any) || 0,
      y: parseFloat(point.y as any) || 0,
      z: parseFloat(point.z as any) || 0,
    };
    const parsedNormal = {
      x: parseFloat(normal.x as any) || 0,
      y: parseFloat(normal.y as any) || 0,
      z: parseFloat(normal.z as any) || 0,
    };
    // Chama o cálculo com os valores convertidos
    calculate(parsedPoint, parsedNormal);
    // eslint-disable-next-line
  }, [point, normal]);

  // Permitir valores negativos e strings temporárias nos inputs
  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPoint(prev => ({
      ...prev,
      [name.replace('p', '')]: value // mantém como string temporariamente
    }));
  };

  const handleNormalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNormal(prev => ({
      ...prev,
      [name.replace('n', '')]: value // mantém como string temporariamente
    }));
  };

  // Gera o passo a passo do cálculo para o fluxograma didático
  function getFluxogramaSteps() {
    // Garante que os valores são strings para parseFloat
    const px = point.x.toString();
    const py = point.y.toString();
    const pz = point.z.toString();
    const nx = normal.x.toString();
    const ny = normal.y.toString();
    const nz = normal.z.toString();
    const magnitude = Math.sqrt(
      parseFloat(nx) * parseFloat(nx) +
      parseFloat(ny) * parseFloat(ny) +
      parseFloat(nz) * parseFloat(nz)
    );
    const normalizedNormal = {
      x: parseFloat(nx) / magnitude,
      y: parseFloat(ny) / magnitude,
      z: parseFloat(nz) / magnitude
    };
    const d = -(
      normalizedNormal.x * parseFloat(px) +
      normalizedNormal.y * parseFloat(py) +
      normalizedNormal.z * parseFloat(pz)
    );
    return [
      {
        title: '1. Ponto P',
        desc: `P = (${px}, ${py}, ${pz})`
      },
      {
        title: '2. Vetor Normal',
        desc: `n = <${nx}, ${ny}, ${nz}>`
      },
      {
        title: '3. Normalização do vetor',
        desc: `|n| = √(${nx}² + ${ny}² + ${nz}²) = ${magnitude.toFixed(2)}\nn_normalizado = <${normalizedNormal.x.toFixed(2)}, ${normalizedNormal.y.toFixed(2)}, ${normalizedNormal.z.toFixed(2)}>`
      },
      {
        title: '4. Equação do plano',
        desc: `ax + by + cz + d = 0\n(a, b, c) = vetor normal normalizado`
      },
      {
        title: '5. Substituindo o ponto P',
        desc: `${normalizedNormal.x.toFixed(2)}(${px}) + ${normalizedNormal.y.toFixed(2)}(${py}) + ${normalizedNormal.z.toFixed(2)}(${pz}) + d = 0`
      },
      {
        title: '6. Resolvendo para d',
        desc: `d = -(${normalizedNormal.x.toFixed(2)}(${px}) + ${normalizedNormal.y.toFixed(2)}(${py}) + ${normalizedNormal.z.toFixed(2)}(${pz}))\nd = ${d.toFixed(2)}`
      },
      {
        title: '7. Equação final do plano',
        desc: `${normalizedNormal.x.toFixed(2)}x + ${normalizedNormal.y.toFixed(2)}y + ${normalizedNormal.z.toFixed(2)}z + ${d.toFixed(2)} = 0`
      }
    ];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e9fa] to-[#e6e6fa] flex flex-col justify-center items-center p-2 sm:p-4 md:p-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center text-gray-500 hover:text-blue-600 transition-colors text-base sm:text-lg"
        style={{background: 'none', border: 'none', boxShadow: 'none'}}>
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar ao Menu
      </button>

      <header className="text-center mb-6">
        <h1 className="text-2xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-2 tracking-tight">Calculadora de Plano</h1>
        <p className="text-gray-500 text-base sm:text-lg">Determine a equação do plano a partir de um ponto e vetor normal.</p>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 flex flex-col gap-4 animate-fade-in">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Insira os dados</h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Ponto P</h3>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">x</label>
                <input type="number" name="px" value={point.x} onChange={handlePointChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">y</label>
                <input type="number" name="py" value={point.y} onChange={handlePointChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">z</label>
                <input type="number" name="pz" value={point.z} onChange={handlePointChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Vetor Normal</h3>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">x</label>
                <input type="number" name="nx" value={normal.x} onChange={handleNormalChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">y</label>
                <input type="number" name="ny" value={normal.y} onChange={handleNormalChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">z</label>
                <input type="number" name="nz" value={normal.z} onChange={handleNormalChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 sm:p-4 mb-4 overflow-x-auto">
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </div>
        </div>
        <div className="space-y-4 md:space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 animate-fade-in">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Gráfico 3D</h2>
            <div ref={graph3DRef} className="graph3d" style={{ width: '100%', height: '250px', minWidth: 0, maxWidth: '100vw', margin: '0 auto' }} />
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-4 animate-fade-in">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Gráfico 2D (projeção XY)</h2>
            <div ref={graph2DRef} className="graph2d" style={{ width: '100%', height: '250px', minWidth: 0, maxWidth: '100vw', margin: '0 auto' }} />
          </div>
        </div>
      </div>
      {/* Cartão de fluxograma visual - apenas modo dev, design melhorado */}
      {window.localStorage.getItem('isDevMode') === 'true' && (
        <div className="plane-flowchart-card rounded-2xl shadow-lg p-4 sm:p-6 mt-6 w-full max-w-4xl animate-fade-in relative overflow-x-auto" style={{background:'#fff'}}>
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#8A05BE] text-center">Fluxograma do Processo</h2>
          <div className="plane-flowchart flex flex-col items-center w-full relative" style={{minHeight: 600}}>
            {/* Início */}
            <div className="plane-flowchart-box">Início</div>
            <div className="plane-flowchart-arrow" />
            {/* Ponto P */}
            <div className="plane-flowchart-box">Obter Ponto P do Usuário</div>
            <div className="plane-flowchart-arrow" />
            {/* Vetor Normal */}
            <div className="plane-flowchart-box">Obter Vetor Normal n do Usuário</div>
            <div className="plane-flowchart-arrow" />
            {/* Decisão Vetor nulo? */}
            <div className="plane-flowchart-diamond"><span>Vetor nulo?</span></div>
            {/* Ramificação Sim/Não visual */}
            <div style={{display:'flex', width:'100%', justifyContent:'center', alignItems:'flex-start', margin:'0.5rem 0'}}>
              {/* Não (continua o cálculo) */}
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', minWidth:180}}>
                <div className="plane-flowchart-arrow" style={{marginTop:0}} />
                <span className="plane-flowchart-label" style={{color:'#8A05BE', marginBottom:'-0.5rem'}}>Não</span>
                <div className="plane-flowchart-box">Calcular o valor de 'd'</div>
                <div className="plane-flowchart-arrow" />
                <div className="plane-flowchart-box">Montar a Equação Geral do Plano: ax + by + cz + d = 0</div>
                <div className="plane-flowchart-arrow" />
                <div className="plane-flowchart-box">Exibir a Equação do Plano</div>
                <div className="plane-flowchart-arrow" />
                <div className="plane-flowchart-box">Fim</div>
              </div>
              {/* Espaço entre ramificações */}
              <div style={{width:40}} />
              {/* Sim (erro) */}
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', minWidth:180}}>
                <div className="plane-flowchart-arrow" style={{marginTop:0}} />
                <span className="plane-flowchart-label" style={{color:'#d32f2f', marginBottom:'-0.5rem'}}>Sim</span>
                <div className="plane-flowchart-box plane-flowchart-error" style={{background:'#fff',color:'#d32f2f',borderColor:'#d32f2f'}}>Erro: Vetor Normal Nulo</div>
                <div className="plane-flowchart-arrow" />
                <div className="plane-flowchart-box">Fim</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaneCalculator;