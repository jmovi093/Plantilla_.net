import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import DepartmentsPage from './pages/DepartmentsPage';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './layouts/MainLayout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas sin layout (pantalla completa) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rutas con layout (navegación + footer) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          </MainLayout>
        }
      />
      <Route path="/departments" element={
        <MainLayout>
          <PrivateRoute>
            <DepartmentsPage />
          </PrivateRoute>
        </MainLayout>
      }
      />
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;