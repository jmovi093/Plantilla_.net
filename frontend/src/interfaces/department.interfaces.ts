// interfaces/department.interfaces.ts
export interface DepartmentDTO {
  departmentId: number;
  name: string;
  budget: number;
  startDate: string; // ISO string format
  administrator?: number | null;
}

export interface CreateDepartmentDTO {
  departmentId: number; // Ahora requerido para crear
  name: string;
  budget: number;
  startDate: string;
  administrator?: number | null;
}

export interface UpdateDepartmentDTO extends CreateDepartmentDTO {
  departmentId: number;
}