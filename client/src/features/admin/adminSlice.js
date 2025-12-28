import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  admin: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.admin = action.payload;
      state.error = null;
      // Store in localStorage for persistence
      localStorage.setItem('adminAuth', JSON.stringify({ isAuthenticated: true, admin: action.payload }));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.admin = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.error = null;
      localStorage.removeItem('adminAuth');
    },
    checkAuth: (state) => {
      const storedAuth = localStorage.getItem('adminAuth');
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          if (authData.isAuthenticated && authData.admin) {
            state.isAuthenticated = true;
            state.admin = authData.admin;
          }
        } catch (error) {
          localStorage.removeItem('adminAuth');
        }
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, checkAuth } = adminSlice.actions;

// Export admin selector for direct use
export const selectAdmin = (state) => state.admin.admin;

// Simple login action (in real app, this would call an API)
export const loginAdmin = (username, password) => {
  return async (dispatch) => {
    dispatch(loginStart());
    
    // Simple hardcoded admin credentials (in production, verify against backend)
    // For demo purposes: admin/admin123
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === 'admin' && password === 'admin123') {
          dispatch(
            loginSuccess({
              username: 'admin',
              email: 'admin@incidenttracking.com',
              role: 'admin',
            })
          );
          resolve();
        } else {
          dispatch(loginFailure('Invalid username or password'));
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };
};

export default adminSlice.reducer;

