import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authApi = {
  register: (data: any) => api.post('/api/auth/register', data),
  login: (data: any) => api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
};

export const jobsApi = {
  getJobs: () => api.get('/api/jobs'),
};

export const referralsApi = {
  getReferrals: () => api.get('/api/referrals'),
  createReferral: (data: any) => api.post('/api/referrals', data),
  updateStatus: (id: string, status: string) => api.patch(`/api/referrals/${id}/status`, { status }),
};

export const aiApi = {
  suggestNote: (data: any) => api.post('/api/ai/suggest-note', data),
};
