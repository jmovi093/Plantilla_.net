import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Empleado } from '../interfaces/Empleado';
import { empleadoService } from '../services/EmpleadoService';
import { useObjectForm } from '../hooks/useObjects';
import Swal from 'sweetalert2';

const EmpleadoCreate: React.FC = () => {
    const navigate = useNavigate();
    const { formData, handleInputChange, error, resetError } = useObjectForm<Empleado>({
        nombre: '',
        salario: 0
    });
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleInputChange({ target: { name, value: parseFloat(value) || 0 } } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetError();

        const result = await Swal.fire({
            title: '¿Crear empleado?',
            text: `¿Deseas crear al empleado ${formData.nombre}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, crear',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                if (!formData.nombre?.trim()) throw new Error('El nombre es requerido');
                if (!formData.salario || formData.salario <= 0) throw new Error('El salario debe ser positivo');

                await empleadoService.create(formData as Empleado);
                Swal.fire('¡Creado!', 'El empleado ha sido creado exitosamente.', 'success');
                navigate('/empleados');
            } catch (err) {
                Swal.fire('Error', (err as Error).message || 'Error al crear el empleado.', 'error');
                console.error('Error al crear empleado:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container max-w-2xl p-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Crear Nuevo Empleado</h1>
            {error && <div className="p-4 mb-6 text-white bg-red-600 rounded-lg shadow">{error}</div>}

            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="nombre">Nombre</label>
                    <input
                        className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="nombre"
                        type="text"
                        placeholder="Nombre del empleado"
                        name="nombre"
                        value={formData.nombre || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="salario">Salario</label>
                    <input
                        className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="salario"
                        type="number"
                        placeholder="Salario del empleado"
                        name="salario"
                        value={formData.salario || 0}
                        onChange={handleSalarioChange}
                        step="0.01"
                        min="0"
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar Empleado'}
                    </button>
                    <Link
                        to="/empleados"
                        className="px-6 py-2 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EmpleadoCreate;