<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import SanPhamService from '@/services/san-pham.service'
import GioHangService from '@/services/gio-hang.service'
import { useAuthStore } from '@/stores/auth.store'
import DanhGiaService from '@/services/danh-gia.service'
import ReviewForm from '@/components/ReviewForm.vue'

const product = ref(null)
const route = useRoute()
const authStore = useAuthStore()

// Biến để lưu lựa chọn của người dùng
const selectedVariantId = ref(null)
const quantity = ref(1)
const message = ref('')
const activeImageUrl = ref('')
const canUserReview = ref(false)
const reviewMessage = ref('')

const checkReviewPermission = async (productId) => {
  if (!authStore.user) {
    canUserReview.value = false
    return
  }
  try {
    const response = await DanhGiaService.checkPermission(productId)
    canUserReview.value = response.canReview
  } catch {
    canUserReview.value = false
  }
}
const getProduct = async (id) => {
  try {
    product.value = await SanPhamService.get(id)
    if (product.value?.mau_ma?.length > 0) {
      selectedVariantId.value = product.value.mau_ma[0].id
    }
    // SAU KHI LẤY SẢN PHẨM, GÁN ẢNH ĐẦU TIÊN LÀM ẢNH CHÍNH
    if (product.value?.hinh_anh?.length > 0) {
      activeImageUrl.value = `http://localhost:3000/${product.value.hinh_anh[0].url_hinh_anh}`
    }
    await checkReviewPermission(id)
  } catch (error) {
    console.error(error)
  }
}

const handleReviewSubmit = async (reviewData) => {
  try {
    await DanhGiaService.create(product.value.id, reviewData)
    reviewMessage.value = 'Cảm ơn bạn đã gửi đánh giá!'
    // Tải lại toàn bộ thông tin sản phẩm để hiển thị đánh giá mới
    await getProduct(product.value.id)
  } catch (error) {
    console.error('HANDLE REVIEW SUBMIT ERROR:', error)
    reviewMessage.value = 'Gửi đánh giá thất bại. Vui lòng thử lại.'
  }
}

const changeActiveImage = (imageUrl) => {
  activeImageUrl.value = `http://localhost:3000/${imageUrl}`
}

const addToCart = async () => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!authStore.user) {
    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.')
    // Có thể chuyển hướng đến trang đăng nhập
    // router.push({ name: 'login', query: { returnUrl: route.fullPath } });
    return
  }

  if (!selectedVariantId.value || quantity.value < 1) {
    message.value = 'Vui lòng chọn mẫu mã và số lượng hợp lệ.'
    return
  }

  try {
    const data = {
      ma_mau_ma: selectedVariantId.value,
      so_luong: quantity.value,
    }
    await GioHangService.addItem(data)
    message.value = 'Sản phẩm đã được thêm vào giỏ hàng thành công!'
  } catch (error) {
    console.error(error)
    message.value = 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.'
  }
}

const selectedVariant = computed(() => {
  if (!product.value || !selectedVariantId.value) return null
  return product.value.mau_ma.find((v) => v.id === selectedVariantId.value)
})

const formatCurrency = (value) => {
  if (!value) return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const formatDate = (dateTimeString) => {
  if (!dateTimeString) return ''
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateTimeString).toLocaleDateString('vi-VN', options)
}

onMounted(() => {
  getProduct(route.params.id)
})
</script>

