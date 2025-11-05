import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserPreferences } from '@types/auth';

interface UserState {
  user: User | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: UserState = {
  user: null,
  preferences: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Async thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In real app, this would be:
      // const response = await userService.updateProfile(profileData);
      // return response.user;

      return profileData as User;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences: Partial<UserPreferences>, { rejectWithValue }) => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));

      // In real app, this would be:
      // const response = await userService.updatePreferences(preferences);
      // return response.preferences;

      return preferences as UserPreferences;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Preferences update failed');
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (imageUri: string, { rejectWithValue }) => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockAvatarUrl = `https://api.vibes-fooddelivery.com/avatars/${Date.now()}.jpg`;

      // In real app, this would be:
      // const response = await userService.uploadAvatar(imageUri);
      // return { avatar: response.avatarUrl };

      return { avatar: mockAvatarUrl } as Partial<User>;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Avatar upload failed');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In real app, this would be:
      // await userService.deleteUser();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Account deletion failed');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setPreferences: (state, action: PayloadAction<UserPreferences | null>) => {
      state.preferences = action.payload;
    },
    updateLocalUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload, updatedAt: new Date().toISOString() };
      }
    },
    updateLocalPreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.preferences) {
        state.preferences = { ...state.preferences, ...action.payload };
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.preferences = null;
      state.error = null;
      state.isLoading = false;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload as User;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Preferences
    builder
      .addCase(updatePreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = action.payload as UserPreferences;
        state.error = null;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Upload Avatar
    builder
      .addCase(uploadAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user && action.payload.avatar) {
          state.user.avatar = action.payload.avatar;
          state.user.updatedAt = new Date().toISOString();
        }
        state.error = null;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete User
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.preferences = null;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setLoading,
  setUser,
  setPreferences,
  updateLocalUser,
  updateLocalPreferences,
  clearUser,
  setInitialized,
} = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectUserPreferences = (state: { user: UserState }) => state.user.preferences;
export const selectUserLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserInitialized = (state: { user: UserState }) => state.user.isInitialized;
export const selectDisplayName = (state: { user: UserState }) => {
  if (!state.user) return '';
  return state.user.fullName || `${state.user.firstName || ''} ${state.user.lastName || ''}`.trim();
};
export const selectUserAvatar = (state: { user: UserState }) => state.user?.avatar;
export const selectUserEmail = (state: { user: UserState }) => state.user?.email;
export const selectUserPhone = (state: { user: UserState }) => state.user?.phone;

export default userSlice.reducer;