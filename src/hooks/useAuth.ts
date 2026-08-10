import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/components/auth/AuthProvider';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth hook’u bir AuthProvider içerisinde kullanılmalıdır.');
  }
  return context;
};
