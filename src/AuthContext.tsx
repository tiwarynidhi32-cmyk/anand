import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from './types';
import { MOCK_USERS } from './constants';

interface AuthContextType {
  user: User | null;
  login: (username: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hospital_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username: string, password?: string) => {
    const found = MOCK_USERS.find(u => u.username === username);
    if (found) {
      if (password && found.password !== password) return false;
      const userData = found as User;
      setUser(userData);
      localStorage.setItem('hospital_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hospital_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
