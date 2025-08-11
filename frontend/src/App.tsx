import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/ModuloLogin/Login';
import Register from './components/ModuloRegister/Register';
import MenuSlider from './components/ModuloMenu/MenuSlider';

import Dashboard from './components/ModuloDashboard/Dashboard';
import Resident from './components/ModuloResident/Resident';
import Users from './components/ModuloUsers/Users';
import Settings from './components/ModuloSettings/Setting';
import Irrigation from './components/ModuloIrrigation/Irrigation';
import Reservacion from './components/ModuloReservacion/Reservacion';

import ProtectedRoute from './components/ModuloProtectedRoute/ProtectedRoute'; // ✅ Asegúrate de que esta ruta sea correcta

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <MenuSlider />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="resident" element={<Resident />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="irrigation" element={<Irrigation />} />
          <Route path="reservacion" element={<Reservacion />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
