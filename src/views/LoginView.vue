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
  <div class="login-wrapper">
    <div class="login-card shadow-lg">
      <h2 class="text-center mb-4 text-primary fw-bold">Đăng nhập</h2>

      <LoginForm @submit:login="handleLogin" />

      <p v-if="errorMessage" class="alert alert-danger mt-3 text-center">{{ errorMessage }}</p>

      <div class="text-center mt-4">
        <span class="text-muted">Chưa có tài khoản?</span>
        <router-link :to="{ name: 'signup' }" class="fw-bold ms-2 text-decoration-none">
          Đăng ký ngay
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tạo nền cho toàn trang đăng nhập */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* Căn giữa theo chiều dọc */
  background-color: #f0f2f5; /* Màu nền xám nhẹ hiện đại */
}

/* Style cho cái thẻ chứa form */
.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 15px; /* Bo góc mềm mại */
  width: 100%;
  max-width: 450px; /* Giới hạn chiều rộng */
  border: none; /* Bỏ viền đen xấu xí */
}
</style>
