// src/stores/auth.store.js
import { defineStore } from 'pinia'
import AuthService from '@/services/auth.service'

// Lấy thông tin user từ localStorage nếu có (khi F5 lại trang)
const user = JSON.parse(localStorage.getItem('user'))

export const useAuthStore = defineStore({
  id: 'auth',
  // State: Nơi lưu trữ dữ liệu
  state: () => ({
    // Nếu có user trong localStorage thì dùng, không thì null
    user: user ? user : null,
    // returnUrl để lưu lại trang người dùng muốn vào trước khi bị chuyển đến trang login
    returnUrl: null,
  }),
  // Actions: Các hàm để thay đổi state
  actions: {
    async login(email, mat_khau) {
      const userData = await AuthService.login({ email, mat_khau })

      // Cập nhật state sau khi đăng nhập thành công
      this.user = userData

      // Lưu thông tin user vào localStorage để không bị mất khi F5
      localStorage.setItem('user', JSON.stringify(userData))
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
    async signup(data) {
      // Chỉ gọi API, không tự động đăng nhập
      await AuthService.signup(data)
    },
  },
})
