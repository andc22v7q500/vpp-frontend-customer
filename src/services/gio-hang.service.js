// src/services/gio-hang.service.js
import createApiClient from './api.service'
import { useAuthStore } from '@/stores/auth.store'

class GioHangService {
  constructor(baseUrl = '/api/gio-hang') {
    this.api = createApiClient(baseUrl)
    this.api.interceptors.request.use((config) => {
      const authStore = useAuthStore()
      const token = authStore.user?.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }
  // Lấy chi tiết giỏ hàng
  async getCart() {
    return (await this.api.get('/')).data
  }
  // Thêm sản phẩm vào giỏ
  async addItem(data) {
    // data: { ma_mau_ma: 1, so_luong: 2 }
    return (await this.api.post('/', data)).data
  }
  // Cập nhật số lượng
  async updateItem(itemId, data) {
    // data: { so_luong: 5 }
    return (await this.api.put(`/items/${itemId}`, data)).data
  }
  // Xóa sản phẩm
  async removeItem(itemId) {
    return (await this.api.delete(`/items/${itemId}`)).data
  }
}

export default new GioHangService()
