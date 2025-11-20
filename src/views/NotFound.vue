<template>
  <div class="page text-center">
    <h1 class="display-1">404</h1>
    <h2>Không tìm thấy trang</h2>
    <p class="lead">Oops! Có vẻ như trang bạn đang tìm kiếm không tồn tại.</p>
    <router-link :to="{ name: 'home' }" class="btn btn-primary"> Về trang chủ </router-link>
  </div>
</template>
