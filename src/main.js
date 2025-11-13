// src/main.js

import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' // <-- Đã import createPinia chưa?

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // <-- Có gọi hàm createPinia() bên trong use() không?
app.use(router)

app.mount('#app')
