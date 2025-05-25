import axios from 'axios';

// 定義接口和類型
interface AuthResponse {
  token: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// 直接從環境變量獲取API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// 創建一個axios實例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30秒超時
});

// 請求攔截器 - 可以在請求發送前添加認證令牌等
api.interceptors.request.use(
  (config) => {
    // 從localStorage獲取token（如果有的話）
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器 - 處理錯誤和響應
api.interceptors.response.use(
  (response) => {
    // 返回成功的數據
    return response.data;
  },
  (error) => {
    // 處理常見的錯誤
    if (error.response) {
      // 服務器響應了，但狀態碼不是2xx
      console.error('API Error:', error.response.status, error.response.data);
      
      // 處理401錯誤 (未授權)，可能需要重新登錄
      if (error.response.status === 401) {
        // 清除令牌並重定向到登錄頁面
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // 請求已發送但沒有收到響應
      console.error('API Error: No response received', error.request);
    } else {
      // 設置請求時發生錯誤
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// API函數
export const apiService = {
  // 認證相關
  auth: {
    login: async (username: string, password: string): Promise<AuthResponse> => {
      return api.post('/auth/login', { username, password });
    },
    register: async (userData: any): Promise<AuthResponse> => {
      return api.post('/auth/register', userData);
    },
    logout: async (): Promise<any> => {
      return api.post('/auth/logout');
    },
  },
  
  // 用戶相關
  users: {
    getProfile: async () => {
      return api.get('/users/profile');
    },
    updateProfile: async (userData: any) => {
      return api.put('/users/profile', userData);
    },
    getAllUsers: async () => {
      return api.get('/users');
    },
    getUserById: async (id: string) => {
      return api.get(`/users/${id}`);
    },
    createUser: async (userData: any) => {
      return api.post('/users', userData);
    },
    updateUser: async (id: string, userData: any) => {
      return api.put(`/users/${id}`, userData);
    },
    deleteUser: async (id: string) => {
      return api.delete(`/users/${id}`);
    },
  },
};

export default apiService; 