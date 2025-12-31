<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000') // Kết nối tới server Back-end
const isOpen = ref(false)
const messageInput = ref('')
const messages = ref([
  { sender: 'bot', text: 'Xin chào! Tôi là trợ lý ảo VPP. Bạn cần giúp gì không?' },
])
const messagesContainer = ref(null)

const toggleChat = () => {
  isOpen.value = !isOpen.value
  scrollToBottom()
}

const sendMessage = () => {
  if (!messageInput.value.trim()) return

  // 1. Hiển thị tin nhắn của người dùng lên màn hình
  messages.value.push({ sender: 'user', text: messageInput.value })

  // 2. Gửi tin nhắn qua Socket về server
  socket.emit('chat-message', messageInput.value)

  // 3. Xóa ô nhập liệu
  messageInput.value = ''
  scrollToBottom()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  // Lắng nghe sự kiện 'bot-reply' từ server
  socket.on('bot-reply', (reply) => {
    messages.value.push({ sender: 'bot', text: reply })
    scrollToBottom()
  })
})

onUnmounted(() => {
  socket.disconnect()
})
</script>

<template>
  <div class="chat-container">
    <!-- Nút mở chat -->
    <button class="chat-toggle-btn" @click="toggleChat" v-if="!isOpen">
      <i class="fas fa-comments"></i> Hỗ trợ
    </button>

    <!-- Cửa sổ chat -->
    <div class="chat-window" v-if="isOpen">
      <div class="chat-header">
        <span>Góc hỗ trợ nhỏ</span>
        <button class="close-btn" @click="toggleChat">&times;</button>
      </div>

      <div class="chat-body" ref="messagesContainer">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message"
          :class="msg.sender === 'user' ? 'message-user' : 'message-bot'"
        >
          {{ msg.text }}
        </div>
      </div>

      <div class="chat-footer">
        <input
          v-model="messageInput"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Nhập tin nhắn..."
        />
        <button @click="sendMessage"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000; /* Luôn nổi lên trên cùng */
  font-family: sans-serif;
}

.chat-toggle-btn {
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 15px 20px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}
.chat-toggle-btn:hover {
  transform: scale(1.05);
}

.chat-window {
  width: 350px;
  height: 450px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background-color: #0d6efd;
  color: white;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.chat-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 14px;
  line-height: 1.4;
}

.message-user {
  align-self: flex-end;
  background-color: #0d6efd;
  color: white;
  border-bottom-right-radius: 2px;
}

.message-bot {
  align-self: flex-start;
  background-color: #e9ecef;
  color: #333;
  border-bottom-left-radius: 2px;
}

.chat-footer {
  padding: 10px;
  border-top: 1px solid #dee2e6;
  display: flex;
  gap: 10px;
}

.chat-footer input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 20px;
  outline: none;
}

.chat-footer button {
  background: none;
  border: none;
  color: #0d6efd;
  font-size: 18px;
  cursor: pointer;
}
</style>
