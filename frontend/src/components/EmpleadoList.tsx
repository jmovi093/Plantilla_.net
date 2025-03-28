import React from 'react';
import { Link } from 'react-router-dom';
import { Empleado } from '../interfaces/Empleado';
import { empleadoService } from '../services/EmpleadoService';
import { useObjects } from '../hooks/useObjects';
import Swal from 'sweetalert2';

// Importamos iconos de v2 (outline)
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';

const EmpleadoList: React.FC = () => {
  const { 
    objects: empleados, 
    loading, 
    error, 
    deleteObject 
  } = useObjects<Empleado>(empleadoService, {
    transformId: (empleado) => empleado.empleadoId,
    onError: (err) => {
      console.error('Error en la lista de empleados', err);
    }
  });

  const handleDelete = (id: number, nombre: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al empleado ${nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteObject(id)
          .then(() => {
            Swal.fire(
              '¡Eliminado!',
              'El empleado ha sido eliminado correctamente.',
              'success'
            );
          })
          .catch((err) => {
            Swal.fire(
              'Error',
              'Ocurrió un error al eliminar el empleado.',
              'error'
            );
            console.error('Error al eliminar:', err);
          });
      }
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center w-full h-32">
      <div className="p-6 text-xl font-semibold text-gray-700">Cargando...</div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl p-6 mx-auto mt-4 text-lg font-medium text-center text-red-600 bg-red-100 rounded-lg">
      {error}
    </div>
  );

  return (
    <div className="container max-w-6xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Empleados</h1>
        <Link 
          to="/empleados/create" 
          className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Crear Nuevo
        </Link>
      </div>
      
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nombre</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Salario</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {empleados.map(empleado => (
              <tr key={empleado.empleadoId} className="transition-colors duration-150 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{empleado.empleadoId}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{empleado.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">${empleado.salario.toFixed(2)}</td>
                <td className="px-6 py-4 space-x-2 text-sm font-medium text-right whitespace-nowrap">
                  <Link 
                    to={`/empleados/details/${empleado.empleadoId}`} 
                    className="inline-flex items-center p-2 text-blue-600 transition-colors duration-150 bg-blue-100 rounded-md hover:bg-blue-200"
                    title="Ver detalles"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                  <Link 
                    to={`/empleados/edit/${empleado.empleadoId}`} 
                    className="inline-flex items-center p-2 text-green-600 transition-colors duration-150 bg-green-100 rounded-md hover:bg-green-200"
                    title="Editar"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(empleado.empleadoId, empleado.nombre)}
                    className="inline-flex items-center p-2 text-red-600 transition-colors duration-150 bg-red-100 rounded-md hover:bg-red-200"
                    title="Eliminar"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {empleados.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No hay empleados registrados.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmpleadoList;