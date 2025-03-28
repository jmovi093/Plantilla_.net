import { BaseService } from './base.service';
import { Shipper } from '../interfaces/Shipper';

class ShipperService extends BaseService<Shipper> {
  constructor() {
    super('/Shipper'); // Matches original endpoint
  }

  // Add original testConnection
  async testConnection(): Promise<any> {
    try {
      const response = await this.http.get('/Shipper');
      console.log('Conexión exitosa:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error de conexión:', error);
      throw error;
    }
  }
}

export const shipperService = new ShipperService();