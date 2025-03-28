// src/services/base.service.ts
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

  async getById(id: number): Promise<T> {
    const response = await this.http.get<T>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: T): Promise<T> {
    const response = await this.http.post<T>(this.endpoint, data);
    return response.data;
  }

  async update(id: number, data: T): Promise<T> {
    const response = await this.http.put<T>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.http.delete(`${this.endpoint}/${id}`);
  }

  async testConnection(): Promise<any> {
    const response = await this.http.get(`${this.endpoint}/test`);
    return response.data;
  }
}