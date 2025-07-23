import axios from 'axios';
import { getAuthToken, removeAuthToken } from './auth';
import type { User, DashboardData, Session, SpeechOutput, AuthTokens } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.detail || error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      removeAuthToken();
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (username: string, password: string): Promise<AuthTokens> => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await api.post('/auth/login', formData);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (username: string, email: string, password: string): Promise<void> => {
    try {
      const response = await api.post('/auth/register', { 
        username, 
        email, 
        password 
      });
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
};

export const userAPI = {
  getMe: async (): Promise<User> => {
    const response = await api.get('/user/me');
    return response.data;
  },
  
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/user/dashboard');
    return response.data;
  },
  
  getHistory: async (): Promise<Session[]> => {
    const response = await api.get('/user/history');
    return response.data;
  },
};

export const speechAPI = {
  startRecording: async (): Promise<{ session_id: string }> => {
    const response = await api.post('/speech/start');
    return response.data;
  },
  
  stopRecording: async (sessionId: string, audioBlob: Blob): Promise<SpeechOutput> => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('session_id', sessionId);
    
    const response = await api.post('/speech/stop', formData);
    return {
      transcription: response.data.transcription,
      corrected_text: response.data.corrected_text,
      fluency_scores: response.data.fluency_scores,
      grammar_score: response.data.grammar_score,
      errors: response.data.errors,
      corrected_audio_url: response.data.corrected_audio_url
    };
  },
  
  getAudioUrl: (filename: string): string => {
    return `http://localhost:8000/speech/audio/${filename}`;
  },
};

export default api;