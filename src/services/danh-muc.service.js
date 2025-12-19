import createApiClient from './api.service'

class DanhMucService {
  constructor(baseUrl = '/api/danh-muc') {
    this.api = createApiClient(baseUrl)
  }
  async getAll() {
    return (await this.api.get('/')).data
  }
}
export default new DanhMucService()
