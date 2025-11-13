<script setup>
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { toRef } from 'vue'

const props = defineProps({
  address: { type: Object, required: true },
})
const emit = defineEmits(['submit:address', 'delete:address'])

const localAddress = toRef(props, 'address')

const addressFormSchema = yup.object().shape({
  ten_nguoi_nhan: yup.string().required('Tên người nhận là bắt buộc.'),
  so_dien_thoai: yup
    .string()
    .required('Số điện thoại là bắt buộc.')
    .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
  dia_chi_cu_the: yup.string().required('Địa chỉ cụ thể là bắt buộc.'),
  tinh_thanh: yup.string().required('Tỉnh/Thành phố là bắt buộc.'),
  quan_huyen: yup.string().required('Quận/Huyện là bắt buộc.'),
  phuong_xa: yup.string().required('Phường/Xã là bắt buộc.'),
})

const submitAddress = () => {
  emit('submit:address', localAddress.value)
}

const deleteAddress = () => {
  emit('delete:address', localAddress.value.id)
}
</script>

<template>
  <Form
    @submit="submitAddress"
    :validation-schema="addressFormSchema"
    :initial-values="localAddress"
  >
    <div class="form-group">
      <label for="ten_nguoi_nhan">Tên người nhận</label>
      <Field
        name="ten_nguoi_nhan"
        type="text"
        class="form-control"
        v-model="localAddress.ten_nguoi_nhan"
      />
      <ErrorMessage name="ten_nguoi_nhan" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="so_dien_thoai">Số điện thoại</label>
      <Field
        name="so_dien_thoai"
        type="text"
        class="form-control"
        v-model="localAddress.so_dien_thoai"
      />
      <ErrorMessage name="so_dien_thoai" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="tinh_thanh">Tỉnh/Thành phố</label>
      <Field name="tinh_thanh" type="text" class="form-control" v-model="localAddress.tinh_thanh" />
      <ErrorMessage name="tinh_thanh" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="quan_huyen">Quận/Huyện</label>
      <Field name="quan_huyen" type="text" class="form-control" v-model="localAddress.quan_huyen" />
      <ErrorMessage name="quan_huyen" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="phuong_xa">Phường/Xã</label>
      <Field name="phuong_xa" type="text" class="form-control" v-model="localAddress.phuong_xa" />
      <ErrorMessage name="phuong_xa" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="dia_chi_cu_the">Địa chỉ cụ thể (Số nhà, tên đường...)</label>
      <Field
        name="dia_chi_cu_the"
        type="text"
        class="form-control"
        v-model="localAddress.dia_chi_cu_the"
      />
      <ErrorMessage name="dia_chi_cu_the" class="error-feedback" />
    </div>

    <div class="form-group mt-3">
      <button class="btn btn-primary" type="submit">Lưu</button>
      <button
        v-if="localAddress.id"
        class="btn btn-danger ms-2"
        type="button"
        @click="deleteAddress"
      >
        Xóa
      </button>
    </div>
  </Form>
</template>

<style scoped>
@import '@/assets/form.css';
</style>
