<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { ref, computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const searchTerm = ref('')

// Dùng computed property để tự động cập nhật khi state thay đổi
const user = computed(() => authStore.user)

const handleSearch = () => {
  if (searchTerm.value.trim()) {
    // Chuyển hướng đến trang chủ và truyền từ khóa tìm kiếm qua query
    router.push({ name: 'home', query: { search: searchTerm.value.trim() } })
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'home' }) // Sau khi logout, quay về trang chủ
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
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
        <!-- Thanh tìm kiếm ở giữa -->
        <div class="mx-auto" style="width: 50%">
          <form class="d-flex" @submit.prevent="handleSearch">
            <input
              class="form-control me-0"
              type="search"
              placeholder="Bạn muốn tìm gì hôm nay?"
              aria-label="Search"
              v-model="searchTerm"
            />
            <button class="btn btn-search" type="submit">
              <i class="fas fa-search"></i>
            </button>
          </form>
        </div>

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
                <RouterLink class="dropdown-item" :to="{ name: 'address.book' }">
                  Đia chỉ
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

<!-- Style -->
<style scoped>
.navbar-brand {
  font-weight: 800;
  color: #0d6efd !important; /* Màu xanh chủ đạo (Primary Blue) */
  font-size: 1.5rem;
  letter-spacing: 1px;
}

.form-control {
  border-radius: 20px 0 0 20px;
  border: 1px solid #ced4da;
  border-right: none; /* Bỏ viền phải */
}

.btn-search {
  background-color: #0d6efd; /* Dùng màu xanh giống Logo */
  color: white;
  border: 1px solid #0d6efd;
  border-radius: 0 20px 20px 0;
  padding-left: 20px;
  padding-right: 20px;
  transition: all 0.3s;
}

.btn-search:hover {
  background-color: #0b5ed7; /* Màu xanh đậm hơn khi hover */
  border-color: #0b5ed7;
}

.form-control:focus {
  box-shadow: none;
  border-color: #0d6efd;
}
</style>
