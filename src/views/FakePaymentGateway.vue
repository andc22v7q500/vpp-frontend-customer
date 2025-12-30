<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// Import ApiService cơ bản để gọi về Back-end
import createApiClient from '@/services/api.service'

const route = useRoute()
const router = useRouter()

const orderId = route.query.orderId
const amount = route.query.amount
const isProcessing = ref(false)
const otp = ref('')

const api = createApiClient('/api/don-hang') // Gọi đến route đơn hàng

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const handlePayment = () => {
  if (!otp.value) {
    alert('Vui lòng nhập mã OTP (Gợi ý: 123456)')
    return
  }

  isProcessing.value = true

  // 1. Giả lập độ trễ mạng (2 giây) cho giống thật
  setTimeout(async () => {
    try {
      // 2. Gọi API Back-end để cập nhật trạng thái đơn hàng thành 'cho_xac_nhan'
      await api.put(`/${orderId}/thanh-toan-gia-lap`)

      // 3. Chuyển hướng về trang Kết quả thành công
      // Chúng ta tái sử dụng trang PaymentResult hoặc về thẳng Lịch sử
      alert('Giao dịch thành công! Tiền đã được trừ.')
      router.push({ name: 'order.history' })
    } catch (error) {
      console.error(error)
      alert('Có lỗi xảy ra khi xử lý giao dịch.')
      isProcessing.value = false
    }
  }, 2000)
}
</script>

<template>
  <div class="gateway-wrapper">
    <div class="card shadow-lg payment-card">
      <!-- Header giả lập ngân hàng -->
      <div class="card-header bg-primary text-white">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="m-0"><i class="fas fa-university"></i> VPP-BANK SECURE</h5>
          <span class="badge bg-warning text-dark">TEST MODE</span>
        </div>
      </div>

      <div class="card-body p-4">
        <div class="text-center mb-4">
          <p class="text-muted mb-1">Thanh toán đơn hàng</p>
          <h3 class="text-primary fw-bold">#{{ orderId }}</h3>
          <h2 class="text-danger mt-2">{{ formatCurrency(amount) }}</h2>
        </div>

        <div class="info-group mb-3">
          <label class="small text-muted">Số thẻ</label>
          <div class="fake-input">
            <i class="fab fa-cc-visa text-primary me-2"></i>
            <span>**** **** **** 9999</span>
          </div>
        </div>

        <div class="info-group mb-4">
          <label class="small text-muted">Mã OTP (Nhập bất kỳ)</label>
          <input
            type="text"
            class="form-control text-center letter-spacing"
            v-model="otp"
            placeholder="Enter OTP"
            maxlength="6"
          />
        </div>

        <button
          class="btn btn-success w-100 btn-lg mb-3"
          @click="handlePayment"
          :disabled="isProcessing"
        >
          <span v-if="isProcessing">
            <i class="fas fa-spinner fa-spin"></i> Đang xử lý giao dịch...
          </span>
          <span v-else> XÁC NHẬN THANH TOÁN </span>
        </button>

        <button
          class="btn btn-outline-secondary w-100"
          @click="router.back()"
          :disabled="isProcessing"
        >
          Hủy giao dịch
        </button>
      </div>

      <div class="card-footer text-center text-muted small">
        <i class="fas fa-lock"></i> Giao dịch được bảo mật chuẩn quốc tế
      </div>
    </div>
  </div>
</template>

<style scoped>
.gateway-wrapper {
  min-height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.payment-card {
  width: 100%;
  max-width: 400px;
  border: none;
  border-radius: 15px;
  overflow: hidden;
}
.fake-input {
  background: #e9ecef;
  padding: 10px 15px;
  border-radius: 5px;
  font-weight: bold;
  color: #495057;
  display: flex;
  align-items: center;
}
.letter-spacing {
  letter-spacing: 5px;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
