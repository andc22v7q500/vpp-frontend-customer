import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue' // Import component

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView, // Đăng ký component
    },

    {
      path: '/san-pham/:id', // URL sẽ có dạng /san-pham/1, /san-pham/2...
      name: 'product.detail', // Tên này phải KHỚP với tên trong <router-link>
      component: () => import('../views/ProductDetailView.vue'),
      props: true, // Tự động truyền :id từ URL vào làm prop cho component
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    // --- THÊM CÁC ROUTE MỚI ĐƯỢC BẢO VỆ ---
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/order-history',
      name: 'order.history',
      // Tạm thời trỏ đến ProfileView, chúng ta sẽ tạo trang riêng sau
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      // Tạm thời trỏ đến ProfileView, chúng ta sẽ tạo trang riêng sau
      component: () => import('../views/ProfileView.vue'),
    },
  ],
})

export default router
