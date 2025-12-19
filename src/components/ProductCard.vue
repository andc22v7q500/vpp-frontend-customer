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
        <strong v-if="product.gia_thap_nhat === product.gia_cao_nhat">
          {{ formatCurrency(product.gia_thap_nhat) }}
        </strong>
        <strong v-else> Từ {{ formatCurrency(product.gia_thap_nhat) }} </strong>
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
.card {
  border: none; /* Bỏ viền đen mặc định */
  border-radius: 12px; /* Bo tròn góc nhiều hơn */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* Bóng mờ nhẹ */
  transition: all 0.3s ease; /* Hiệu ứng mượt */
  overflow: hidden;
  height: 100%; /* Đảm bảo các card bằng nhau */
}

.card:hover {
  transform: translateY(-5px); /* Nổi lên khi di chuột */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); /* Bóng đậm hơn */
}

.card-img-top {
  height: 200px;
  object-fit: contain; /* Đảm bảo ảnh không bị méo */
  padding: 15px; /* Thêm khoảng cách để ảnh không dính lề */
}

.card-body {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  /* Giới hạn 2 dòng tiêu đề, dài quá thì ... */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 38px; /* Cố định chiều cao tiêu đề */
}

.price-text {
  color: #d70018; /* Màu đỏ đặc trưng của giá tiền */
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: auto; /* Đẩy giá xuống đáy body */
}
</style>
