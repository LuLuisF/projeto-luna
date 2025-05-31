import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Plotly from 'plotly.js-dist';
import { ArrowLeft } from 'lucide-react';

function VectorCalculator() {
  const navigate = useNavigate();
  const [vectors, setVectors] = useState({
    ux: 1, uy: 0, uz: 0,
    vx: 0, vy: 1, vz: 0
  });
  const [result, setResult] = useState<string>('');
  const graph3DRef = useRef<HTMLDivElement>(null);
  const graph2DRef = useRef<HTMLDivElement>(null);

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
  }, [vectors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVectors(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Calculadora Vetorial Interativa</h1>
        <p className="text-gray-600">Entenda o cálculo vetorial e visualize o resultado em gráficos 2D e 3D.</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Insira os vetores</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Vetor u</h3>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">x</label>
                <input
                  type="number"
                  name="ux"
                  value={vectors.ux}
                  onChange={handleInputChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">y</label>
                <input
                  type="number"
                  name="uy"
                  value={vectors.uy}
                  onChange={handleInputChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">z</label>
                <input
                  type="number"
                  name="uz"
                  value={vectors.uz}
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
                  value={vectors.vx}
                  onChange={handleInputChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">y</label>
                <input
                  type="number"
                  name="vy"
                  value={vectors.vy}
                  onChange={handleInputChange}
                  className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">z</label>
                <input
                  type="number"
                  name="vz"
                  value={vectors.vz}
                  onChange={handleInputChange}
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

export default VectorCalculator;