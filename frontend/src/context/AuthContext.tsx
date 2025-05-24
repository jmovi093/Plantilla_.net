// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/auth.service';
import { LoginRequestDTO, RegisterDTO, UserData } from '../interfaces/auth.interfaces';

interface AuthUser {
  userName: string;
  roles: string[];
  tokenExpiration: Date;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginRequestDTO) => Promise<boolean>;
  register: (userData: RegisterDTO) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  getUserRoles: () => string[];
  getUserName: () => string | null;
  getTokenExpirationTime: () => Date | null;
  isTokenExpiringSoon: (minutesBefore?: number) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = new AuthService();

  useEffect(() => {
    // Verificar si hay una sesión guardada al iniciar la app
    const initAuth = () => {
      try {
        // Usar el método isAuthenticated del servicio que ya maneja la verificación
        if (authService.isAuthenticated()) {
          const userData = authService.getUserData();
          
          if (userData) {
            setUser({
              userName: userData.userName,
              roles: userData.roles,
              tokenExpiration: userData.tokenExpiration
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Si hay error, limpiar cualquier dato corrupto
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequestDTO): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userData = await authService.login(credentials);
      
      // El servicio ya guarda el token y userData internamente
      setUser({
        userName: userData.userName,
        roles: userData.roles,
        tokenExpiration: userData.tokenExpiration
      });
      
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterDTO): Promise<boolean> => {
    try {
      setIsLoading(true);
      await authService.register(userData);
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Funciones helper que delegan al servicio
  const hasRole = (role: string): boolean => {
    return authService.hasRole(role);
  };

  const getUserRoles = (): string[] => {
    return authService.getUserRoles();
  };

  const getUserName = (): string | null => {
    return authService.getUserName();
  };

  const getTokenExpirationTime = (): Date | null => {
    return authService.getTokenExpirationTime();
  };

  const isTokenExpiringSoon = (minutesBefore: number = 5): boolean => {
    return authService.isTokenExpiringSoon(minutesBefore);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: authService.isAuthenticated(),
    isLoading,
    hasRole,
    getUserRoles,
    getUserName,
    getTokenExpirationTime,
    isTokenExpiringSoon
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};