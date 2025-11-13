<script setup>
// Định nghĩa các props mà component này sẽ nhận từ component cha
defineProps({
  product: {
    type: Object,
    required: true,
  },
})

// Hàm định dạng tiền tệ
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>

<template>
  <div class="card h-100">
    <!-- Hình ảnh sản phẩm -->
    <img
      :src="`http://localhost:3000/${product.hinh_anh_dai_dien}`"
      class="card-img-top"
      alt="..."
      v-if="product.hinh_anh_dai_dien"
    />
    <div
      v-else
      class="card-img-top text-center bg-light d-flex align-items-center justify-content-center"
      style="height: 200px"
    >
      <small>No Image</small>
    </div>

    <!-- Thân card -->
    <div class="card-body">
      <h5 class="card-title">{{ product.ten_san_pham }}</h5>
      <p class="card-text text-danger">
        <strong>{{ formatCurrency(product.gia_thap_nhat) }}</strong>
      </p>
    </div>

    <!-- Nút xem chi tiết -->
    <div class="card-footer">
      <router-link
        :to="{ name: 'product.detail', params: { id: product.id } }"
        class="btn btn-primary w-100"
      >
        Xem chi tiết
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.card-title {
  height: 48px;
  overflow: hidden;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
}
</style>
