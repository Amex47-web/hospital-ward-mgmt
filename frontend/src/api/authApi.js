import axiosClient from './axiosClient';

export const authApi = {
  signup: (data) => axiosClient.post('/auth/signup', data),

  login: (email, password) => {
    // OAuth2PasswordRequestForm expects form-encoded data
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    return axiosClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  getMe: () => axiosClient.get('/auth/me'),
};
