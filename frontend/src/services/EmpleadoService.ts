import { BaseService } from './base.service';
import { Empleado } from '../interfaces/Empleado';

class EmpleadoService extends BaseService<Empleado> {
  constructor() {
    super('/Empleado'); // Endpoint para empleados
  }

  // Método para probar la conexión con el backend
  async testConnection(): Promise<any> {
    try {
      const response = await this.http.get('/Empleado');
      console.log('Conexión exitosa:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  }
}

export const empleadoService = new EmpleadoService();