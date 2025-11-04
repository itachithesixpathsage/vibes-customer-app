import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '@store/index';
import { selectIsAuthenticated, selectCurrentUser } from '@store/index';

// Typed hook for auth state
export const useAuth: TypedUseSelectorHook<RootState> = useSelector;

export const useAuthState = () => {
  const isAuthenticated = useAuth(selectIsAuthenticated);
  const currentUser = useAuth(selectCurrentUser);
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    error,
  };
};

export default useAuthState;