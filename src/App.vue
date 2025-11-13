<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />

  <main class="container py-4">
    <RouterView />
  </main>

  <!-- Chúng ta có thể thêm AppFooter ở đây sau -->
</template>

<style>
/* CSS toàn cục */
body {
  background-color: #f8f9fa;
  /* THÊM DÒNG NÀY VÀO */
  padding-top: 70px; /* Tạo một khoảng đệm ở trên cùng của trang */
}
.page {
  max-width: 700px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
