import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Empleado } from '../interfaces/Empleado';
import { empleadoService } from '../services/EmpleadoService';
import { useObjectDetails } from '../hooks/useObjects';

const EmpleadoDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { object: empleado, loading, error } = useObjectDetails<Empleado>(empleadoService, id ? parseInt(id) : undefined);

    if (loading) return (
        <div className="flex items-center justify-center h-screen text-xl text-gray-600">Cargando...</div>
    );
    if (error) return (
        <div className="max-w-2xl p-4 mx-auto mt-10 text-center text-red-600 bg-red-100 rounded-lg">{error}</div>
    );
    if (!empleado) return (
        <div className="max-w-2xl p-4 mx-auto mt-10 text-center text-gray-600 bg-gray-100 rounded-lg">No se encontró el empleado</div>
    );

    return (
        <div className="container max-w-2xl p-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Detalles del Empleado</h1>
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">ID del Empleado</label>
                    <p className="text-lg text-gray-900">{empleado.empleadoId}</p>
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Nombre</label>
                    <p className="text-lg text-gray-900">{empleado.nombre}</p>
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Salario</label>
                    <p className="text-lg text-gray-900">${empleado.salario.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex items-center justify-between mt-6">
                <Link
                    to={`/empleados/edit/${empleado.empleadoId}`}
                    className="px-6 py-2 font-semibold text-white transition duration-150 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Editar
                </Link>
                <Link
                    to="/empleados"
                    className="px-6 py-2 font-semibold text-white transition duration-150 bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Volver a la Lista
                </Link>
            </div>
        </div>
    );
};

export default EmpleadoDetails;