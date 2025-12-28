<script setup>
import SignupForm from '@/components/SignupForm.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const errorMessage = ref('')
const successMessage = ref('')

const handleSignup = async (data) => {
  try {
    errorMessage.value = ''
    successMessage.value = ''
    await authStore.signup(data)
    successMessage.value = 'Đăng ký thành công! Đang chuyển hướng...'
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 2000)
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký.'
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-card shadow-lg">
      <h2 class="text-center mb-4 text-primary fw-bold">Đăng ký tài khoản</h2>

      <SignupForm @submit:signup="handleSignup" />

      <p v-if="successMessage" class="alert alert-success mt-3 text-center">{{ successMessage }}</p>
      <p v-if="errorMessage" class="alert alert-danger mt-3 text-center">{{ errorMessage }}</p>

      <div class="text-center mt-4">
        <span class="text-muted">Đã có tài khoản?</span>
        <router-link :to="{ name: 'login' }" class="fw-bold ms-2 text-decoration-none">
          Đăng nhập
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Copy y hệt style từ LoginView sang */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #f0f2f5;
  padding: 20px; /* Thêm padding để trên mobile không bị dính lề */
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 15px;
  width: 100%;
  max-width: 500px; /* Đăng ký nhiều trường hơn nên cho rộng hơn login xíu (450 -> 500) */
  border: none;
}
</style>
