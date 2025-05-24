// services/department.service.ts
import { BaseService } from './base.service';
import { DepartmentDTO, CreateDepartmentDTO, UpdateDepartmentDTO } from '../interfaces/department.interfaces';

export class DepartmentService extends BaseService<DepartmentDTO> {
  constructor() {
    super('/api/Department');
  }

  async getAll(): Promise<DepartmentDTO[]> {
    try {
      return await super.getAll();
    } catch (error) {
      console.error('Error getting departments:', error);
      throw error;
    }
  }

  async getById(id: number): Promise<DepartmentDTO> {
    try {
      return await super.getById(id);
    } catch (error) {
      console.error(`Error getting department ${id}:`, error);
      throw error;
    }
  }

  async create(department: CreateDepartmentDTO): Promise<DepartmentDTO> {
    try {
      return await super.create(department as any);
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }

  async update(id: string | number, department: UpdateDepartmentDTO): Promise<DepartmentDTO> {
    try {
      return await super.update(id, department as any);
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await super.delete(id);
    } catch (error) {
      console.error(`Error deleting department ${id}:`, error);
      throw error;
    }
  }
}