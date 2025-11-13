<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import KhachHangService from '@/services/khach-hang.service'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'

const authStore = useAuthStore()
const userProfile = ref(null)
const message = ref('')

const profileFormSchema = yup.object().shape({
  ho_ten: yup.string().required('Họ tên là bắt buộc.'),
  so_dien_thoai: yup
    .string()
    .matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
})

const getProfile = async () => {
  try {
    userProfile.value = await KhachHangService.getProfile()
  } catch (error) {
    console.error(error)
  }
}

const handleUpdateProfile = async (data) => {
  try {
    const updatedData = await KhachHangService.updateProfile(data)
    // Cập nhật lại thông tin trong Pinia Store và localStorage
    authStore.user.ho_ten = updatedData.data.ho_ten
    localStorage.setItem('user', JSON.stringify(authStore.user))
    message.value = 'Cập nhật thông tin thành công!'
  } catch (error) {
    console.error(error)
    message.value = 'Có lỗi xảy ra khi cập nhật.'
  }
}

onMounted(() => {
  getProfile()
})
</script>

<template>
  <div class="page" v-if="userProfile">
    <h4>Thông tin tài khoản</h4>
    <Form
      @submit="handleUpdateProfile"
      :validation-schema="profileFormSchema"
      :initial-values="userProfile"
    >
      <div class="form-group">
        <label for="ho_ten">Họ tên</label>
        <Field name="ho_ten" type="text" class="form-control" />
        <ErrorMessage name="ho_ten" class="error-feedback" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <Field name="email" type="email" class="form-control" disabled />
      </div>
      <div class="form-group">
        <label for="so_dien_thoai">Số điện thoại</label>
        <Field name="so_dien_thoai" type="text" class="form-control" />
        <ErrorMessage name="so_dien_thoai" class="error-feedback" />
      </div>

      <button type="submit" class="btn btn-primary mt-3">Cập nhật</button>
      <p v-if="message" class="alert alert-success mt-3">{{ message }}</p>
    </Form>
  </div>
</template>

<style scoped>
@import '@/assets/form.css';
</style>
