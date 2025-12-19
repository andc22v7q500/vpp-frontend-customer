<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SanPhamService from '@/services/san-pham.service'
import DanhMucService from '@/services/danh-muc.service'
import ThuongHieuService from '@/services/thuong-hieu.service'
import ProductCard from '@/components/ProductCard.vue'
import AppBanner from '@/components/AppBanner.vue'

const products = ref([])
const categories = ref([])
const brands = ref([])
const route = useRoute()
const router = useRouter()

const retrieveProducts = async () => {
  try {
    const params = route.query
    products.value = await SanPhamService.getAll(params)
  } catch (error) {
    console.error(error)
  }
}

const initFilters = async () => {
  try {
    const [catRes, brandRes] = await Promise.all([
      DanhMucService.getAll(),
      ThuongHieuService.getAll(),
    ])
    categories.value = catRes
    brands.value = brandRes
  } catch (error) {
    console.error(error)
  }
}

// Hàm xử lý khi chọn Dropdown
const handleFilterChange = (type, event) => {
  const value = event.target.value // Lấy giá trị từ option đã chọn
  const newQuery = { ...route.query }

  if (value) {
    newQuery[type] = value
  } else {
    delete newQuery[type] // Nếu chọn "Tất cả" (value rỗng) thì xóa query
  }

  router.push({ name: 'home', query: newQuery })
}

// Hàm reset bộ lọc
const clearFilters = () => {
  router.push({ name: 'home' }) // Về trang chủ không có query
}

watch(
  () => route.query,
  () => {
    retrieveProducts()
  },
  { immediate: true },
)

onMounted(() => {
  initFilters()
})
</script>

<template>
  <div class="container">
    <AppBanner />

    <!-- === THANH LỌC GỌN GÀNG (DROPDOWN) === -->
    <div class="card p-3 mb-4 shadow-sm border-0 bg-light">
      <div class="row align-items-center">
        <div class="col-md-2 fw-bold text-secondary"><i class="fas fa-filter"></i> Bộ lọc:</div>

        <!-- Dropdown Danh mục -->
        <div class="col-md-4">
          <select
            class="form-select"
            :value="route.query.danhmuc || ''"
            @change="handleFilterChange('danhmuc', $event)"
          >
            <option value="">-- Tất cả Danh mục --</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.ten_danh_muc }}
            </option>
          </select>
        </div>

        <!-- Dropdown Thương hiệu -->
        <div class="col-md-4">
          <select
            class="form-select"
            :value="route.query.thuonghieu || ''"
            @change="handleFilterChange('thuonghieu', $event)"
          >
            <option value="">-- Tất cả Thương hiệu --</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.ten_thuong_hieu }}
            </option>
          </select>
        </div>

        <!-- Nút Xóa lọc -->
        <div class="col-md-2 text-end">
          <button
            class="btn btn-outline-danger w-100"
            @click="clearFilters"
            v-if="Object.keys(route.query).length > 0"
          >
            <i class="fas fa-times"></i> Xóa lọc
          </button>
        </div>
      </div>
    </div>

    <h2 class="my-4 text-center section-title">Sản phẩm nổi bật</h2>

    <div class="row" v-if="products.length > 0">
      <div v-for="product in products" :key="product.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <ProductCard :product="product" />
      </div>
    </div>
    <div v-else class="text-center py-5">
      <div class="empty-state">
        <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
        <p class="text-muted">Không tìm thấy sản phẩm nào phù hợp.</p>
        <button class="btn btn-primary" @click="clearFilters">Xem tất cả sản phẩm</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Làm đẹp tiêu đề */
.section-title {
  position: relative;
  font-weight: 700;
  color: #2c3e50;
}
/* Style cho Dropdown đẹp hơn */
.form-select {
  border-radius: 20px;
  border: 1px solid #ced4da;
  padding-left: 15px;
  cursor: pointer;
}
.form-select:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
  border-color: #86b7fe;
}
</style>
