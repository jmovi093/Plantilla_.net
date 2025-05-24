// pages/DepartmentsPage.tsx
import React, { useState } from 'react';
import { useDepartments } from '../hooks/useDepartments';
import { DepartmentDTO, CreateDepartmentDTO, UpdateDepartmentDTO } from '../interfaces/department.interfaces';

const DepartmentsPage: React.FC = () => {
  const { 
    departments, 
    loading, 
    error: apiError, 
    createDepartment, 
    updateDepartment, 
    deleteDepartment 
  } = useDepartments();

  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  interface FormData {
    departmentId?: number;
    name: string;
    budget: number;
    startDate: string;
    administrator?: number | null;
  }

  const [formData, setFormData] = useState<FormData>({
    departmentId: undefined,
    name: '',
    budget: 0,
    startDate: new Date().toISOString().split('T')[0],
    administrator: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos
    
    // Validar que el departmentId esté presente para crear
    if (!editingDepartment && !formData.departmentId) {
      setError('El ID del departamento es requerido');
      return;
    }
    
    let success = false;
    if (editingDepartment) {
      const updateData: UpdateDepartmentDTO = {
        departmentId: editingDepartment.departmentId,
        name: formData.name,
        budget: formData.budget,
        startDate: formData.startDate,
        administrator: formData.administrator
      };
      success = await updateDepartment(updateData);
    } else {
      // Para crear, construimos el objeto con el tipo correcto
      const createData: CreateDepartmentDTO = {
        departmentId: formData.departmentId!,
        name: formData.name,
        budget: formData.budget,
        startDate: formData.startDate,
        administrator: formData.administrator
      };
      success = await createDepartment(createData);
    }

    if (success) {
      resetForm();
      setShowModal(false);
    }
  };

  const handleEdit = (department: DepartmentDTO) => {
    setEditingDepartment(department);
    setFormData({
      departmentId: department.departmentId,
      name: department.name,
      budget: department.budget,
      startDate: department.startDate.split('T')[0],
      administrator: department.administrator
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
      await deleteDepartment(id);
    }
  };

  const resetForm = () => {
    const newFormData: FormData = {
      departmentId: undefined,
      name: '',
      budget: 0,
      startDate: new Date().toISOString().split('T')[0],
      administrator: null
    };
    setFormData(newFormData);
    setEditingDepartment(null);
    setError(null); // Limpiar errores
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading && departments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando departamentos...</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Departamentos</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Nuevo Departamento
        </button>
      </div>

      {(error || apiError) && (
        <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          {error || apiError}
        </div>
      )}

      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Presupuesto
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Fecha Inicio
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Administrador
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((department) => (
              <tr key={department.departmentId} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                  {department.departmentId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {department.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatCurrency(department.budget)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {formatDate(department.startDate)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {department.administrator || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(department)}
                    className="mr-4 text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(department.departmentId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {departments.length === 0 && !loading && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No hay departamentos registrados</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
          <div className="relative p-5 mx-auto bg-white border rounded-md shadow-lg top-20 w-96">
            <div className="mt-3">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {editingDepartment ? 'Editar Departamento' : 'Nuevo Departamento'}
              </h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    ID del Departamento
                  </label>
                  <input
                    type="number"
                    value={formData.departmentId || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      departmentId: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!editingDepartment}
                    disabled={!!editingDepartment}
                    placeholder="Ej: 5"
                  />
                  {editingDepartment && (
                    <p className="mt-1 text-xs text-gray-500">
                      El ID no se puede modificar al editar
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Presupuesto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Administrador (ID)
                  </label>
                  <input
                    type="number"
                    value={formData.administrator || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      administrator: e.target.value ? parseInt(e.target.value) : null 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Opcional"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Guardando...' : editingDepartment ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;