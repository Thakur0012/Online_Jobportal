import { create } from 'zustand';
import api from '../lib/axios';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    checkAuth: async () => {
        try {
            const res = await api.get('/auth/me');
            set({ user: res.data, isAuthenticated: true, isLoading: false, error: null });
        } catch {
            set({ user: null, isAuthenticated: false, isLoading: false, error: null });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/auth/login', { email, password });
            // Save token to localStorage for cross-domain Bearer auth
            if (res.data.token) {
                localStorage.setItem('jwt', res.data.token);
            }
            set({ user: res.data, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
            return false;
        }
    },

    register: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            // If it's already a FormData object (has file), send as-is; otherwise convert
            const data = formData instanceof FormData ? formData : (() => {
                const fd = new FormData();
                Object.entries(formData).forEach(([k, v]) => v !== undefined && v !== null && fd.append(k, v));
                return fd;
            })();
            const res = await api.post('/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            // Save token to localStorage for cross-domain Bearer auth
            if (res.data.token) {
                localStorage.setItem('jwt', res.data.token);
            }
            set({ user: res.data, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
            return false;
        }
    },

    updateProfile: async (formData) => {
        set({ isLoading: true, error: null });
        try {
            const data = formData instanceof FormData ? formData : (() => {
                const fd = new FormData();
                Object.entries(formData).forEach(([k, v]) => v !== undefined && v !== null && fd.append(k, v));
                return fd;
            })();
            const res = await api.put('/auth/profile', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set({ user: res.data, isLoading: false });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Update failed', isLoading: false });
            return false;
        }
    },


    logout: async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('jwt');
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            localStorage.removeItem('jwt');
            set({ user: null, isAuthenticated: false });
            console.error('Logout failed', error);
        }
    }
}));
