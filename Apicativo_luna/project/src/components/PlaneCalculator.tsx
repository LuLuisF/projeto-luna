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

  const calculate = () => {
    // Normalizar o vetor normal
    const magnitude = Math.sqrt(
      normal.x * normal.x + normal.y * normal.y + normal.z * normal.z
    );
    
    const normalizedNormal = {
      x: normal.x / magnitude,
      y: normal.y / magnitude,
      z: normal.z / magnitude
    };

    // Calcular D da equação do plano ax + by + cz + d = 0
    const d = -(
      normalizedNormal.x * point.x +
      normalizedNormal.y * point.y +
      normalizedNormal.z * point.z
    );

    // Características do plano
    const characteristics = [];
    
    if (Math.abs(normalizedNormal.z) === 1) {
      characteristics.push("O plano é paralelo ao plano XY");
    } else if (normalizedNormal.z === 0) {
      characteristics.push("O plano é perpendicular ao plano XY");
    }

    if (Math.abs(normalizedNormal.y) === 1) {
      characteristics.push("O plano é paralelo ao plano XZ");
    } else if (normalizedNormal.y === 0) {
      characteristics.push("O plano é perpendicular ao plano XZ");
    }

    if (Math.abs(normalizedNormal.x) === 1) {
      characteristics.push("O plano é paralelo ao plano YZ");
    } else if (normalizedNormal.x === 0) {
      characteristics.push("O plano é perpendicular ao plano YZ");
    }

    // Gerar pontos para visualização do plano
    const [a, b, c] = [normalizedNormal.x, normalizedNormal.y, normalizedNormal.z];
    
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

    setResult(`
      <h2>Equação do Plano</h2>
      <p class="text-lg font-semibold mb-3">
        ${normalizedNormal.x.toFixed(2)}x + ${normalizedNormal.y.toFixed(2)}y + ${normalizedNormal.z.toFixed(2)}z + ${d.toFixed(2)} = 0
      </p>

      <h3>Características do Plano:</h3>
      <ul class="mb-4">
        ${characteristics.map(c => `<li>${c}</li>`).join('')}
      </ul>

      <h3>Passo a Passo:</h3>
      <pre>
1. Ponto P = (${point.x}, ${point.y}, ${point.z})
2. Vetor Normal n = <${normal.x}, ${normal.y}, ${normal.z}>

3. Normalização do vetor:
   |n| = √(${normal.x}² + ${normal.y}² + ${normal.z}²) = ${magnitude.toFixed(2)}
   n_normalizado = <${normalizedNormal.x.toFixed(2)}, ${normalizedNormal.y.toFixed(2)}, ${normalizedNormal.z.toFixed(2)}>

4. Equação do plano: ax + by + cz + d = 0
   onde (a, b, c) é o vetor normal normalizado

5. Substituindo o ponto P:
   ${normalizedNormal.x.toFixed(2)}(${point.x}) + ${normalizedNormal.y.toFixed(2)}(${point.y}) + ${normalizedNormal.z.toFixed(2)}(${point.z}) + d = 0

6. Resolvendo para d:
   d = -(${normalizedNormal.x.toFixed(2)}(${point.x}) + ${normalizedNormal.y.toFixed(2)}(${point.y}) + ${normalizedNormal.z.toFixed(2)}(${point.z}))
   d = ${d.toFixed(2)}

7. Equação final do plano:
   ${normalizedNormal.x.toFixed(2)}x + ${normalizedNormal.y.toFixed(2)}y + ${normalizedNormal.z.toFixed(2)}z + ${d.toFixed(2)} = 0
      </pre>
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
        x: [point.x, point.x + normalizedNormal.x * 2],
        y: [point.y, point.y + normalizedNormal.y * 2],
        z: [point.z, point.z + normalizedNormal.z * 2],
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
        colorscale: 'Viridis'
      }
    ];

    const layout3D = {
      margin: { t: 0 },
      scene: {
        xaxis: { title: 'X', range: xRange },
        yaxis: { title: 'Y', range: yRange },
        zaxis: { title: 'Z', range: [-10, 10] },
        camera: {
          eye: { x: 1.5, y: 1.5, z: 1.5 }
        }
      },
      showlegend: true
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
        x: [point.x, point.x + normalizedNormal.x * 2],
        y: [point.y, point.y + normalizedNormal.y * 2],
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
    calculate();
  }, [point, normal]);

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPoint(prev => ({
      ...prev,
      [name.replace('p', '')]: parseFloat(value) || 0
    }));
  };

  const handleNormalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNormal(prev => ({
      ...prev,
      [name.replace('n', '')]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar ao Menu
      </button>

      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Calculadora de Plano</h1>
        <p className="text-gray-600">Determine a equação do plano a partir de um ponto e vetor normal.</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Insira os dados</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Ponto P</h3>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">x</label>
                <input
                  type="number"
                  name="px"
                  value={point.x}
                  onChange={handlePointChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">y</label>
                <input
                  type="number"
                  name="py"
                  value={point.y}
                  onChange={handlePointChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">z</label>
                <input
                  type="number"
                  name="pz"
                  value={point.z}
                  onChange={handlePointChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Vetor Normal</h3>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">x</label>
                <input
                  type="number"
                  name="nx"
                  value={normal.x}
                  onChange={handleNormalChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">y</label>
                <input
                  type="number"
                  name="ny"
                  value={normal.y}
                  onChange={handleNormalChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">z</label>
                <input
                  type="number"
                  name="nz"
                  value={normal.z}
                  onChange={handleNormalChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div dangerouslySetInnerHTML={{ __html: result }} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Gráfico 3D</h2>
            <div ref={graph3DRef} style={{ width: '100%', height: '400px' }} />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Gráfico 2D (projeção XY)</h2>
            <div ref={graph2DRef} style={{ width: '100%', height: '400px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaneCalculator;