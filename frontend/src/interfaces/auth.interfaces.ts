// interfaces/auth.interfaces.ts

// DTO para enviar al login
export interface LoginRequestDTO {
  userName: string;
  password: string;
}

// DTO para registro
export interface RegisterDTO {
  userName: string;
  email: string;
  password: string;
}

// Estructura del token que devuelve tu backend
export interface TokenInfo {
  token: string;
  expiration: string; // ISO date string
}

// Respuesta completa del login que devuelve tu backend
export interface LoginResponseDTO {
  userName: string;
  password: null; // No debería venir, pero tu backend lo está enviando
  token: TokenInfo;
  roles: string[];
}

// Datos del usuario para guardar en el contexto/localStorage (limpio)
export interface UserData {
  userName: string;
  roles: string[];
  tokenExpiration: Date;
}