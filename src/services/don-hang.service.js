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

  // (Các hàm lấy lịch sử đơn hàng sẽ được thêm sau)
}

export default new DonHangService()
