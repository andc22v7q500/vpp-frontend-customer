<script setup>
import { ref, onMounted, computed } from 'vue'
import DiaChiService from '@/services/dia-chi.service'
import GioHangService from '@/services/gio-hang.service'
import DonHangService from '@/services/don-hang.service'
import { useRouter, useRoute } from 'vue-router'

const addresses = ref([])
const checkoutItems = ref([])
const router = useRouter()
const route = useRoute()

const selectedAddressId = ref(null)
const paymentMethod = ref('cod') // Mặc định là COD
const message = ref('')

const retrieveData = async () => {
  try {
    // Lấy mảng ID từ URL
    const itemIdsToCheckout = route.query.items || []
    if (itemIdsToCheckout.length === 0) {
      // Nếu không có item nào được truyền, quay lại giỏ hàng
      router.push({ name: 'cart' })
      return
    }

    // Lấy tất cả địa chỉ và toàn bộ giỏ hàng
    const [allAddresses, allCartItems] = await Promise.all([
      DiaChiService.getAll(),
      GioHangService.getCart(),
    ])

    addresses.value = allAddresses
    if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id
    }

    // Lọc ra những item cần thanh toán
    checkoutItems.value = allCartItems.filter((item) =>
      itemIdsToCheckout.includes(item.id.toString()),
    )
  } catch (error) {
    console.error(error)
  }
}

const placeOrder = async () => {
  if (!selectedAddressId.value) {
    message.value = 'Vui lòng chọn địa chỉ giao hàng.'
    return
  }
  if (checkoutItems.value.length === 0) {
    message.value = 'Giỏ hàng của bạn đang trống.'
    return
  }

  try {
    const orderData = {
      ma_dia_chi: selectedAddressId.value,
      phuong_thuc_thanh_toan: paymentMethod.value,
      // Chỉ gửi ID của các sản phẩm trong trang checkout
      cartItemIds: checkoutItems.value.map((item) => item.id),
    }
    const result = await DonHangService.create(orderData)
    alert(`Đặt hàng thành công! Mã đơn hàng của bạn là: ${result.orderId}`)
    router.push({ name: 'order.history' })
  } catch (error) {
    console.error(error)
    message.value = error.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng.'
  }
}

const totalPrice = computed(() => {
  return checkoutItems.value.reduce((total, item) => {
    return total + item.gia_ban * item.so_luong
  }, 0)
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

onMounted(() => {
  retrieveData()
})
</script>

<template>
  <div class="page">
    <h4>Thanh toán</h4>
    <hr />

    <h5>Chọn địa chỉ giao hàng</h5>
    <div v-if="addresses.length > 0">
      <select v-model="selectedAddressId" class="form-select">
        <option v-for="address in addresses" :key="address.id" :value="address.id">
          {{ address.ten_nguoi_nhan }} - {{ address.so_dien_thoai }} | {{ address.dia_chi_cu_the }},
          {{ address.phuong_xa }}, {{ address.quan_huyen }}, {{ address.tinh_thanh }}
        </option>
      </select>
    </div>
    <p v-else>
      Bạn chưa có địa chỉ nào.
      <router-link :to="{ name: 'address.book' }">Thêm địa chỉ mới</router-link>
    </p>

    <h5 class="mt-4">Sản phẩm</h5>
    <ul class="list-group mb-3">
      <li
        v-for="item in checkoutItems"
        :key="item.id"
        class="list-group-item d-flex justify-content-between lh-sm"
      >
        <div>
          <h6 class="my-0">{{ item.ten_san_pham }} ({{ item.ten_mau_ma }})</h6>
          <small class="text-muted">Số lượng: {{ item.so_luong }}</small>
        </div>
        <span class="text-muted">{{ formatCurrency(item.gia_ban * item.so_luong) }}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between">
        <span><strong>Tổng (VND)</strong></span>
        <strong>{{ formatCurrency(totalPrice) }}</strong>
      </li>
    </ul>

    <h5 class="mt-4">Phương thức thanh toán</h5>
    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        name="paymentMethod"
        id="cod"
        value="cod"
        v-model="paymentMethod"
        checked
      />
      <label class="form-check-label" for="cod"> Thanh toán khi nhận hàng (COD) </label>
    </div>
    <!-- Sau này có thể thêm VNPAY ở đây -->

    <hr />
    <button class="w-100 btn btn-primary btn-lg" @click="placeOrder">Đặt hàng</button>
    <p v-if="message" class="error-feedback mt-3">{{ message }}</p>
  </div>
</template>
