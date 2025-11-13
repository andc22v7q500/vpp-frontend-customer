<script setup>
import { ref, onMounted } from 'vue'
import SanPhamService from '@/services/san-pham.service'
import ProductCard from '@/components/ProductCard.vue'

// Biến reactive để lưu danh sách sản phẩm
const products = ref([])

// Hàm để gọi API và lấy dữ liệu
const retrieveProducts = async () => {
  try {
    products.value = await SanPhamService.getAll()
  } catch (error) {
    console.error(error)
  }
}

// Gọi hàm retrieveProducts khi component được mounted (tải lần đầu)
onMounted(() => {
  retrieveProducts()
})
</script>

<template>
  <div class="container">
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
