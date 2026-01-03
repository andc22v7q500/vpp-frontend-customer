<script setup>
import bannerImage from '@/assets/images/banner-vpp.jpg'
</script>

<template>
  <div class="banner my-4">
    <img :src="bannerImage" class="img-fluid rounded shadow-sm" alt="VPP Shop Banner" />
  </div>
</template>

<style scoped>
.banner img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
}
</style>
