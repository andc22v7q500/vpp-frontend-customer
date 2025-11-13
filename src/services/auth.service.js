// src/services/auth.service.js
import createApiClient from './api.service'

class AuthService {
  constructor(baseUrl = '/api/auth') {
    this.api = createApiClient(baseUrl)
  }

  async signup(data) {
    return (await this.api.post('/khach-hang/signup', data)).data
  }

  async login(data) {
    return (await this.api.post('/khach-hang/signin', data)).data
  }
}

export default new AuthService()
