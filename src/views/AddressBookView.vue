<script setup>
import { ref, onMounted } from 'vue'
import DiaChiService from '@/services/dia-chi.service'
import AddressForm from '@/components/AddressForm.vue'

const addresses = ref([])
const activeAddress = ref(null)
const message = ref('')

const retrieveAddresses = async () => {
  try {
    addresses.value = await DiaChiService.getAll()
  } catch (error) {
    console.error(error)
  }
}

const handleAddressSubmit = async (data) => {
  try {
    if (data.id) {
      // Cập nhật địa chỉ
      await DiaChiService.update(data.id, data)
      message.value = 'Địa chỉ đã được cập nhật thành công.'
    } else {
      // Thêm địa chỉ mới
      await DiaChiService.create(data)
      message.value = 'Địa chỉ mới đã được thêm thành công.'
    }
    // Reset form và tải lại danh sách
    activeAddress.value = null
    retrieveAddresses()
  } catch (error) {
    console.error(error)
    message.value = 'Có lỗi xảy ra.'
  }
}

const handleAddressDelete = async (id) => {
  if (confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
    try {
      await DiaChiService.delete(id)
      message.value = 'Địa chỉ đã được xóa thành công.'
      retrieveAddresses()
    } catch (error) {
      console.error(error)
      message.value = 'Có lỗi xảy ra.'
    }
  }
}

const selectAddress = (address) => {
  activeAddress.value = { ...address }
  message.value = ''
}

const newAddress = () => {
  activeAddress.value = {
    ten_nguoi_nhan: '',
    so_dien_thoai: '',
    dia_chi_cu_the: '',
    phuong_xa: '',
    quan_huyen: '',
    tinh_thanh: '',
  }
  message.value = ''
}

onMounted(() => {
  retrieveAddresses()
})
</script>

<template>
  <div class="page row">
    <div class="col-md-5">
      <h4>
        Sổ địa chỉ
        <i class="fas fa-address-book"></i>
      </h4>
      <ul class="list-group">
        <li
          class="list-group-item"
          v-for="address in addresses"
          :key="address.id"
          @click="selectAddress(address)"
          :class="{ active: activeAddress && activeAddress.id === address.id }"
        >
          <strong>{{ address.ten_nguoi_nhan }}</strong> - {{ address.so_dien_thoai }}
          <br />
          <small
            >{{ address.dia_chi_cu_the }}, {{ address.phuong_xa }}, {{ address.quan_huyen }},
            {{ address.tinh_thanh }}</small
          >
        </li>
      </ul>
      <button class="btn btn-primary mt-3" @click="newAddress">
        <i class="fas fa-plus"></i> Thêm địa chỉ mới
      </button>
    </div>
    <div class="col-md-7">
      <div v-if="activeAddress">
        <h4>
          {{ activeAddress.id ? 'Hiệu chỉnh Địa chỉ' : 'Thêm Địa chỉ mới' }}
          <i class="fas fa-edit"></i>
        </h4>
        <AddressForm
          :address="activeAddress"
          @submit:address="handleAddressSubmit"
          @delete:address="handleAddressDelete"
        />
        <p class="mt-3">{{ message }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.list-group-item {
  cursor: pointer;
}
.list-group-item.active {
  z-index: 2;
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}
</style>
