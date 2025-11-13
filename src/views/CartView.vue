<script setup>
import { ref, onMounted, computed } from 'vue'
import GioHangService from '@/services/gio-hang.service'
import { useRouter } from 'vue-router'

const cartItems = ref([])
const router = useRouter()
const selectedItems = ref([])

const retrieveCart = async () => {
  try {
    cartItems.value = await GioHangService.getCart()
  } catch (error) {
    console.error(error)
  }
}

const updateQuantity = async (item, newQuantity) => {
  if (newQuantity > 0) {
    try {
      await GioHangService.updateItem(item.id, { so_luong: newQuantity })
      item.so_luong = newQuantity // Cập nhật lại giao diện ngay lập tức
    } catch (error) {
      console.error(error)
    }
  } else {
    // Nếu số lượng là 0 hoặc âm, coi như xóa
    removeItem(item.id)
  }
}

const removeItem = async (itemId) => {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
    try {
      await GioHangService.removeItem(itemId)
      // Tải lại toàn bộ giỏ hàng
      retrieveCart()
    } catch (error) {
      console.error(error)
    }
  }
}

const totalPrice = computed(() => {
  // Nếu không có sản phẩm nào được chọn, tổng tiền là 0
  if (selectedItems.value.length === 0) {
    return 0
  }

  // Lọc ra các object item đầy đủ từ cartItems dựa trên các ID đã chọn
  const itemsToCalculate = cartItems.value.filter((item) => selectedItems.value.includes(item.id))

  // Tính tổng trên các item đã được lọc
  return itemsToCalculate.reduce((total, item) => {
    return total + item.gia_ban * item.so_luong
  }, 0)
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const goToCheckout = () => {
  if (selectedItems.value.length === 0) {
    alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.')
    return
  }
  // Truyền mảng ID qua query params của router
  router.push({
    name: 'checkout',
    query: { items: selectedItems.value },
  })
}

onMounted(() => {
  retrieveCart()
})
</script>

<template>
  <div class="page">
    <h4>
      Giỏ hàng
      <i class="fas fa-shopping-cart"></i>
    </h4>
    <hr />
    <div v-if="cartItems.length > 0">
      <!-- THÊM CHECKBOX VÀO MỖI ITEM -->
      <div v-for="item in cartItems" :key="item.id" class="d-flex align-items-center mb-3">
        <input
          type="checkbox"
          :value="item.id"
          v-model="selectedItems"
          class="form-check-input me-3"
        />
        <img
          :src="`http://localhost:3000/${item.hinh_anh_dai_dien}`"
          style="width: 80px; height: 80px; object-fit: cover"
          class="me-3"
        />
        <div class="flex-grow-1">
          <h6>{{ item.ten_san_pham }}</h6>
          <small>{{ item.ten_mau_ma }}</small>
          <p class="mb-0 text-danger">
            <strong>{{ formatCurrency(item.gia_ban) }}</strong>
          </p>
        </div>
        <div class="d-flex align-items-center">
          <input
            type="number"
            :value="item.so_luong"
            @change="updateQuantity(item, parseInt($event.target.value))"
            min="1"
            class="form-control"
            style="width: 70px"
          />
          <button class="btn btn-sm btn-outline-danger ms-2" @click="removeItem(item.id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <hr />
      <div class="text-end">
        <h4>
          Tổng tiền: <span class="text-danger">{{ formatCurrency(totalPrice) }}</span>
        </h4>
        <button class="btn btn-primary mt-2" @click="goToCheckout">Tiến hành Thanh toán</button>
      </div>
    </div>
    <div v-else>
      <p>Giỏ hàng của bạn đang trống.</p>
      <router-link :to="{ name: 'home' }">Tiếp tục mua sắm</router-link>
    </div>
  </div>
</template>
