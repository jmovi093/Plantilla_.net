import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Empleado } from '../interfaces/Empleado';
import { empleadoService } from '../services/EmpleadoService';
import { useObjectDetails, useObjectForm } from '../hooks/useObjects';
import Swal from 'sweetalert2';

const EmpleadoEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { object: empleado, loading, error, updateObject } = useObjectDetails<Empleado>(empleadoService, id);
    const { formData, setFormData, handleInputChange, resetError } = useObjectForm<Empleado>({
        empleadoId: 0,
        nombre: '',
        salario: 0
    });
    const [saving, setSaving] = React.useState<boolean>(false);

    useEffect(() => {
        if (empleado) setFormData(empleado);
    }, [empleado, setFormData]);

    const handleSalarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleInputChange({ target: { name, value: parseFloat(value) || 0 } } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetError();

        const result = await Swal.fire({
            title: '¿Confirmar cambios?',
            text: `¿Deseas guardar los cambios para ${formData.nombre}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            setSaving(true);
            try {
                if (!formData.nombre?.trim()) throw new Error('El nombre es requerido');
                if (!formData.salario || formData.salario <= 0) throw new Error('El salario debe ser positivo');

                if (id) {
                    await updateObject(formData as Empleado);
                    Swal.fire('¡Guardado!', 'El empleado ha sido actualizado.', 'success');
                    navigate('/empleados');
                }
            } catch (err) {
                Swal.fire('Error', (err as Error).message || 'Error al actualizar el empleado.', 'error');
                console.error('Error al actualizar empleado:', err);
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen text-xl text-gray-600">Cargando...</div>;
    if (error && !empleado) return <div className="max-w-2xl p-4 mx-auto mt-10 text-center text-red-600 bg-red-100 rounded-lg">{error}</div>;
    if (!empleado && !loading) return <div className="max-w-2xl p-4 mx-auto mt-10 text-center text-gray-600 bg-gray-100 rounded-lg">No se encontró el empleado</div>;

    return (
        <div className="container max-w-2xl p-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Editar Empleado</h1>
            {error && <div className="p-4 mb-6 text-white bg-red-600 rounded-lg shadow">{error}</div>}

            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">ID del Empleado</label>
                    <input
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none"
                        type="text"
                        value={formData.empleadoId || ''}
                        disabled
                    />
                </div>

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
                        disabled={saving}
                    >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
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

export default EmpleadoEdit;