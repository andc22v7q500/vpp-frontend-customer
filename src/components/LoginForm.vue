<script setup>
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { ref } from 'vue'

// Định nghĩa emit để gửi dữ liệu lên component cha
const emit = defineEmits(['submit:login'])

const localUser = ref({
  email: '',
  mat_khau: '',
})

const userFormSchema = yup.object().shape({
  email: yup.string().required('Email là bắt buộc.').email('Email không hợp lệ.'),
  mat_khau: yup.string().required('Mật khẩu là bắt buộc.'),
})

const submitUser = () => {
  emit('submit:login', localUser.value)
}
</script>

<template>
  <Form @submit="submitUser" :validation-schema="userFormSchema">
    <div class="form-group">
      <label for="email">Email</label>
      <Field name="email" type="email" class="form-control" v-model="localUser.email" />
      <ErrorMessage name="email" class="error-feedback" />
    </div>
    <div class="form-group">
      <label for="mat_khau">Mật khẩu</label>
      <Field name="mat_khau" type="password" class="form-control" v-model="localUser.mat_khau" />
      <ErrorMessage name="mat_khau" class="error-feedback" />
    </div>
    <div class="form-group mt-3">
      <button class="btn btn-primary">Đăng nhập</button>
    </div>
  </Form>
</template>

<style scoped>
@import '@/assets/form.css';
</style>
