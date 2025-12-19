<script setup>
// Import ảnh để Vite xử lý đường dẫn đúng khi build
import bannerImage from '@/assets/images/banner-vpp.jpg'
</script>

<template>
  <div class="banner my-4">
    <!-- Dùng biến bannerImage đã import -->
    <img :src="bannerImage" class="img-fluid rounded shadow-sm" alt="VPP Shop Banner" />
  </div>
</template>

<style scoped>
/* Thêm chút style để banner không bị vỡ trên màn hình lớn */
.banner img {
  width: 100%;
  max-height: 400px; /* Giới hạn chiều cao để không chiếm hết màn hình */
  object-fit: cover; /* Cắt ảnh đẹp nếu tỉ lệ không khớp */
}
</style>
