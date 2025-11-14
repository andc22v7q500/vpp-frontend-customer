<script setup>
import { ref, onMounted } from 'vue'
import DonHangService from '@/services/don-hang.service'

const orders = ref([])

const retrieveOrders = async () => {
  try {
    orders.value = await DonHangService.getAllForUser()
  } catch (error) {
    console.error(error)
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const formatDate = (dateTimeString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateTimeString).toLocaleDateString('vi-VN', options)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'cho_xac_nhan':
      return 'text-warning'
    case 'dang_xu_ly':
      return 'text-info'
    case 'dang_giao':
      return 'text-primary'
    case 'hoan_thanh':
      return 'text-success'
    case 'da_huy':
      return 'text-danger'
    default:
      return 'text-muted'
  }
}

const getStatusText = (status) => {
  const statuses = {
    cho_xac_nhan: 'Chờ xác nhận',
    dang_xu_ly: 'Đang xử lý',
    dang_giao: 'Đang giao',
    hoan_thanh: 'Hoàn thành',
    da_huy: 'Đã hủy',
  }
  return statuses[status] || 'Không xác định'
}

onMounted(() => {
  retrieveOrders()
})
</script>

<template>
  <div class="page">
    <h4>
      Lịch sử Mua hàng
      <i class="fas fa-history"></i>
    </h4>
    <hr />
    <div v-if="orders.length > 0">
      <div v-for="order in orders" :key="order.id" class="card mb-3">
        <div class="card-header d-flex justify-content-between">
          <span>Đơn hàng #{{ order.id }}</span>
          <strong :class="getStatusClass(order.trang_thai)">
            {{ getStatusText(order.trang_thai) }}
          </strong>
        </div>
        <div class="card-body">
          <p class="card-text">Ngày đặt: {{ formatDate(order.ngay_dat) }}</p>
          <p class="card-text">
            Tổng tiền: <strong class="text-danger">{{ formatCurrency(order.tong_tien) }}</strong>
          </p>
          <router-link
            :to="{ name: 'order.detail', params: { id: order.id } }"
            class="btn btn-sm btn-outline-primary"
          >
            Xem chi tiết
          </router-link>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Bạn chưa có đơn hàng nào.</p>
    </div>
  </div>
</template>
