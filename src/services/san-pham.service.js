// src/services/san-pham.service.js
import createApiClient from './api.service'

class SanPhamService {
  constructor(baseUrl = '/api/san-pham') {
    this.api = createApiClient(baseUrl)
  }

  async getAll(params) {
    // `params` là một object chứa các query string như { search: 'abc', danhmuc: 1 }
    return (await this.api.get('/', { params })).data
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data
  }
}

export default new SanPhamService()
