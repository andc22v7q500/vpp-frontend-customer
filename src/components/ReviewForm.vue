<script setup>
import { ref } from 'vue'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'

const emit = defineEmits(['submit:review'])

const reviewData = ref({ so_sao: 5, binh_luan: '' })

const reviewSchema = yup.object().shape({
  binh_luan: yup.string().required('Vui lòng nhập bình luận của bạn.'),
  so_sao: yup.number().min(1).max(5),
})

const submitReview = () => {
  emit('submit:review', reviewData.value)
}
</script>
<template>
  <Form @submit="submitReview" :validation-schema="reviewSchema">
    <div class="form-group mb-2">
      <label>Đánh giá của bạn:</label>
      <div class="rating">
        <span
          v-for="star in 5"
          :key="star"
          class="fa-star"
          :class="star <= reviewData.so_sao ? 'fas text-warning' : 'far'"
          @click="reviewData.so_sao = star"
        >
        </span>
      </div>
    </div>
    <div class="form-group mb-2">
      <Field
        as="textarea"
        name="binh_luan"
        class="form-control"
        v-model="reviewData.binh_luan"
        rows="3"
        placeholder="Viết bình luận của bạn ở đây..."
      />
      <ErrorMessage name="binh_luan" class="error-feedback" />
    </div>
    <button type="submit" class="btn btn-primary">Gửi đánh giá</button>
  </Form>
</template>
<style scoped>
.rating .fa-star {
  cursor: pointer;
  font-size: 1.5rem;
  margin-right: 5px;
}
</style>
