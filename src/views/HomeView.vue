<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router' // Import useRoute
import SanPhamService from '@/services/san-pham.service'
import ProductCard from '@/components/ProductCard.vue'
import AppBanner from '@/components/AppBanner.vue'

const products = ref([])
const route = useRoute() // Khởi tạo route

const retrieveProducts = async () => {
  try {
    // Lấy các tham số từ URL (ví dụ: ?search=bút)
    const params = route.query
    products.value = await SanPhamService.getAll(params)
  } catch (error) {
    console.error(error)
  }
}

// Theo dõi sự thay đổi của URL (khi người dùng tìm kiếm)
watch(
  () => route.query,
  () => {
    retrieveProducts()
  },
  { immediate: true },
) // immediate: true để chạy ngay lần đầu tiên
</script>

<template>
  <div class="container">
    <AppBanner />
    <h1 class="my-4">Danh sách Sản phẩm</h1>
    <div class="row">
      <!-- Dùng v-for để lặp qua danh sách sản phẩm -->
      <div v-for="product in products" :key="product.id" class="col-lg-3 col-md-4 col-sm-6 mb-4">
        <!-- Truyền dữ liệu sản phẩm vào component ProductCard qua prop -->
        <ProductCard :product="product" />
      </div>
    </div>
  </div>
</template>
