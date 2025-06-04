import axios from 'axios';

import { Case, CaseCreate, CaseUpdate } from '@/types/case';
import { FormMetadata, FormRecord, FormRecordCreate, FormRecordResponse } from '@/types/form';

interface AuthResponse {
  access_token: string;
  token_type: string;
}
  

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'CEO' | 'DIRECTOR' | 'VICE_DIRECTOR' | 'TEAM_LEADER' | 'SUPERVISOR' | 'SOCIAL_WORKER';
  activate: boolean;
  created_at: string;
  isAdmin: boolean;
}

interface UpdatePasswordData {
  old_password: string;
  new_password: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  activate?: boolean;
  role?: UserData['role'];
  isAdmin?: boolean;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
}

interface UpdateRoleData extends UpdateUserData {
  role: UserData['role'];
}

interface UpdateActivateData {
  activate: boolean;
}

interface UpdateAdminData {
  isAdmin: boolean;
}

// 直接從環境變量獲取API URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// 創建一個axios實例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 增加到60秒，考慮到冷啟動的情況
});

// 請求攔截器
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

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // 如果是超時錯誤且還沒有重試過
    if (error.code === 'ECONNABORTED' && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // 對於登入請求，使用更長的超時時間重試
      if (originalRequest.url === '/auth/login') {
        originalRequest.timeout = 90000; // 90秒
        try {
          return await axios(originalRequest);
        } catch (retryError) {
          return Promise.reject(retryError);
        }
      }
    }

    // 處理其他錯誤
    if (error.response) {
      // 服務器響應了，但狀態碼不是2xx
      console.error('API Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }

      if (error.response.status === 422) {
        const details = error.response.data.detail;
        if (Array.isArray(details)) {
          console.error('Validation errors:', details);
        }
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

// 角色映射
export const ROLE_MAPPING = {
  CEO: '執行長',
  DIRECTOR: '主任',
  VICE_DIRECTOR: '副主任',
  TEAM_LEADER: '組長',
  SUPERVISOR: '督導 / 班導',
  SOCIAL_WORKER: '社工 / 教保'
} as const;

// API函數
export const apiService = {
  // 認證相關
  auth: {
    login: async (username: string, password: string): Promise<AuthResponse> => {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      
      return api.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    },
  },
  
  // 用戶相關
  users: {
    // 獲取所有用戶
    getAll: async (): Promise<UserData[]> => {
      return api.get('/users/');
    },

    // 創建用戶
    create: async (userData: { password: string; name: string; email: string }): Promise<UserData> => {
      return api.post('/users/', userData);
    },

    // 獲取當前用戶信息
    getCurrentUser: async (): Promise<UserData> => {
      return api.get('/users/me');
    },

    // 更新當前用戶信息
    updateCurrentUser: async (userData: UpdateUserData): Promise<UserData> => {
      return api.put('/users/me', userData);
    },

    // 更新當前用戶密碼
    updatePassword: async (passwordData: UpdatePasswordData): Promise<void> => {
      return api.put('/users/me/password', passwordData);
    },

    // 獲取特定用戶
    getById: async (userId: string): Promise<UserData> => {
      return api.get(`/users/${userId}`);
    },

    // 刪除用戶
    delete: async (userId: string): Promise<void> => {
      return api.delete(`/users/${userId}`);
    },

    // 更新用戶角色
    updateRole: async (userId: string, roleData: UpdateRoleData): Promise<UserData> => {
      return api.put(`/users/${userId}/role`, roleData);
    },

    updateActivate: async (userId: string, activateData: UpdateActivateData): Promise<UserData> => {
      return api.put(`/users/${userId}/activate`, activateData);
    },

    updateAdmin: async (userId: string, adminData: UpdateAdminData): Promise<UserData> => {
      return api.put(`/users/${userId}/admin`, adminData);
    },

    updateMe: async (profileData: UpdateProfileData): Promise<UserData> => {
      return api.put(`/users/me`, profileData);
    },

    // Add admin password update method
    adminUpdatePassword: async (userId: string, passwordData: { new_password: string }): Promise<void> => {
      return api.put(`/users/${userId}/admin-password`, passwordData);
    },
  },

  cases: {
    getAll: async (): Promise<Case[]> => {
      return api.get('/cases/');
    },

    getById: async (caseId: string): Promise<Case> => {
      return api.get(`/cases/${caseId}`);
    },

    create: async (caseData: CaseCreate): Promise<Case> => {
      return api.post('/cases/', caseData);
    },

    update: async (caseId: string, caseData: CaseUpdate): Promise<Case> => {
      return api.put(`/users/${caseId}`, caseData);
    },

    delete: async (caseId: string): Promise<unknown> => {
      return api.delete(`/cases/${caseId}`);
    },
  },

  form: {
    getByCaseId: async (caseId: string): Promise<FormMetadata[]> => {
      return api.get(`/forms/case/${caseId}`);
    },
    create: async (data: FormRecordCreate): Promise<FormRecord> => {
      return api.post('/forms/', data);
    },
    getById: async (formId: number): Promise<FormRecordResponse> => {
      return api.get(`/forms/${formId}`);
    },
    getAll: async (): Promise<FormMetadata[]> => {
      return api.get('/forms/');
    },
  }
};

export default apiService; 