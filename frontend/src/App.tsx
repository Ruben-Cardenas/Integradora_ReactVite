import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuSlider from './components/ModuloMenu/MenuSlider';

// Importa los módulos


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* El menú será la interfaz principal para todas las rutas */}
        <Route path="*" element={<MenuSlider />} />
      </Routes>
    </Router>
  );
};

export default App;
