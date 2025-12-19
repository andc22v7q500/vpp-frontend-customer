import createApiClient from './api.service'

class ThuongHieuService {
  constructor(baseUrl = '/api/thuong-hieu') {
    this.api = createApiClient(baseUrl)
  }
  async getAll() {
    return (await this.api.get('/')).data
  }
}
export default new ThuongHieuService()
