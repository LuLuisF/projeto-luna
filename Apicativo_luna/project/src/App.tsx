import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import VectorCalculator from './components/VectorCalculator';
import PlaneCalculator from './components/PlaneCalculator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/vector-calculator" element={<VectorCalculator />} />
        <Route path="/plane-calculator" element={<PlaneCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;