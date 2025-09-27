import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface AuthContextType {
  user: {
    firstName: string;
    lastName: string;
    vid: string;
  } | null;
  refreshToken: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  refreshToken: () => {},
  logout: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    // Mock user data - replace with actual authentication logic
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      vid: 'JAL001'
    };
    setUser(mockUser);
  }, []);

  const refreshToken = () => {
    // Mock refresh logic
    console.log('Refreshing token...');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jal_api_key');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, refreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export { AuthContext };
