import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Página No Encontrada</h1>
      <p className="mb-6">Lo sentimos, la página que buscas no existe.</p>
      <Link 
        to="/" 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Volver al Inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;