// src/services/don-hang.service.js
import createApiClient from './api.service'
import { useAuthStore } from '@/stores/auth.store'

class DonHangService {
  constructor(baseUrl = '/api/don-hang') {
    this.api = createApiClient(baseUrl)
    // Interceptor để đính kèm token
    this.api.interceptors.request.use((config) => {
      const authStore = useAuthStore()
      if (authStore.user?.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.user.accessToken}`
      }
      return config
    })
  }

  async create(data) {
    return (await this.api.post('/', data)).data
  }

  /**
   * [USER] Lấy danh sách tất cả đơn hàng của người dùng đang đăng nhập.
   */
  async getAllForUser() {
    return (await this.api.get('/')).data
  }

  /**
   * [USER] Lấy chi tiết một đơn hàng của người dùng đang đăng nhập.
   */
  async getForUser(id) {
    return (await this.api.get(`/${id}`)).data
  }
}

export default new DonHangService()
