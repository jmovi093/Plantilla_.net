import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class BaseService<T> {
  protected http: AxiosInstance;
  protected endpoint: string;

  constructor(endpoint: string, baseURL: string = import.meta.env.VITE_API_URL) {
    this.endpoint = endpoint;
    this.http = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getAll(): Promise<T[]> {
    const response = await this.http.get<T[]>(this.endpoint);
    return response.data;
  }

  async getById(id: number | string): Promise<T> {
    // Formatear el ID si es una cadena de texto (como códigos de país)
    const formattedId = this.formatId(id);
    const response = await this.http.get<T>(`${this.endpoint}/${formattedId}`);
    return response.data;
  }

  async create(data: T): Promise<T> {
    const response = await this.http.post<T>(this.endpoint, data);
    return response.data;
  }

  async update(id: number | string, data: T): Promise<T> {
    // Modificado: Usar el endpoint sin ID para PUT requests
    const response = await this.http.put<T>(this.endpoint, data);
    return response.data;
  }

  async delete(id: number | string): Promise<void> {
    // Formatear el ID si es una cadena de texto
    const formattedId = this.formatId(id);
    await this.http.delete(`${this.endpoint}/${formattedId}`);
  }

  async testConnection(): Promise<any> {
    const response = await this.http.get(`${this.endpoint}/test`);
    return response.data;
  }

  /**
   * Formatea el ID según las necesidades del API.
   * Si es un string, lo rellena con espacios hasta alcanzar 6 caracteres.
   * Esto es necesario porque el backend espera IDs con padding de espacios.
   */
  protected formatId(id: number | string): string {
    if (typeof id === 'number') {
      return id.toString();
    }
    
    // Para cualquier string, rellenar con espacios hasta llegar a 6 caracteres
    if (typeof id === 'string') {
      // Si el string es más largo que 6 caracteres, no hacemos padding
      if (id.length >= 6) {
        return id;
      }
      // Si no, rellenamos con espacios hasta 6 caracteres
      return id.padEnd(6, ' ');
    }
    
    // En caso de que id no sea ni number ni string (lo cual no debería ocurrir por el tipo del parámetro)
    // pero TypeScript no puede inferir esto automáticamente
    return String(id);
  }
}