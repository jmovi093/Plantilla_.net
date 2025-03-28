import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shipper } from '../interfaces/Shipper';
import { shipperService } from '../services/shipperService';
import { useObjectDetails } from '../hooks/useObjects';

const ShipperDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    object: shipper, 
    loading, 
    error 
  } = useObjectDetails<Shipper>(shipperService, id ? parseInt(id) : undefined);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!shipper) return <div>No se encontró el transportista</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalles del Transportista</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ID del Transportista
          </label>
          <p className="text-gray-900">{shipper.shipperId}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nombre de la Empresa
          </label>
          <p className="text-gray-900">{shipper.companyName}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Teléfono
          </label>
          <p className="text-gray-900">{shipper.phone}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Link 
          to={`/shippers/edit/${shipper.shipperId}`} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Editar
        </Link>
        <Link 
          to="/shippers" 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver a la Lista
        </Link>
      </div>
    </div>
  );
};

export default ShipperDetails;