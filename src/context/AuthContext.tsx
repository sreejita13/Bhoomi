import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserSession } from '../types';

interface AuthContextType {
  session: UserSession | null;
  login: (role: UserRole, name: string, phone: string, state?: string, city?: string, identityRef?: string) => Promise<boolean>;
  logout: () => void;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('bhoomi_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (session) {
      localStorage.setItem('bhoomi_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('bhoomi_session');
    }
  }, [session]);

  const login = async (
    role: UserRole,
    name: string,
    phone: string,
    state?: string,
    city?: string,
    identityRef?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: '123456',
          role,
          name,
          phone,
          state: state || null,
          city: city || null,
          identityRef: identityRef || '9999 9999 9999',
        }),
      });

      const data = await response.json();
      if (data.success && data.session) {
        setSession(data.session);
        return true;
      }
      return false;
    } catch {
      // Fallback local session if API unreachable
      const newSession: UserSession = {
        id: `SESS-${Date.now()}`,
        role,
        name,
        phoneMasked: phone ? phone.replace(/(\d{2})\d{5}(\d{3})/, '+91 $1*****$2') : '+91 99*****000',
        state: state || (role === 'state' ? 'Maharashtra' : null),
        city: city || (role === 'state' ? 'Mumbai' : null),
        identityRef: 'DEMO-AADHAAR-9999',
      };
      setSession(newSession);
      return true;
    }
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('bhoomi_session');
  };

  const setCity = (city: string) => {
    if (session) {
      setSession({ ...session, city });
    }
  };

  const setState = (state: string) => {
    if (session) {
      setSession({ ...session, state });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        logout,
        setCity,
        setState,
        isAuthenticated: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
