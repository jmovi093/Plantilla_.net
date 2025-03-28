import React from 'react';
import { Link } from 'react-router-dom';
import { Shipper } from '../interfaces/Shipper';
import { shipperService } from '../services/shipperService';
import { useObjects } from '../hooks/useObjects';

const ShipperList: React.FC = () => {
  const { 
    objects: shippers, 
    loading, 
    error, 
    deleteObject: handleDelete 
  } = useObjects<Shipper>(shipperService, {
    // Puedes personalizar opciones aquí si lo necesitas
    onError: (err) => {
      console.error('Error en la lista de transportistas', err);
    }
  });

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transportistas</h1>
      <Link 
        to="/shippers/create" 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Crear Nuevo
      </Link>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre de Empresa</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {shippers.map(shipper => (
            <tr key={shipper.shipperId} className="hover:bg-gray-100">
              <td className="border p-2">{shipper.shipperId}</td>
              <td className="border p-2">{shipper.companyName}</td>
              <td className="border p-2">{shipper.phone}</td>
              <td className="border p-2">
                <Link 
                  to={`/shippers/edit/${shipper.shipperId}`} 
                  className="text-blue-500 mr-2"
                >
                  Editar
                </Link>
                <Link 
                  to={`/shippers/details/${shipper.shipperId}`} 
                  className="text-green-500 mr-2"
                >
                  Detalles
                </Link>
                <button 
                  onClick={() => handleDelete(shipper.shipperId)}
                  className="text-red-500"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShipperList;