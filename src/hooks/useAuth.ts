import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectIsAuthenticated, selectCurrentUser, selectAuthLoading, selectAuthError } from '../store';

// Typed hook for auth state
export const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    error,
  };
};

export default useAuth;