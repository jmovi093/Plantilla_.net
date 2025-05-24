// services/base.service.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class BaseService<T> {
  protected http: AxiosInstance;
  protected endpoint: string;

  constructor(endpoint: string, baseURL: string = import.meta.env.VITE_API_URL) {
    this.endpoint = endpoint;
    this.http = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': '12345' // Agregamos la ApiKey aquí también
      }
    });

    // Interceptor para agregar el token a las requests
    this.http.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de autorización
    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          // Redireccionar al login si es necesario
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async getAll(): Promise<T[]> {
    const response = await this.http.get<T[]>(this.endpoint);
    return response.data;
  }

  async getById(id: number | string): Promise<T> {
    const formattedId = this.formatId(id);
    const response = await this.http.get<T>(`${this.endpoint}/${formattedId}`);
    return response.data;
  }

  async create(data: T): Promise<T> {
    const response = await this.http.post<T>(this.endpoint, data);
    return response.data;
  }

  async update(id: number | string, data: T): Promise<T> {
    const response = await this.http.put<T>(this.endpoint, data);
    return response.data;
  }

  async delete(id: number | string): Promise<void> {
    const formattedId = this.formatId(id);
    await this.http.delete(`${this.endpoint}/${formattedId}`);
  }

  async testConnection(): Promise<any> {
    const response = await this.http.get(`${this.endpoint}/test`);
    return response.data;
  }

  protected formatId(id: number | string): string {
    if (typeof id === 'number') {
      return id.toString();
    }
    
    if (typeof id === 'string') {
      if (id.length >= 6) {
        return id;
      }
      return id.padEnd(6, ' ');
    }
    
    return String(id);
  }
}