<template>
  <div class="page" v-if="product">
    <div class="row">
      <!-- === CỘT HÌNH ẢNH (BÊN TRÁI) - ĐÃ SỬA LỖI === -->
      <div class="col-md-7">
        <!-- Ảnh chính -->
        <div class="main-image-container mb-3">
          <img
            :src="activeImageUrl"
            class="img-fluid rounded main-image"
            v-if="activeImageUrl"
            :alt="product.ten_san_pham"
          />
          <div
            v-else
            class="d-flex justify-content-center align-items-center bg-light"
            style="height: 400px"
          >
            <small>No Image Available</small>
          </div>
        </div>

        <!-- Gallery ảnh thumbnail (ĐÃ ĐƯA VÀO ĐÚNG CHỖ) -->
        <div class="thumbnail-container" v-if="product.hinh_anh && product.hinh_anh.length > 1">
          <img
            v-for="anh in product.hinh_anh"
            :key="anh.id"
            :src="`http://localhost:3000/${anh.url_hinh_anh}`"
            class="thumbnail-image"
            :class="{ active: activeImageUrl.includes(anh.url_hinh_anh) }"
            @click="changeActiveImage(anh.url_hinh_anh)"
            :alt="`Thumbnail ${anh.id}`"
          />
        </div>
      </div>

      <!-- === CỘT THÔNG TIN & MUA HÀNG (BÊN PHẢI) - Giữ nguyên === -->
      <div class="col-md-5">
        <h2>{{ product.ten_san_pham }}</h2>
        <p class="text-muted">
          Thương hiệu: {{ product.ten_thuong_hieu }} | Danh mục: {{ product.ten_danh_muc }}
        </p>
        <hr />

        <div class="price my-3">
          <h3 class="text-danger fw-bold">{{ formatCurrency(selectedVariant?.gia_ban) }}</h3>
        </div>

        <div class="mb-3">
          <label for="variant" class="form-label"><strong>Chọn mẫu mã:</strong></label>
          <select id="variant" class="form-select" v-model="selectedVariantId">
            <option v-for="variant in product.mau_ma" :key="variant.id" :value="variant.id">
              {{ variant.ten_mau_ma }}
            </option>
          </select>
          <small v-if="selectedVariant" class="text-muted">
            Còn lại: {{ selectedVariant.so_luong_ton }} sản phẩm
          </small>
        </div>

        <div class="mb-3">
          <label for="quantity" class="form-label"><strong>Số lượng:</strong></label>
          <input
            type="number"
            id="quantity"
            class="form-control"
            v-model="quantity"
            min="1"
            style="width: 100px"
          />
        </div>

        <div class="d-grid gap-2 mt-4">
          <button class="btn btn-primary btn-lg" @click="addToCart">
            <i class="fas fa-cart-plus"></i> Thêm vào giỏ hàng
          </button>
        </div>

        <div v-if="message" class="alert alert-success mt-3" role="alert">
          {{ message }}
        </div>
      </div>
    </div>

    <!-- Phần mô tả sản phẩm ở dưới -->
    <div class="row mt-5" v-if="product && product.mo_ta">
      <div class="col-12">
        <h4>Mô tả sản phẩm</h4>
        <hr />
        <p>{{ product.mo_ta }}</p>
      </div>
    </div>
    <!-- === PHẦN ĐÁNH GIÁ SẢN PHẨM === -->
    <div class="row mt-5">
      <div class="col-12">
        <h4>Đánh giá sản phẩm ({{ product.danh_gia.length }})</h4>
        <hr />
        <!-- Form gửi đánh giá (sẽ làm ở bước sau) -->
        <div v-if="canUserReview" class="mb-4">
          <h5>Viết đánh giá của bạn</h5>
          <ReviewForm @submit:review="handleReviewSubmit" />
          <p v-if="reviewMessage" class="alert alert-info mt-2">{{ reviewMessage }}</p>
        </div>

        <!-- Danh sách các đánh giá đã có -->
        <div v-if="product.danh_gia.length > 0">
          <div v-for="review in product.danh_gia" :key="review.id" class="card mb-3">
            <div class="card-body">
              <h6 class="card-title">{{ review.ten_khach_hang }}</h6>
              <p class="card-subtitle mb-2 text-muted">
                Ngày: {{ formatDate(review.ngay_tao) }}
                <span class="ms-3">
                  Đánh giá:
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="fa-star"
                    :class="n <= review.so_sao ? 'fas text-warning' : 'far'"
                  ></span>
                </span>
              </p>
              <p class="card-text">{{ review.binh_luan }}</p>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Chưa có đánh giá nào cho sản phẩm này.</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<style scoped>
.main-image-container {
  border: 1px solid #dee2e6;
  padding: 5px;
  border-radius: 5px;
}
.main-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
}
.thumbnail-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Khoảng cách giữa các ảnh thumbnail */
}
.thumbnail-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 2px solid transparent;
  border-radius: 5px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.thumbnail-image:hover {
  border-color: #007bff;
}
.thumbnail-image.active {
  border-color: #007bff;
  box-shadow: 0 0 5px #007bff;
}
</style>
