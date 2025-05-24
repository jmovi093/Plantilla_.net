// services/auth.service.ts
import axios, { AxiosInstance } from 'axios';
import { 
  LoginRequestDTO, 
  LoginResponseDTO, 
  RegisterDTO, 
  UserData, 
  TokenInfo 
} from '../interfaces/auth.interfaces';

export class AuthService {
  private http: AxiosInstance;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'https://localhost:7206') {
    this.http = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
        'ApiKey': '12345'
      }
    });
  }

  async login(credentials: LoginRequestDTO): Promise<UserData> {
    try {
      const response = await this.http.post<LoginResponseDTO>('/api/Auth/login', credentials);
      
      console.log('Respuesta completa del backend:', response.data);
      
      // Extraer el token string del objeto token
      const tokenString = response.data.token.token;
      const tokenExpiration = new Date(response.data.token.expiration);
      
      // Crear datos del usuario limpios
      const userData: UserData = {
        userName: response.data.userName,
        roles: response.data.roles,
        tokenExpiration: tokenExpiration
      };
      
      // Guardar token y datos por separado
      this.saveToken(tokenString);
      this.saveUserData(userData);
      
      console.log('Token guardado:', tokenString);
      console.log('Datos de usuario guardados:', userData);
      
      return userData;
    } catch (error) {
      console.error('Error en login:', error);
      this.logout();
      throw error;
    }
  }

  async register(userData: RegisterDTO): Promise<void> {
    await this.http.post('/api/Auth/register', userData);
  }

  logout(): void {
    this.removeToken();
    this.removeUserData();
  }

  // Métodos para manejar el token (solo el string)
  saveToken(token: string): void {
    try {
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error saving token to localStorage:', error);
    }
  }

  getToken(): string | null {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error getting token from localStorage:', error);
      return null;
    }
  }

  removeToken(): void {
    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error removing token from localStorage:', error);
    }
  }

  // Métodos para manejar datos del usuario (limpios)
  saveUserData(userData: UserData): void {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  }

  getUserData(): UserData | null {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      // Convertir la fecha de string a Date object
      if (parsed.tokenExpiration) {
        parsed.tokenExpiration = new Date(parsed.tokenExpiration);
      }
      return parsed;
    } catch (error) {
      console.error('Error getting user data from localStorage:', error);
      return null;
    }
  }

  removeUserData(): void {
    try {
      localStorage.removeItem('userData');
    } catch (error) {
      console.error('Error removing user data from localStorage:', error);
    }
  }

  // Verificaciones de autenticación
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const userData = this.getUserData();
    if (!userData) return false;

    // Verificar si el token no está expirado usando la fecha guardada
    const currentTime = new Date();
    if (userData.tokenExpiration && currentTime > userData.tokenExpiration) {
      console.log('Token expirado, limpiando datos');
      this.logout();
      return false;
    }

    return true;
  }

  // Obtener roles del usuario actual
  getUserRoles(): string[] {
    const userData = this.getUserData();
    return userData?.roles || [];
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  // Obtener nombre del usuario actual
  getUserName(): string | null {
    const userData = this.getUserData();
    return userData?.userName || null;
  }

  // Verificar cuándo expira el token
  getTokenExpirationTime(): Date | null {
    const userData = this.getUserData();
    return userData?.tokenExpiration || null;
  }

  // Verificar si el token expira pronto (útil para refresh)
  isTokenExpiringSoon(minutesBefore: number = 5): boolean {
    const expirationTime = this.getTokenExpirationTime();
    if (!expirationTime) return false;

    const currentTime = new Date();
    const timeDifference = expirationTime.getTime() - currentTime.getTime();
    const minutesUntilExpiration = timeDifference / (1000 * 60);

    return minutesUntilExpiration <= minutesBefore;
  }
}