<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import SanPhamService from '@/services/san-pham.service'
import GioHangService from '@/services/gio-hang.service'
import { useAuthStore } from '@/stores/auth.store'

const product = ref(null)
const route = useRoute()
const authStore = useAuthStore()

// Biến để lưu lựa chọn của người dùng
const selectedVariantId = ref(null)
const quantity = ref(1)
const message = ref('')

const getProduct = async (id) => {
  try {
    product.value = await SanPhamService.get(id)
    // Tự động chọn mẫu mã đầu tiên nếu có
    if (product.value?.mau_ma?.length > 0) {
      selectedVariantId.value = product.value.mau_ma[0].id
    }
  } catch (error) {
    console.error(error)
  }
}

const addToCart = async () => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!authStore.user) {
    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.')
    // Có thể chuyển hướng đến trang đăng nhập
    // router.push({ name: 'login', query: { returnUrl: route.fullPath } });
    return
  }

  if (!selectedVariantId.value || quantity.value < 1) {
    message.value = 'Vui lòng chọn mẫu mã và số lượng hợp lệ.'
    return
  }

  try {
    const data = {
      ma_mau_ma: selectedVariantId.value,
      so_luong: quantity.value,
    }
    await GioHangService.addItem(data)
    message.value = 'Sản phẩm đã được thêm vào giỏ hàng thành công!'
  } catch (error) {
    console.error(error)
    message.value = 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.'
  }
}

const selectedVariant = computed(() => {
  if (!product.value || !selectedVariantId.value) return null
  return product.value.mau_ma.find((v) => v.id === selectedVariantId.value)
})

const formatCurrency = (value) => {
  if (!value) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

onMounted(() => {
  getProduct(route.params.id)
})
</script>

<template>
  <div class="page" v-if="product">
    <div class="row">
      <div class="col-md-6">
        <!-- Hiển thị hình ảnh -->
        <div v-for="anh in product.hinh_anh" :key="anh.id" class="mb-2">
          <img :src="`http://localhost:3000/${anh.url_hinh_anh}`" class="img-fluid rounded" />
        </div>
      </div>
      <div class="col-md-6">
        <h2>{{ product.ten_san_pham }}</h2>
        <hr />
        <p><strong>Thương hiệu:</strong> {{ product.ten_thuong_hieu }}</p>
        <p><strong>Danh mục:</strong> {{ product.ten_danh_muc }}</p>
        <p>{{ product.mo_ta }}</p>

        <div class="price my-3">
          <h3 class="text-danger">{{ formatCurrency(selectedVariant?.gia_ban) }}</h3>
        </div>

        <!-- Chọn mẫu mã -->
        <div class="form-group">
          <label for="variant"><strong>Chọn mẫu mã:</strong></label>
          <select id="variant" class="form-select" v-model="selectedVariantId">
            <option v-for="variant in product.mau_ma" :key="variant.id" :value="variant.id">
              {{ variant.ten_mau_ma }}
            </option>
          </select>
        </div>

        <!-- Chọn số lượng -->
        <div class="form-group mt-3">
          <label for="quantity"><strong>Số lượng:</strong></label>
          <input
            type="number"
            id="quantity"
            class="form-control"
            v-model="quantity"
            min="1"
            style="width: 100px"
          />
        </div>
        <small v-if="selectedVariant" class="text-muted">
          Còn lại: {{ selectedVariant.so_luong_ton }} sản phẩm
        </small>

        <!-- Nút Thêm vào giỏ -->
        <div class="mt-4">
          <button class="btn btn-primary btn-lg" @click="addToCart">
            <i class="fas fa-cart-plus"></i> Thêm vào giỏ hàng
          </button>
        </div>

        <p v-if="message" class="alert alert-success mt-3">{{ message }}</p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Đang tải thông tin sản phẩm...</p>
  </div>
</template>

<style scoped>
.img-fluid {
  max-height: 400px;
}
</style>
