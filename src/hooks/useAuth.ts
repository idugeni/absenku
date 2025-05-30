import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContextDefinition';

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};