// src/services/danh-gia.service.js

import createApiClient from './api.service'
import { useAuthStore } from '@/stores/auth.store'

class DanhGiaService {
  constructor(baseUrl = '/api/danh-gia') {
    this.api = createApiClient(baseUrl)
    // Interceptor để tự động đính kèm token
    this.api.interceptors.request.use((config) => {
      const authStore = useAuthStore()
      const token = authStore.user?.accessToken
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  /**
   * [USER] Gửi một đánh giá mới cho một sản phẩm.
   * @param {string} productId - ID của sản phẩm được đánh giá.
   * @param {object} data - Dữ liệu đánh giá { so_sao, binh_luan }.
   */
  async create(productId, data) {
    return (await this.api.post(`/san-pham/${productId}`, data)).data
  }

  /**
   * [USER] Kiểm tra xem người dùng hiện tại có quyền đánh giá sản phẩm này không.
   * @param {string} productId - ID của sản phẩm cần kiểm tra.
   */
  async checkPermission(productId) {
    return (await this.api.get(`/san-pham/${productId}/permission`)).data
  }
}

export default new DanhGiaService()
