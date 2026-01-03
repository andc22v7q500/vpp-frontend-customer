<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import createApiClient from '@/services/api.service'

const route = useRoute()
const router = useRouter()
const message = ref('Đang xác thực giao dịch với máy chủ...')
const isSuccess = ref(false)
const isLoading = ref(true)

const vnpayApi = createApiClient('/api/vnpay')

const verifyPayment = async () => {
  try {
    // Lấy toàn bộ query params từ URL
    const params = route.query

    // GỌI VỀ BACK-END ĐỂ XÁC THỰC
    const response = await vnpayApi.get('/vnpay_return', { params })

    isSuccess.value = true
    message.value = `Thanh toán thành công cho đơn hàng #${response.data.orderId}! Cảm ơn bạn đã mua hàng.`
  } catch (error) {
    isSuccess.value = false
    message.value = error.response?.data?.message || 'Giao dịch không hợp lệ hoặc đã có lỗi xảy ra.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.vnp_SecureHash) {
    verifyPayment() // Gọi hàm xác thực
  } else {
    isLoading.value = false
    isSuccess.value = false
    message.value = 'Không tìm thấy thông tin giao dịch hợp lệ.'
  }
})
</script>

<template>
  <div class="page text-center">
    <div v-if="isLoading">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="lead my-4">{{ message }}</p>
    </div>
    <div v-else>
      <div v-if="isSuccess">
        <h1 class="text-success"><i class="fas fa-check-circle fa-2x"></i></h1>
        <h2 class="mt-3">Giao dịch Thành công</h2>
      </div>
      <div v-else>
        <h1 class="text-danger"><i class="fas fa-times-circle fa-2x"></i></h1>
        <h2 class="mt-3">Giao dịch Thất bại</h2>
      </div>
      <p class="lead my-4">{{ message }}</p>
      <router-link :to="{ name: 'order.history' }" class="btn btn-primary me-2"
        >Xem lịch sử đơn hàng</router-link
      >
      <router-link :to="{ name: 'home' }" class="btn btn-outline-secondary"
        >Về trang chủ</router-link
      >
    </div>
  </div>
</template>
