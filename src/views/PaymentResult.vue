<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const message = ref('Đang xử lý kết quả thanh toán...')
const isSuccess = ref(false)

onMounted(() => {
  // VNPAY trả về kết quả qua query parameters
  const responseCode = route.query.vnp_ResponseCode

  if (responseCode === '00') {
    isSuccess.value = true
    message.value = 'Giao dịch thành công! Cảm ơn bạn đã mua hàng.'
    // Ở đây có thể gọi thêm 1 API về Back-end để xác thực lại lần nữa nếu cần bảo mật cao
  } else {
    isSuccess.value = false
    message.value = 'Giao dịch thất bại hoặc bị hủy. Vui lòng thử lại.'
  }
})
</script>

<template>
  <div class="page text-center">
    <div v-if="isSuccess">
      <h1 class="text-success"><i class="fas fa-check-circle"></i> Thành công</h1>
    </div>
    <div v-else>
      <h1 class="text-danger"><i class="fas fa-times-circle"></i> Thất bại</h1>
    </div>

    <p class="lead my-4">{{ message }}</p>

    <router-link :to="{ name: 'order.history' }" class="btn btn-primary me-2">
      Xem lịch sử đơn hàng
    </router-link>
    <router-link :to="{ name: 'home' }" class="btn btn-outline-secondary">
      Về trang chủ
    </router-link>
  </div>
</template>
