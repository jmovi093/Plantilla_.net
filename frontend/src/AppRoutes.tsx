import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';
import CultureList from './components/CultureList';
import CultureDetails from './pages/CultureDetails';
import CultureCreate from './pages/CultureCreate';
import CultureEdit from './pages/CultureEdit';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/cultures" element={<CultureList />} />
      <Route path="/cultures/details/:id" element={<CultureDetails />} />
      <Route path="/cultures/create" element={<CultureCreate />} />
      <Route path="/cultures/edit/:id" element={<CultureEdit />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;