import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import EmpleadoList from './components/EmpleadoList';
import EmpleadoDetails from './pages/EmpleadoDetails';
import EmpleadoCreate from './pages/EmpleadoCreate';
import EmpleadoEdit from './pages/EmpleadoEdit';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/empleados" element={<EmpleadoList />} />
      <Route path="/empleados/details/:id" element={<EmpleadoDetails />} />
      <Route path="/empleados/create" element={<EmpleadoCreate />} />
      <Route path="/empleados/edit/:id" element={<EmpleadoEdit />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;