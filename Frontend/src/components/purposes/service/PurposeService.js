import { http } from '@/utils/http.js'

class PurposeService {
  get path() {
    return {
      purpose: 'api/purposes'
    }
  }

  get purposes() {
    return {
      get: (id) => http.get(`${this.path.purpose}/${id}`)
    }
  }
}

export default new PurposeService()
