import { createContext, useState } from 'react';
import { ROLES } from '../utils/constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Placeholder auth state until backend/auth is integrated
  const [user, setUser] = useState({
    id: 'demo-user',
    name: 'Demo User',
    role: ROLES.CUSTOMER,
  });

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const switchRole = (role) =>
    setUser((prev) => ({
      ...(prev || { id: 'demo-user', name: 'Demo User' }),
      role,
    }));

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}
