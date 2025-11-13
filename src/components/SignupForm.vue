<script setup>
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { ref } from 'vue'

const emit = defineEmits(['submit:signup'])

const localUser = ref({
  ho_ten: '',
  email: '',
  mat_khau: '',
  passwordConfirmation: '',
})

const userFormSchema = yup.object().shape({
  ho_ten: yup.string().required('Họ tên là bắt buộc.').min(2, 'Tên phải có ít nhất 2 ký tự.'),
  email: yup.string().required('Email là bắt buộc.').email('Email không hợp lệ.'),
  mat_khau: yup
    .string()
    .required('Mật khẩu là bắt buộc.')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('mat_khau'), null], 'Mật khẩu xác nhận không khớp.')
    .required('Xác nhận mật khẩu là bắt buộc.'),
})

const submitUser = () => {
  emit('submit:signup', localUser.value)
}
</script>

<template>
  <Form @submit="submitUser" :validation-schema="userFormSchema">
    <div class="form-group">
      <label for="ho_ten">Họ tên</label>
      <Field name="ho_ten" type="text" class="form-control" v-model="localUser.ho_ten" />
      <ErrorMessage name="ho_ten" class="error-feedback" />
    </div>
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
    <div class="form-group">
      <label for="passwordConfirmation">Xác nhận Mật khẩu</label>
      <Field
        name="passwordConfirmation"
        type="password"
        class="form-control"
        v-model="localUser.passwordConfirmation"
      />
      <ErrorMessage name="passwordConfirmation" class="error-feedback" />
    </div>
    <div class="form-group mt-3">
      <button class="btn btn-primary">Đăng ký</button>
    </div>
  </Form>
</template>

<style scoped>
@import '@/assets/form.css';
</style>
