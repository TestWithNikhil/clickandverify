import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthState, User } from '../types';

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('cav-token');
    const userStr = localStorage.getItem('cav-user');
    if (token && userStr) {
      try {
        return { token, user: JSON.parse(userStr), isAuthenticated: true };
      } catch {
        // ignore
      }
    }
    return { token: null, user: null, isAuthenticated: false };
  });

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem('cav-token', token);
    localStorage.setItem('cav-user', JSON.stringify(user));
    setAuthState({ token, user, isAuthenticated: true });
    console.log('[ClickAndVerify] User logged in:', user.email);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cav-token');
    localStorage.removeItem('cav-user');
    setAuthState({ token: null, user: null, isAuthenticated: false });
    console.log('[ClickAndVerify] User logged out');
  }, []);

  const updateUser = useCallback((user: User) => {
    localStorage.setItem('cav-user', JSON.stringify(user));
    setAuthState((prev) => ({ ...prev, user }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
