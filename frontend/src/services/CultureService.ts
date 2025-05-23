import { BaseService } from './base.service';
import { Culture } from '../interfaces/Culture';

class CultureServiceClass extends BaseService<Culture> {
  constructor() {
    super('/Culture');
  }
  
  // Si necesitas sobreescribir algún método específico para Culture, puedes hacerlo aquí
  async getById(id: string | number): Promise<Culture> {
    // Asegurarse de que el ID esté correctamente formateado y codificado
    const formattedId = this.formatId(id);
    const encodedId = encodeURIComponent(formattedId);
    const response = await this.http.get<Culture>(`${this.endpoint}/${encodedId}`);
    return response.data;
  }
  
  // Igualmente para delete si lo necesitas
  async delete(id: string | number): Promise<void> {
    const formattedId = this.formatId(id);
    const encodedId = encodeURIComponent(formattedId);
    await this.http.delete(`${this.endpoint}/${encodedId}`);
  }
}

export const cultureService = new CultureServiceClass();