
export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
}

export interface JWTPayload {
  userId: number;
  name: string,
  email: string;
}