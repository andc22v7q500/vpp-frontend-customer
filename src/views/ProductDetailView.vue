<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SanPhamService from '@/services/san-pham.service'

const product = ref(null)
const route = useRoute() // Dùng để lấy params từ URL

const getProduct = async (id) => {
  try {
    product.value = await SanPhamService.get(id)
  } catch (error) {
    console.error(error)
    // Có thể chuyển hướng đến trang Not Found ở đây
  }
}

// Gọi hàm khi component được tải, lấy id từ route.params
onMounted(() => {
  getProduct(route.params.id)
})
</script>

<template>
  <div class="container" v-if="product">
    <h1>Chi tiết sản phẩm</h1>
    <h2>{{ product.ten_san_pham }}</h2>
    <p><strong>Thương hiệu:</strong> {{ product.ten_thuong_hieu }}</p>
    <p><strong>Danh mục:</strong> {{ product.ten_danh_muc }}</p>
    <p>{{ product.mo_ta }}</p>

    <h3>Các mẫu mã:</h3>
    <ul>
      <li v-for="mau in product.mau_ma" :key="mau.id">
        {{ mau.ten_mau_ma }} - Giá: {{ mau.gia_ban }} - Tồn kho: {{ mau.so_luong_ton }}
      </li>
    </ul>

    <h3>Hình ảnh:</h3>
    <div v-for="anh in product.hinh_anh" :key="anh.id">
      <img
        :src="`http://localhost:3000/${anh.url_hinh_anh}`"
        style="max-width: 200px; margin: 5px"
      />
    </div>
  </div>
  <div v-else>
    <p>Đang tải thông tin sản phẩm...</p>
  </div>
</template>
