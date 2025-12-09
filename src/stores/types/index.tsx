// Public user shape shared across app code. Expand as needed.
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  dateOfBirth: string | null;
  avtUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  MANAGER = "MANAGER",
}

// Auth store contract: central source of truth for identity and token.
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (token: string, refreshToken?: string | null) => Promise<void>;
  updateUser: (user: User | null) => void;
  logout: () => void;
}
