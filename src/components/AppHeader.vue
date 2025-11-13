<script setup>
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { computed } from 'vue'

const authStore = useAuthStore()

// Dùng computed property để tự động cập nhật khi state thay đổi
const user = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
  // Sau khi logout, có thể chuyển hướng về trang chủ hoặc trang login
  // Chúng ta sẽ làm điều này trong component sau
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container">
      <RouterLink class="navbar-brand" :to="{ name: 'home' }"> VPP-Shop </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'home' }">
              <i class="fas fa-home"></i> Trang chủ
            </RouterLink>
          </li>
        </ul>

        <ul class="navbar-nav">
          <!-- Nếu người dùng đã đăng nhập -->
          <li v-if="user" class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fas fa-user"></i> Chào, {{ user.ho_ten }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <RouterLink class="dropdown-item" :to="{ name: 'profile' }">
                  Thông tin tài khoản
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" :to="{ name: 'order.history' }">
                  Lịch sử mua hàng
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="handleLogout"> Đăng xuất </a>
              </li>
            </ul>
          </li>

          <!-- Nếu người dùng chưa đăng nhập -->
          <li v-else class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'login' }">
              <i class="fas fa-sign-in-alt"></i> Đăng nhập
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'cart' }">
              <i class="fas fa-shopping-cart"></i> Giỏ hàng
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-brand {
  font-weight: bold;
}
.dropdown-menu {
  min-width: auto;
}
</style>
