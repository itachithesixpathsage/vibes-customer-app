import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '@store/index';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, selectAuthLoading, selectAuthError } from '@store/index';
import { RootState } from '@store/index';

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