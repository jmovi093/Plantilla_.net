import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { shipperService } from '../services/shipperService';

const HomePage: React.FC = () => {
  const [connectionTest, setConnectionTest] = useState('Probando conexión...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        setLoading(true);
        const data = await shipperService.testConnection();
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
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
          Bienvenido a la Aplicación
        </h1>
        
        <div className="mb-8 text-lg text-gray-600">
          <p>Sistema de gestión integrado para administración de transportistas y recursos.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-center">
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500 mr-3"></div>
                <span>Verificando conexión...</span>
              </div>
            ) : (
              <div className={`text-lg ${connectionTest.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {connectionTest}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/shippers" 
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Gestionar Transportistas
          </Link>
          
          <Link 
            to="/dashboard" 
            className="px-8 py-3 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Ver Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;