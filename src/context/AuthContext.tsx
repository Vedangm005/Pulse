import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/demoAccounts';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  loginAsDemo: (role: UserRole) => void;
  logout: () => void;
  isDevMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'kexp_current_user_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Attendee demo profile for immediate interactivity
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role && DEMO_USERS[parsed.role as UserRole]) {
          return DEMO_USERS[parsed.role as UserRole];
        }
      }
      return DEMO_USERS.attendee;
    } catch {
      return DEMO_USERS.attendee;
    }
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Storage access blocked or unavailable
    }
  }, [currentUser]);

  const loginAsDemo = (role: UserRole) => {
    if (DEMO_USERS[role]) {
      setCurrentUser(DEMO_USERS[role]);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loginAsDemo,
        logout,
        isDevMode: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
