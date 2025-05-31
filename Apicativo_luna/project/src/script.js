function calcular() {
  const ux = parseFloat(document.getElementById("ux").value);
  const uy = parseFloat(document.getElementById("uy").value);
  const uz = parseFloat(document.getElementById("uz").value);
  const vx = parseFloat(document.getElementById("vx").value);
  const vy = parseFloat(document.getElementById("vy").value);
  const vz = parseFloat(document.getElementById("vz").value);

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

  // Ângulo entre os vetores (em radianos)
  const angulo = Math.acos(produtoEscalar / (magU * magV));
  const anguloGraus = (angulo * 180 / Math.PI).toFixed(2);

  // Análise das características dos vetores
  let caracteristicas = [];

  // Verificar se são paralelos
  const saoParalelos = magProdVetorial < 0.000001;
  if (saoParalelos) {
    caracteristicas.push("Os vetores são paralelos");
  }

  // Verificar se são ortogonais (perpendiculares)
  const saoOrtogonais = Math.abs(produtoEscalar) < 0.000001;
  if (saoOrtogonais) {
    caracteristicas.push("Os vetores são ortogonais (perpendiculares)");
  }

  // Verificar se são coplanares
  // Dois vetores são sempre coplanares
  caracteristicas.push("Os vetores são coplanares (estão no mesmo plano)");

  // Verificar se são concorrentes
  const saoConcorrentes = !saoParalelos && magU > 0 && magV > 0;
  if (saoConcorrentes) {
    caracteristicas.push("Os vetores são concorrentes (se intersectam em um ponto)");
  }

  const areaParalelogramo = magProdVetorial;
  const areaTriangulo = areaParalelogramo / 2;

  document.getElementById("resultado").innerHTML = `
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
  `;

  const AB = [ux + vx, uy + vy, uz + vz];

  const vetorU = {
    type: 'scatter3d',
    mode: 'lines',
    name: 'Vetor u',
    line: { width: 6 },
    x: [0, ux],
    y: [0, uy],
    z: [0, uz]
  };

  const vetorV = {
    type: 'scatter3d',
    mode: 'lines',
    name: 'Vetor v',
    line: { width: 6 },
    x: [0, vx],
    y: [0, vy],
    z: [0, vz]
  };

  const vetorNormal = {
    type: 'scatter3d',
    mode: 'lines',
    name: 'u × v (Normal)',
    line: { width: 4, dash: 'dot' },
    x: [0, cx],
    y: [0, cy],
    z: [0, cz]
  };

  const paralelogramo = {
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
  };

  const layout3D = {
    margin: { t: 0 },
    scene: {
      xaxis: { title: 'X' },
      yaxis: { title: 'Y' },
      zaxis: { title: 'Z' }
    },
    showlegend: true
  };

  Plotly.newPlot('grafico', [vetorU, vetorV, vetorNormal, paralelogramo], layout3D);

  const vetorU2D = {
    type: 'scatter',
    mode: 'lines+markers+text',
    name: 'Vetor u (2D)',
    x: [0, ux],
    y: [0, uy],
    marker: { size: 6 },
    line: { width: 4 },
    text: ['O', 'u'],
    textposition: 'top center'
  };

  const vetorV2D = {
    type: 'scatter',
    mode: 'lines+markers+text',
    name: 'Vetor v (2D)',
    x: [0, vx],
    y: [0, vy],
    marker: { size: 6 },
    line: { width: 4 },
    text: ['O', 'v'],
    textposition: 'top center'
  };

  const paralelogramo2D = {
    type: 'scatter',
    mode: 'lines',
    name: 'Paralelogramo (2D)',
    fill: 'toself',
    fillcolor: 'rgba(255,165,0,0.3)',
    line: { width: 1 },
    x: [0, ux, AB[0], vx, 0],
    y: [0, uy, AB[1], vy, 0],
    showlegend: true
  };

  const layout2D = {
    title: 'Projeção no Plano XY',
    xaxis: { title: 'X', zeroline: true },
    yaxis: { title: 'Y', zeroline: true },
    showlegend: true
  };

  Plotly.newPlot('grafico2d', [paralelogramo2D, vetorU2D, vetorV2D], layout2D);
}