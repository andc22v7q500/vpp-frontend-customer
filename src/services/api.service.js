// src/services/api.service.js
import axios from 'axios'

const commonConfig = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}

export default (baseURL) => {
  // 1. Tạo instance axios
  const instance = axios.create({
    baseURL,
    ...commonConfig,
  })

  // 2. Thêm Interceptor để xử lý LỖI phản hồi
  instance.interceptors.response.use(
    (response) => {
      // Nếu thành công, trả về dữ liệu bình thường
      return response
    },
    (error) => {
      // Nếu lỗi
      if (error.response) {
        // Kiểm tra nếu là lỗi 401 (Unauthorized) VÀ không phải đang ở trang login
        if (error.response.status === 401 && !window.location.pathname.includes('/login')) {
          console.warn('Token hết hạn hoặc không hợp lệ. Đang đăng xuất...')

          // Xóa thông tin user (cho cả Admin và Customer để chắc chắn)
          localStorage.removeItem('user')
          localStorage.removeItem('admin_user')

          // Chuyển hướng về trang login
          // Dùng window.location.href để ép tải lại trang, reset toàn bộ state của Vue
          window.location.href = '/login'
        }
      }
      // Trả lỗi về để các hàm gọi API (như login) có thể catch được và hiện thông báo
      return Promise.reject(error)
    },
  )

  return instance
}
