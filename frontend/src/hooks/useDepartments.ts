// hooks/useDepartments.ts
import { useState, useEffect } from 'react';
import { DepartmentService } from '../services/department.service';
import { DepartmentDTO, CreateDepartmentDTO, UpdateDepartmentDTO } from '../interfaces/department.interfaces';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const departmentService = new DepartmentService();

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError('Error al cargar los departamentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (department: CreateDepartmentDTO): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const newDepartment = await departmentService.create(department);
      setDepartments(prev => [...prev, newDepartment]);
      return true;
    } catch (err) {
      setError('Error al crear el departamento');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (department: UpdateDepartmentDTO): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const updatedDepartment = await departmentService.update(department.departmentId, department);
      setDepartments(prev => 
        prev.map(dept => 
          dept.departmentId === updatedDepartment.departmentId ? updatedDepartment : dept
        )
      );
      return true;
    } catch (err) {
      setError('Error al actualizar el departamento');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await departmentService.delete(id);
      setDepartments(prev => prev.filter(dept => dept.departmentId !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el departamento');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
  };
};