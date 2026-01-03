<script setup>
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppChatbox from '@/components/AppChatbox.vue'
import AppFooter from '@/components/AppFooter.vue'

const route = useRoute()
</script>

<template>
  <AppHeader />

  <main class="container mt-4" style="min-height: 80vh">
    <div class="row justify-content-center">
      <!-- NẾU layout là 'wide', dùng col-12 (full), NGƯỢC LẠI dùng col-md-8 (hẹp) -->
      <div :class="route.meta.layout === 'wide' ? 'col-12' : 'col-md-8'">
        <RouterView />
      </div>
    </div>
  </main>
  <AppChatbox />
  <!-- Chúng ta có thể thêm AppFooter ở đây sau -->
  <AppFooter />
</template>

<style>
/* CSS toàn cục */
body {
  background-color: #f8f9fa;

  padding-top: 70px; /* Tạo một khoảng đệm ở trên cùng của trang */
}
.page {
  width: 100%;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
