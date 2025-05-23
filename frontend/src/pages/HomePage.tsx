import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cultureService } from '../services/CultureService';

const HomePage: React.FC = () => {
  const [connectionTest, setConnectionTest] = useState('Probando conexión...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        setLoading(true);
        const data = await cultureService.testConnection();
        setConnectionTest(`Conexión exitosa. Datos recibidos: ${data.length} registros`);
      } catch (error) {
        setConnectionTest('Error de conexión con la API');
      } finally {
        setLoading(false);
      }
    };

    testApiConnection();
  }, []);

  return (
    <div className="container p-6 mx-auto">
      <div className="max-w-4xl p-8 mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-center">
          Bienvenido a la Aplicación
        </h1>

        <p className="mb-8 text-center text-gray-600">
          Sistema de gestión integrado para administración de empleados y recursos.
        </p>

        <div className="p-4 mb-8 border-l-4 border-blue-500 rounded bg-blue-50">
          <div className="flex items-center">
            {loading ? (
              <div className="text-blue-700">
                <svg className="inline w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando conexión...
              </div>
            ) : (
              <div className="text-blue-700">
                {connectionTest}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <Link
            to="/empleados"
            className="flex items-center justify-center px-6 py-3 font-bold text-white transition-colors duration-200 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Gestionar Empleados
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 font-bold text-white transition-colors duration-200 bg-gray-500 rounded-lg hover:bg-gray-600"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Ver Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;