<script setup>
import LoginForm from '@/components/LoginForm.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const errorMessage = ref('')

const handleLogin = async (data) => {
  try {
    await authStore.login(data.email, data.mat_khau)
    // Lấy returnUrl từ store hoặc chuyển về trang chủ
    const redirectPath = authStore.returnUrl || '/'
    router.push(redirectPath)
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.'
  }
}
</script>

<template>
  <div class="page">
    <h4>Đăng nhập</h4>
    <LoginForm @submit:login="handleLogin" />
    <p v-if="errorMessage" class="error-feedback mt-3">{{ errorMessage }}</p>
    <p class="mt-3">
      Chưa có tài khoản?
      <router-link :to="{ name: 'signup' }">Đăng ký ngay</router-link>
    </p>
  </div>
</template>
