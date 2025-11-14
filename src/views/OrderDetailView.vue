<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DonHangService from '@/services/don-hang.service'

const order = ref(null)
const route = useRoute()

const getOrderDetail = async (id) => {
  try {
    order.value = await DonHangService.getForUser(id)
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
  getOrderDetail(route.params.id)
})
</script>

<template>
  <div class="page" v-if="order">
    <h4>Chi tiết Đơn hàng #{{ order.id }}</h4>
    <hr />
    <p><strong>Ngày đặt:</strong> {{ formatDate(order.ngay_dat) }}</p>
    <p><strong>Trạng thái:</strong> {{ getStatusText(order.trang_thai) }}</p>
    <p><strong>Địa chỉ giao hàng:</strong></p>
    <pre>{{ order.dia_chi_giao_hang }}</pre>

    <h5 class="mt-4">Các sản phẩm đã mua</h5>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Sản phẩm</th>
          <th scope="col" class="text-end">Đơn giá</th>
          <th scope="col" class="text-center">Số lượng</th>
          <th scope="col" class="text-end">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in order.chi_tiet" :key="item.id">
          <td>
            {{ item.ten_san_pham }}
            <br />
            <small class="text-muted">{{ item.ten_mau_ma }}</small>
          </td>
          <td class="text-end">{{ formatCurrency(item.don_gia) }}</td>
          <td class="text-center">{{ item.so_luong }}</td>
          <td class="text-end">{{ formatCurrency(item.don_gia * item.so_luong) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="text-end">
      <h4>
        Tổng tiền: <span class="text-danger">{{ formatCurrency(order.tong_tien) }}</span>
      </h4>
    </div>
  </div>
  <div v-else>
    <p>Đang tải chi tiết đơn hàng...</p>
  </div>
</template>

<style scoped>
pre {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  white-space: pre-wrap; /* Cho phép xuống dòng */
}
</style>
