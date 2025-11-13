// src/services/dia-chi.service.js
import createApiClient from './api.service'
import { useAuthStore } from '@/stores/auth.store'

class DiaChiService {
  constructor(baseUrl = '/api/dia-chi') {
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

  async getAll() {
    return (await this.api.get('/')).data
  }

  async create(data) {
    return (await this.api.post('/', data)).data
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data
  }
}

export default new DiaChiService()
