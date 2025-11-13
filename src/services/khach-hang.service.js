// src/services/khach-hang.service.js
import createApiClient from './api.service'
import { useAuthStore } from '@/stores/auth.store'

class KhachHangService {
  constructor(baseUrl = '/api/khach-hang') {
    this.api = createApiClient(baseUrl)
    // Sử dụng interceptor để tự động đính kèm token vào mỗi request
    this.api.interceptors.request.use(
      (config) => {
        const authStore = useAuthStore()
        const token = authStore.user?.accessToken
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
  }

  async getProfile() {
    return (await this.api.get('/profile')).data
  }

  async updateProfile(data) {
    return (await this.api.put('/profile', data)).data
  }
}

export default new KhachHangService()
