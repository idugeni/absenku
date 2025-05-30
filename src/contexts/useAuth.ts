import { useContext } from 'react';
import { AuthContext } from './AuthContextDefinition';

export const useAuth = () => {
  return useContext(AuthContext);
};