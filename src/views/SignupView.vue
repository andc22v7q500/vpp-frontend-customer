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
    successMessage.value = 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.'
    // Tùy chọn: Tự động chuyển hướng đến trang đăng nhập sau vài giây
    setTimeout(() => {
      router.push({ name: 'login' })
    }, 3000)
  } catch (error) {
    console.error(error)
    errorMessage.value = error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng ký.'
  }
}
</script>

<template>
  <div class="page">
    <h4>Đăng ký tài khoản</h4>
    <SignupForm @submit:signup="handleSignup" />
    <p v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error-feedback mt-3">{{ errorMessage }}</p>
    <p class="mt-3">
      Đã có tài khoản?
      <router-link :to="{ name: 'login' }">Đăng nhập</router-link>
    </p>
  </div>
</template>
