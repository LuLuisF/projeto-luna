import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';

const VectorCalculator = React.lazy(() => import('./components/VectorCalculator'));
const PlaneCalculator = React.lazy(() => import('./components/PlaneCalculator'));
const Integrantes = React.lazy(() => import('./components/Integrantes'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/vector-calculator" element={<VectorCalculator />} />
          <Route path="/plane-calculator" element={<PlaneCalculator />} />
          <Route path="/integrantes" element={<Integrantes />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;