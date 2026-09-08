export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  path: string;
  icon: string;
  tags: string[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  verified: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
