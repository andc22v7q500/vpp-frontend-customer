// src/stores/auth.store.js

import { defineStore } from 'pinia'
import { ref } from 'vue' // Import ref từ vue
import AuthService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  // --- STATE ---
  // ref() tương đương với state
  // Lấy user từ localStorage để duy trì đăng nhập
  const user = ref(JSON.parse(localStorage.getItem('user')))
  const returnUrl = ref(null)

  // --- ACTIONS ---
  // function() tương đương với actions
  async function login(email, mat_khau) {
    const userData = await AuthService.login({ email, mat_khau })

    // Cập nhật state
    user.value = userData

    // Lưu vào localStorage
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    user.value = null
    localStorage.removeItem('user')
  }

  async function signup(data) {
    await AuthService.signup(data)
  }

  // --- GETTERS --- (Chúng ta sẽ cần cái này sau)
  // computed() tương đương với getters
  // const isLoggedIn = computed(() => !!user.value);

  // Phải return tất cả những gì muốn component khác sử dụng
  return { user, returnUrl, login, logout, signup }
})
